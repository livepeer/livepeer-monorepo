import { useState, useEffect } from 'react'
import { ThreeBoxSpace } from '../../@types'
import { Flex } from 'theme-ui'
import Camera from '../../public/img/camera.svg'
import Button from '../Button'
import ReactTooltip from 'react-tooltip'
import Check from '../../public/img/check.svg'
import Copy from '../../public/img/copy.svg'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Textfield from '../Textfield'
import useForm from 'react-hook-form'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import QRCode from 'qrcode.react'
import Modal from '../Modal'
import ExternalAccount from '../ExternalAccount'
import { useDebounce } from 'use-debounce'
import ThreeBoxSteps from '../ThreeBoxSteps'
import Spinner from '../Spinner'
import { useWeb3React } from '@web3-react/core'

interface Props {
  account: string
  threeBoxSpace?: ThreeBoxSpace
  refetch?: any
}

const GET_THREE_BOX_SPACE = gql`
  query($id: ID!) {
    threeBoxSpace(id: $id) {
      __typename
      id
      did
      name
      website
      description
      image
      addressLinks
      defaultProfile
    }
  }
`

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
`

function hasExistingProfile(profile) {
  return profile.name || profile.website || profile.description || profile.image
}

export default ({ threeBoxSpace, refetch, account }: Props) => {
  const context = useWeb3React()
  const { register, handleSubmit, watch } = useForm()
  const [previewImage, setPreviewImage] = useState(null)
  const [saving, setSaving] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [createProfileModalOpen, setCreateProfileModalOpen] = useState(false)
  const [existingProfileOpen, setExistingProfileOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [verified, setVerified] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [timestamp] = useState(Math.floor(Date.now() / 1000))
  const name = watch('name')
  const website = watch('website')
  const description = watch('description')
  const image = watch('image')
  const signature = watch('signature')
  const ethereumAccount = watch('ethereumAccount')
  const reader = new FileReader()
  const [updateProfile] = useMutation(UPDATE_PROFILE)
  const [debouncedSignature] = useDebounce(signature, 200)
  const [debouncedEthereumAccount] = useDebounce(ethereumAccount, 200)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  useEffect(() => {
    setMessage(
      `Create a new 3Box profile<br /><br />-<br />Your unique profile ID is ${threeBoxSpace.did}<br />Timestamp: ${timestamp}`,
    )
    ;(async () => {
      const Box = require('3box')
      const profile = await Box.getProfile(context.account)

      if (hasExistingProfile(profile)) {
        setHasProfile(true)
      }

      const Web3 = require('web3') // use web3 lib for ecRecover method
      const web3 = new Web3(context.library._web3Provider)

      if (signature && ethereumAccount) {
        const verifiedAccount = await web3.eth.personal.ecRecover(
          message.replace(/<br ?\/?>/g, '\n'),
          signature,
        )
        if (verifiedAccount.toLowerCase() === ethereumAccount.toLowerCase()) {
          setVerified(true)
        } else {
          setVerified(false)
        }
      }
    })()
  }, [debouncedSignature, debouncedEthereumAccount, message])

  reader.onload = function(e) {
    setPreviewImage(e.target.result)
  }

  if (image && image.length) {
    reader.readAsDataURL(image[0])
  }

  const onClick = async () => {
    const Box = require('3box')

    if (threeBoxSpace.defaultProfile) {
      setEditProfileOpen(true)
    } else {
      setCreateProfileModalOpen(true)

      let box = await Box.openBox(account, context.library._web3Provider)
      setActiveStep(1)
      await box.syncDone

      // Create a 3box account if a user doesn't already have one
      if (!hasProfile) {
        await box.linkAddress()
        setActiveStep(2)
      }

      let space = await box.openSpace('livepeer')
      await space.syncDone

      if (hasProfile) {
        setCreateProfileModalOpen(false)
        setExistingProfileOpen(true)
      } else {
        await updateProfile({
          variables: { defaultProfile: 'livepeer' },
          context: {
            box,
            address: account,
          },
        })
        box = await Box.openBox(
          account.toLowerCase(),
          context.library._web3Provider,
        )
        space = await box.openSpace('livepeer')
        await box.syncDone
        if (refetch) {
          refetch({
            variables: {
              account: account,
            },
          })
        }
        setCreateProfileModalOpen(false)
        setEditProfileOpen(true)
      }
    }
  }

  const proof = signature
    ? {
        version: 1,
        type: 'ethereum-eoa',
        message: message.replace(/<br ?\/?>/g, '\n'),
        timestamp,
        signature,
      }
    : null

  const onSubmit = async () => {
    const Box = require('3box')

    setSaving(true)
    const box = await Box.openBox(
      context.account,
      context.library._web3Provider,
    )

    let hash = ''

    if (previewImage && image.length) {
      try {
        const formData = new window.FormData()
        formData.append('path', image[0])
        const resp = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
          method: 'post',
          body: formData,
        })
        const infuraResponse = await resp.json()
        hash = infuraResponse['Hash']
      } catch (e) {
        console.log(e)
      }
    }

    const variables = {
      ...(name && { name }),
      ...(website && { website }),
      ...(description && { description }),
      ...(hash && { image: hash }),
      ...(proof && { proof }),
      defaultProfile: threeBoxSpace.defaultProfile
        ? threeBoxSpace.defaultProfile
        : 'livepeer',
    }

    const optimisticResponse = {
      __typename: 'Mutation',
      updateProfile: {
        __typename: 'ThreeBoxSpace',
        id: account.toLowerCase(),
        name: name ? name : threeBoxSpace.name,
        website: website ? website : threeBoxSpace.website,
        description: description ? description : threeBoxSpace.description,
        image: hash ? hash : threeBoxSpace.image,
        defaultProfile: threeBoxSpace.defaultProfile,
      },
    }

    const result = updateProfile({
      variables,
      optimisticResponse: !proof ? optimisticResponse : null,
      context: {
        box,
        address: account,
      },
    })

    // We don't use an optimistic response if user is linking external account
    if (proof) {
      await result
      await refetch({
        variables: {
          account,
        },
      })
    }

    setSaving(false)
    setEditProfileOpen(false)
  }

  return (
    <>
      <Button
        onClick={() => onClick()}
        sx={{ mt: '3px', ml: 2, fontWeight: 600 }}
        variant="primaryOutlineSmall"
      >
        {threeBoxSpace.defaultProfile ? 'Edit Profile' : 'Set up my profile'}
      </Button>
      <Modal isOpen={createProfileModalOpen} title="Profile Setup">
        <>
          <div sx={{ mb: 2 }}>
            Approve the signing prompts in your web3 wallet to continue setting
            up your profile.
          </div>
          <div
            sx={{
              border: '1px solid',
              borderColor: 'border',
              borderRadius: 6,
              p: 3,
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Flex
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <ThreeBoxSteps hasProfile={hasProfile} activeStep={activeStep} />
            </Flex>
          </div>
          <Flex sx={{ justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => setCreateProfileModalOpen(false)}
            >
              Close
            </Button>
          </Flex>
        </>
      </Modal>

      <Modal isOpen={existingProfileOpen} title="Use Existing Profile?">
        <>
          <div
            sx={{
              lineHeight: 1.5,
              border: '1px solid',
              borderColor: 'border',
              borderRadius: 6,
              p: 3,
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            We recognized that you already have a 3box profile. Would you like
            to use it in Livepeer?
          </div>
          <Flex sx={{ justifyContent: 'flex-end' }}>
            <Button
              onClick={async () => {
                const Box = require('3box')
                const box = await Box.openBox(
                  context.account,
                  context.library._web3Provider,
                )
                await updateProfile({
                  variables: {
                    defaultProfile: 'livepeer',
                  },
                  context: {
                    box,
                    address: account.toLowerCase(),
                  },
                })
                await refetch({
                  variables: {
                    account: account.toLowerCase(),
                  },
                })
                setExistingProfileOpen(false)
                setEditProfileOpen(true)
              }}
              sx={{ mr: 2 }}
              variant="outline"
            >
              Create New
            </Button>
            <Button
              onClick={async () => {
                const Box = require('3box')
                const box = await Box.openBox(
                  context.account,
                  context.library._web3Provider,
                )
                await updateProfile({
                  variables: {
                    defaultProfile: '3box',
                  },
                  context: {
                    box,
                    address: account.toLowerCase(),
                  },
                })
                setExistingProfileOpen(false)
                setEditProfileOpen(true)
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div sx={{ mb: 3 }}>
            {threeBoxSpace.defaultProfile === '3box' ? (
              <div
                sx={{
                  lineHeight: 1.5,
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <a
                  sx={{ color: 'primary' }}
                  href={`https://3box.io/${context.account}`}
                  target="__blank"
                >
                  Edit profile on 3box.io
                </a>
              </div>
            ) : (
              <>
                <label
                  htmlFor="threeBoxImage"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    marginBottom: 24,
                  }}
                >
                  <div
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '100%',
                      position: 'absolute',
                      zIndex: 0,
                      bg: 'rgba(0,0,0, .5)',
                    }}
                  />
                  {previewImage && (
                    <img
                      sx={{
                        objectFit: 'cover',
                        borderRadius: 1000,
                        width: 100,
                        height: 100,
                      }}
                      src={previewImage}
                    />
                  )}
                  {!previewImage && threeBoxSpace && threeBoxSpace.image && (
                    <img
                      sx={{
                        objectFit: 'cover',
                        borderRadius: 1000,
                        width: 100,
                        height: 100,
                      }}
                      src={`https://ipfs.infura.io/ipfs/${threeBoxSpace.image}`}
                    />
                  )}
                  {!previewImage && threeBoxSpace && !threeBoxSpace.image && (
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
                  <Camera sx={{ position: 'absolute' }} />
                  <input
                    ref={register}
                    id="threeBoxImage"
                    name="image"
                    sx={{
                      width: 0.1,
                      height: 0.1,
                      opacity: 0,
                      overflow: 'hidden',
                      position: 'absolute',
                      zIndex: -1,
                    }}
                    accept="image/jpeg,image/png,image/webp"
                    type="file"
                  />
                </label>
                <Textfield
                  inputRef={register}
                  defaultValue={threeBoxSpace ? threeBoxSpace.name : ''}
                  name="name"
                  label="Name"
                  sx={{ mb: 2, width: '100%' }}
                />
                <Textfield
                  inputRef={register}
                  defaultValue={threeBoxSpace ? threeBoxSpace.website : ''}
                  label="Website"
                  type="url"
                  name="website"
                  sx={{ mb: 2, width: '100%' }}
                />
                <Textfield
                  inputRef={register}
                  defaultValue={threeBoxSpace ? threeBoxSpace.description : ''}
                  name="description"
                  label="Description"
                  as="textarea"
                  rows={4}
                  sx={{ mb: 2, width: '100%' }}
                />
              </>
            )}
            <ExternalAccount refetch={refetch} threeBoxSpace={threeBoxSpace}>
              <div sx={{ pt: 2, mb: 1, fontSize: 4 }}>Instructions</div>
              <ol sx={{ pl: 15 }}>
                <li sx={{ mb: 4 }}>
                  <div sx={{ mb: 2 }}>
                    Run the Livepeer CLI* and select the option to "Sign a
                    message". When prompted for a message to sign, copy and
                    paste the following message:
                  </div>
                  <div
                    sx={{
                      p: 2,
                      mb: 1,
                      position: 'relative',
                      color: 'primary',
                      bg: 'background',
                      borderRadius: 4,
                      fontFamily: 'monospace',
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: message,
                      }}
                    />
                    <CopyToClipboard
                      text={message.replace(/<br ?\/?>/g, '\n')}
                      onCopy={() => setCopied(true)}
                    >
                      <Flex
                        data-for="copyMessage"
                        data-tip={`${
                          copied ? 'Copied' : 'Copy message to clipboard'
                        }`}
                        sx={{
                          ml: 1,
                          mt: '3px',
                          position: 'absolute',
                          right: 12,
                          top: 10,
                          cursor: 'pointer',
                          borderRadius: 1000,
                          bg: 'surface',
                          width: 26,
                          height: 26,
                          alignItems: 'center',
                          justifyContent: 'center',
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
                            sx={{
                              width: 12,
                              height: 12,
                              color: 'muted',
                            }}
                          />
                        ) : (
                          <Copy
                            sx={{
                              width: 12,
                              height: 12,
                              color: 'muted',
                            }}
                          />
                        )}
                      </Flex>
                    </CopyToClipboard>
                  </div>

                  <div sx={{ fontSize: 0 }}>
                    *
                    <i>
                      The option to sign a message via the Livepeer CLI will
                      become available in an upcoming go-livepeer release. If
                      you'd like to link an external account before then, we
                      recommend signing this message offline using{' '}
                      <a
                        href="https://www.mycrypto.com/sign-and-verify-message/sign"
                        rel="noopener noreferrer"
                        target="__blank"
                        sx={{ color: 'primary' }}
                      >
                        mycrypto.com
                      </a>{' '}
                      or geth.
                    </i>
                  </div>
                </li>
                <li sx={{ mb: 3 }}>
                  <div sx={{ mb: 2 }}>
                    The Livepeer CLI will copy the Ethereum signed message
                    signature to your clipboard. It should begin with "0x".
                    Paste it here.
                  </div>
                  <Textfield
                    inputRef={register}
                    name="signature"
                    label="Signature"
                    rows={4}
                    sx={{ width: '100%' }}
                  />
                </li>
                <li sx={{ mb: 0 }}>
                  <div sx={{ mb: 2 }}>
                    Verify the message was signed correctly by pasting your
                    Livepeer Node Ethereum account used to sign the message in
                    the Livpeeer CLI.
                  </div>
                  <Textfield
                    inputRef={register}
                    name="ethereumAccount"
                    label="Ethereum Account"
                    error={signature && ethereumAccount && !verified}
                    messageFixed
                    message={
                      signature &&
                      ethereumAccount &&
                      (verified ? (
                        <span sx={{ color: 'primary' }}>
                          Signature message verification successful.
                        </span>
                      ) : (
                        <span sx={{ color: 'red' }}>
                          Sorry! The signature message verification failed.
                        </span>
                      ))
                    }
                    messageColor={'text'}
                    rows={4}
                    sx={{ width: '100%' }}
                  />
                </li>
              </ol>
            </ExternalAccount>
          </div>

          <footer>
            <Flex sx={{ justifyContent: 'flex-end' }}>
              <Button
                onClick={() => setEditProfileOpen(false)}
                sx={{ mr: 2 }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={
                  saving ||
                  (threeBoxSpace.defaultProfile === '3box' && !verified) ||
                  (threeBoxSpace.defaultProfile === 'livepeer' &&
                    (signature || ethereumAccount) &&
                    !verified)
                }
                type="submit"
              >
                <Flex sx={{ alignItems: 'center' }}>
                  {saving && <Spinner sx={{ width: 16, height: 16, mr: 1 }} />}
                  Save
                </Flex>
              </Button>
            </Flex>
          </footer>
        </form>
      </Modal>
    </>
  )
}
