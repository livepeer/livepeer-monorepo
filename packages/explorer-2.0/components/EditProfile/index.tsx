import { useState, useEffect } from "react";
import { ThreeBoxSpace } from "../../@types";
import Box from "../Box";
import Flex from "../Flex";
import Camera from "../../public/img/camera.svg";
import Button from "../Button";
import ReactTooltip from "react-tooltip";
import Check from "../../public/img/check.svg";
import Copy from "../../public/img/copy.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Textfield from "../Textfield";
import useForm from "react-hook-form";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import QRCode from "qrcode.react";
import Modal from "../Modal";
import ExternalAccount from "../ExternalAccount";
import { useDebounce } from "use-debounce";
import ThreeBoxSteps from "../ThreeBoxSteps";
import Spinner from "../Spinner";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import Textarea from "../Textarea";
interface Props {
  account: string;
  threeBoxSpace?: ThreeBoxSpace;
  refetch?: any;
}

const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $name: String
    $website: String
    $description: String
    $image: String
    $proof: JSON
    $defaultProfile: String
  ) {
    updateProfile(
      name: $name
      website: $website
      description: $description
      image: $image
      proof: $proof
      defaultProfile: $defaultProfile
    ) {
      __typename
      id
      name
      website
      description
      image
      defaultProfile
    }
  }
`;

function hasExistingProfile(profile) {
  return (
    profile.name || profile.website || profile.description || profile.image
  );
}

const Index = ({ threeBoxSpace, refetch, account }: Props) => {
  const context = useWeb3React();
  const { register, handleSubmit, formState, watch } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [createProfileModalOpen, setCreateProfileModalOpen] = useState(false);
  const [existingProfileOpen, setExistingProfileOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [verified, setVerified] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [timestamp] = useState(Math.floor(Date.now() / 1000));
  const name = watch("name");
  const website = watch("website");
  const description = watch("description");
  const image = watch("image");
  const signature = watch("signature");
  const ethereumAccount = watch("ethereumAccount");
  const reader = new FileReader();
  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const [debouncedSignature] = useDebounce(signature, 200);
  const [debouncedEthereumAccount] = useDebounce(ethereumAccount, 200);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  useEffect(() => {
    setMessage(
      `Create a new 3Box profile<br /><br />-<br />Your unique profile ID is ${threeBoxSpace.did}<br />Timestamp: ${timestamp}`
    );
    (async () => {
      const ThreeBox = require("3box");
      const profile = await ThreeBox.getProfile(context.account);

      if (hasExistingProfile(profile)) {
        setHasProfile(true);
      }

      if (signature && ethereumAccount) {
        try {
          const verifiedAccount = ethers.utils.verifyMessage(
            message.replace(/<br ?\/?>/g, "\n"),
            signature
          );
          if (verifiedAccount.toLowerCase() === ethereumAccount.toLowerCase()) {
            setVerified(true);
          } else {
            setVerified(false);
          }
        } catch (e) {
          setVerified(false);
        }
      }
    })();
  }, [
    debouncedSignature,
    debouncedEthereumAccount,
    message,
    context.account,
    ethereumAccount,
    signature,
    threeBoxSpace,
    timestamp,
  ]);

  reader.onload = function (e) {
    setPreviewImage(e.target.result);
  };

  if (image && image.length) {
    reader.readAsDataURL(image[0]);
  }

  const onClick = async () => {
    const ThreeBox = require("3box");

    if (threeBoxSpace.defaultProfile) {
      setEditProfileOpen(true);
    } else {
      setCreateProfileModalOpen(true);
      const box = await ThreeBox.openBox(
        account,
        context.library._web3Provider
      );
      setActiveStep(1);
      await box.syncDone;

      // Create a 3box account if a user doesn't already have one
      if (!hasProfile) {
        await box.linkAddress();
        await box.syncDone;
        setActiveStep(2);
      }

      const space = await box.openSpace("livepeer");
      await space.syncDone;

      if (hasProfile) {
        setCreateProfileModalOpen(false);
        setExistingProfileOpen(true);
      } else {
        await updateProfile({
          variables: { defaultProfile: "livepeer" },
          context: {
            box,
            address: account,
          },
        });
        await space.syncDone;
        setCreateProfileModalOpen(false);
        setEditProfileOpen(true);
      }
    }
  };

  const proof = signature
    ? {
        version: 1,
        type: "ethereum-eoa",
        message: message.replace(/<br ?\/?>/g, "\n"),
        timestamp,
        signature,
      }
    : null;

  const onSubmit = async () => {
    const ThreeBox = require("3box");

    setSaving(true);
    const box = await ThreeBox.openBox(
      context.account,
      context.library._web3Provider
    );
    let hash = null;

    if (previewImage && image.length) {
      const formData = new window.FormData();
      formData.append("path", image[0]);
      const resp = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
        method: "post",
        body: formData,
      });
      const infuraResponse = await resp.json();
      hash = infuraResponse["Hash"];
    }

    const variables = {
      ...threeBoxSpace,
      ...(name && { name }),
      ...(website && { website }),
      ...(description && { description }),
      ...(hash && { image: hash }),
      ...(proof && { proof }),
      defaultProfile: threeBoxSpace.defaultProfile
        ? threeBoxSpace.defaultProfile
        : "livepeer",
    };

    const optimisticResponse = {
      __typename: "Mutation",
      updateProfile: {
        __typename: "ThreeBoxSpace",
        id: account.toLowerCase(),
        name: name ? name : threeBoxSpace.name,
        website: website ? website : threeBoxSpace.website,
        description: description ? description : threeBoxSpace.description,
        image: hash ? hash : threeBoxSpace.image,
        defaultProfile: threeBoxSpace.defaultProfile,
      },
    };

    const result = updateProfile({
      variables,
      optimisticResponse: !proof ? optimisticResponse : null,
      context: {
        box,
        address: account,
      },
    });

    // We don't use an optimistic response if user is linking external account
    if (proof) {
      await result;
      await refetch({
        variables: {
          account,
        },
      });
    }

    setSaving(false);
    setEditProfileOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => onClick()}
        css={{ mt: "3px", ml: "$3", fontWeight: 600 }}
        outline
        size="small"
      >
        {threeBoxSpace.defaultProfile ? "Edit Profile" : "Set up my profile"}
      </Button>
      <Modal isOpen={createProfileModalOpen} title="Profile Setup">
        <>
          <Box css={{ mb: "$3" }}>
            Approve the signing prompts in your web3 wallet to continue setting
            up your profile.
          </Box>
          <Box
            css={{
              border: "1px solid",
              borderColor: "$border",
              borderRadius: "$4",
              p: "$4",
              alignItems: "center",
              justifyContent: "center",
              mb: "$4",
            }}
          >
            <Flex
              css={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <ThreeBoxSteps hasProfile={hasProfile} activeStep={activeStep} />
            </Flex>
          </Box>
          <Flex css={{ justifyContent: "flex-end" }}>
            <Button outline onClick={() => setCreateProfileModalOpen(false)}>
              Close
            </Button>
          </Flex>
        </>
      </Modal>

      <Modal isOpen={existingProfileOpen} title="Use Existing Profile?">
        <>
          <Box
            css={{
              lineHeight: 1.5,
              border: "1px solid",
              borderColor: "$border",
              borderRadius: 6,
              p: "$4",
              alignItems: "center",
              justifyContent: "center",
              mb: "$4",
            }}
          >
            We recognized that you already have a 3box profile. Would you like
            to use it in Livepeer?
          </Box>
          <Flex css={{ justifyContent: "flex-end" }}>
            <Button
              css={{ mr: "$3" }}
              outline
              onClick={async () => {
                const ThreeBox = require("3box");
                const box = await ThreeBox.openBox(
                  context.account,
                  context.library._web3Provider
                );
                await updateProfile({
                  variables: {
                    defaultProfile: "livepeer",
                  },
                  context: {
                    box,
                    address: account.toLowerCase(),
                  },
                });
                await refetch({
                  variables: {
                    account: account.toLowerCase(),
                  },
                });
                setExistingProfileOpen(false);
                setEditProfileOpen(true);
              }}
            >
              Create New
            </Button>
            <Button
              onClick={async () => {
                const ThreeBox = require("3box");
                const box = await ThreeBox.openBox(
                  context.account,
                  context.library._web3Provider
                );
                await updateProfile({
                  variables: {
                    defaultProfile: "3box",
                  },
                  context: {
                    box,
                    address: account.toLowerCase(),
                  },
                });
                setExistingProfileOpen(false);
                setEditProfileOpen(true);
              }}
            >
              Use Existing
            </Button>
          </Flex>
        </>
      </Modal>
      <Modal
        isOpen={editProfileOpen}
        onDismiss={() => setEditProfileOpen(false)}
        title="Edit Profile"
      >
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Box css={{ mb: "$3" }}>
            {threeBoxSpace.defaultProfile === "3box" ? (
              <Box
                css={{
                  alignItems: "center",
                  justifyContent: "center",
                  mb: "$4",
                }}
              >
                <Box
                  as="a"
                  css={{ color: "$primary" }}
                  href={`https://3box.io/${context.account}`}
                  target="__blank"
                >
                  Edit profile on 3box.io
                </Box>
              </Box>
            ) : (
              <>
                <Box
                  as="label"
                  htmlFor="threeBoxImage"
                  css={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    cursor: "pointer",
                    marginBottom: 24,
                  }}
                >
                  <Box
                    css={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "100%",
                      position: "absolute",
                      zIndex: 0,
                      left: 0,
                      bg: "rgba(0,0,0, .5)",
                    }}
                  />
                  {previewImage && (
                    <Box
                      as="img"
                      css={{
                        objectFit: "cover",
                        borderRadius: 1000,
                        width: 100,
                        height: 100,
                      }}
                      src={previewImage}
                    />
                  )}
                  {!previewImage && threeBoxSpace?.image && (
                    <Box
                      as="img"
                      css={{
                        objectFit: "cover",
                        borderRadius: 1000,
                        width: 100,
                        height: 100,
                      }}
                      src={`https://ipfs.infura.io/ipfs/${threeBoxSpace.image}`}
                    />
                  )}
                  {!previewImage && !threeBoxSpace?.image && (
                    <QRCode
                      style={{
                        borderRadius: 1000,
                        width: 100,
                        height: 100,
                      }}
                      bgColor="#9326E9"
                      fgColor={`#${account.substr(2, 6)}`}
                      value={account}
                    />
                  )}
                  <Box css={{ position: "absolute" }}>
                    <Camera />
                  </Box>
                  <Box
                    as="input"
                    ref={register}
                    id="threeBoxImage"
                    name="image"
                    css={{
                      width: 0.1,
                      height: 0.1,
                      opacity: 0,
                      overflow: "hidden",
                      position: "absolute",
                      zIndex: -1,
                    }}
                    accept="image/jpeg,image/png,image/webp"
                    type="file"
                  />
                </Box>
                <Textfield
                  ref={register}
                  defaultValue={threeBoxSpace ? threeBoxSpace.name : ""}
                  name="name"
                  placeholder="Name"
                  css={{ mb: "$3", width: "100%" }}
                />
                <Textfield
                  ref={register}
                  defaultValue={threeBoxSpace ? threeBoxSpace.website : ""}
                  placeholder="Website"
                  type="url"
                  name="website"
                  css={{ mb: "$3", width: "100%" }}
                />
                <Textarea
                  ref={register}
                  defaultValue={threeBoxSpace ? threeBoxSpace.description : ""}
                  name="description"
                  placeholder="Description"
                  size={3}
                  css={{ mb: "$3", width: "100%" }}
                />
              </>
            )}
            <ExternalAccount refetch={refetch} threeBoxSpace={threeBoxSpace}>
              <Box css={{ pt: "$3", mb: "$2", fontSize: "$5" }}>
                Instructions
              </Box>
              <Box as="ol" css={{ pl: 15 }}>
                <Box as="li" css={{ mb: "$5" }}>
                  <Box css={{ mb: "$3" }}>
                    Run the Livepeer CLI and select the option to "Sign a
                    message". When prompted for a message to sign, copy and
                    paste the following message:
                  </Box>
                  <Box
                    css={{
                      p: "$3",
                      mb: "$2",
                      position: "relative",
                      color: "$primary",
                      bg: "background",
                      borderRadius: 4,
                      fontFamily: "$monospace",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                    }}
                  >
                    <Box
                      dangerouslySetInnerHTML={{
                        __html: message,
                      }}
                    />
                    <CopyToClipboard
                      text={message.replace(/<br ?\/?>/g, "\n")}
                      onCopy={() => setCopied(true)}
                    >
                      <Flex
                        data-for="copyMessage"
                        data-tip={`${
                          copied ? "Copied" : "Copy message to clipboard"
                        }`}
                        css={{
                          ml: "$2",
                          mt: "3px",
                          position: "absolute",
                          right: 12,
                          top: 10,
                          cursor: "pointer",
                          borderRadius: 1000,
                          bg: "surface",
                          width: 26,
                          height: 26,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ReactTooltip
                          id="copyMessage"
                          className="tooltip"
                          place="left"
                          type="dark"
                          effect="solid"
                        />
                        {copied ? (
                          <Check
                            css={{
                              width: 12,
                              height: 12,
                              color: "$muted",
                            }}
                          />
                        ) : (
                          <Copy
                            css={{
                              width: 12,
                              height: 12,
                              color: "$muted",
                            }}
                          />
                        )}
                      </Flex>
                    </CopyToClipboard>
                  </Box>
                </Box>
                <Box as="li" css={{ mb: "$4" }}>
                  <Box css={{ mb: "$3" }}>
                    The Livepeer CLI will copy the Ethereum signed message
                    signature to your clipboard. It should begin with "0x".
                    Paste it here.
                  </Box>
                  <Textfield
                    ref={register}
                    name="signature"
                    placeholder="Signature"
                    css={{ width: "100%" }}
                  />
                </Box>
                <Box as="li" css={{ mb: 0 }}>
                  <Box css={{ mb: "$3" }}>
                    Verify the message was signed correctly by pasting your
                    Livepeer Node Ethereum account used to sign the message in
                    the Livpeeer CLI.
                  </Box>
                  <Textfield
                    ref={register}
                    name="ethereumAccount"
                    placeholder="Ethereum Account"
                    css={{
                      width: "100%",
                      "&:invalid": {
                        borderColor: "$red",
                      },
                    }}
                  />
                  {signature &&
                    ethereumAccount &&
                    (verified ? (
                      <Box
                        as="span"
                        css={{ fontSize: "$1", color: "$primary" }}
                      >
                        Signature message verification successful.
                      </Box>
                    ) : (
                      <Box as="span" css={{ fontSize: "$1", color: "red" }}>
                        Signature message verification failed.
                      </Box>
                    ))}
                </Box>
              </Box>
            </ExternalAccount>
          </Box>

          <Box>
            <Flex css={{ justifyContent: "flex-end" }}>
              <Button
                outline
                onClick={() => setEditProfileOpen(false)}
                css={{ mr: "$3" }}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  !formState.dirty ||
                  saving ||
                  (threeBoxSpace.defaultProfile === "3box" && !verified) ||
                  (threeBoxSpace.defaultProfile === "livepeer" &&
                    (signature || ethereumAccount) &&
                    !verified)
                }
                type="submit"
              >
                <Flex css={{ alignItems: "center" }}>
                  {saving && (
                    <Spinner css={{ width: 16, height: 16, mr: "$2" }} />
                  )}
                  Save
                </Flex>
              </Button>
            </Flex>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Index;
