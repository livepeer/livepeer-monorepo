/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { jsx } from 'theme-ui'
import { ThreeBoxSpace } from '../../@types'
import { Flex } from 'theme-ui'
import Camera from '../../public/img/camera.svg'
import Button from '../Button'
import Textfield from '../Textfield'
import { useWeb3Context } from 'web3-react'
import useForm from 'react-hook-form'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import QRCode from 'qrcode.react'
import Modal from '../Modal'
import ExternalAccount from '../ExternalAccount'
import Box from '3box'
import Spinner from '../Spinner'
import { useDebounce } from 'use-debounce'

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
      url
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
    $url: String
    $description: String
    $image: String
    $proof: JSON
    $defaultProfile: String
  ) {
    updateProfile(
      name: $name
      url: $url
      description: $description
      image: $image
      proof: $proof
      defaultProfile: $defaultProfile
    ) {
      __typename
      id
      name
      url
      description
      image
      defaultProfile
    }
  }
`

export default ({ threeBoxSpace, refetch, account }: Props) => {
  const context = useWeb3Context()
  const { register, handleSubmit, watch } = useForm()
  const [previewImage, setPreviewImage] = useState(null)
  const [saving, setSaving] = useState(false)
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [existingProfileOpen, setExistingProfileOpen] = useState(false)
  const [verified, setVerified] = useState(false)
  const [message, setMessage] = useState('')
  const [timestamp] = useState(Math.floor(Date.now() / 1000))
  const name = watch('name')
  const url = watch('url')
  const description = watch('description')
  const image = watch('image')
  const signature = watch('signature')
  const externalAccount = watch('externalAccount')
  const reader = new FileReader()
  const [updateProfile] = useMutation(UPDATE_PROFILE)
  const [debouncedSignature] = useDebounce(signature, 200)
  const [debouncedExsternalAccount] = useDebounce(externalAccount, 200)

  useEffect(() => {
    setMessage(
      `Create a new 3Box profile<br /><br />-<br />Your unique profile ID is ${threeBoxSpace.did}<br />Timestamp: ${timestamp}`,
    )
    ;(async () => {
      if (signature && externalAccount) {
        const verifiedAccount = await context.library.eth.personal.ecRecover(
          message.replace(/<br ?\/?>/g, '\n'),
          signature,
        )
        if (verifiedAccount.toLowerCase() === externalAccount.toLowerCase()) {
          setVerified(true)
        } else {
          setVerified(false)
        }
      }
    })()
  }, [debouncedSignature, debouncedExsternalAccount, message])

  reader.onload = function(e) {
    setPreviewImage(e.target.result)
  }

  if (image && image.length) {
    reader.readAsDataURL(image[0])
  }

  const onClick = async () => {
    if (threeBoxSpace.defaultProfile) {
      setEditProfileOpen(true)
    } else {
      setApproveModalOpen(true)
      let box = await Box.openBox(account, context.library.currentProvider)
      await box.syncDone
      await box.linkAddress()

      let space = await box.openSpace('livepeer')
      await space.syncDone
      const profile = await box.public.all()
      if (
        profile.name ||
        profile.website ||
        profile.description ||
        profile.image
      ) {
        setApproveModalOpen(false)
        setExistingProfileOpen(true)
      } else {
        await updateProfile({
          variables: { defaultProfile: 'livepeer' },
          context: {
            box,
            address: account.toLowerCase(),
          },
        })
        box = await Box.openBox(
          account.toLowerCase(),
          context.library.currentProvider,
        )
        space = await box.openSpace('livepeer')
        await box.syncDone
        refetch({
          variables: {
            account: account,
          },
        })
        setApproveModalOpen(false)
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
    setSaving(true)
    const box = await Box.openBox(
      context.account,
      context.library.currentProvider,
    )
    let hash = threeBoxSpace.image ? threeBoxSpace.image : ''
    if (previewImage) {
      const formData = new window.FormData()
      formData.append('path', image[0])
      const resp = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
        method: 'post',
        body: formData,
      })
      const infuraResponse = await resp.json()
      hash = infuraResponse['Hash']
    }

    const variables = {
      name: name ? name : threeBoxSpace.name,
      url: url ? url : threeBoxSpace.url,
      description: description ? description : threeBoxSpace.description,
      image: hash ? hash : threeBoxSpace.image,
      proof,
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
        url: url ? url : threeBoxSpace.url,
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

    // If a user is linking an external account, let's wait until it successfully
    // links before closing the modal since we're not optimistically responding
    // in this case
    if (signature) {
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
      <Modal isOpen={approveModalOpen} title="Sign Messages">
        <>
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
              <span>Sign the messages in your wallet to continue.</span>
              <Spinner />
            </Flex>
          </div>
          <Flex sx={{ justifyContent: 'flex-end' }}>
            <Button
              variant="outline"
              onClick={() => setApproveModalOpen(false)}
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
                const box = await Box.openBox(
                  context.account,
                  context.library.currentProvider,
                )
                await updateProfile({
                  variables: {
                    defaultProfile: 'livepeer',
                  },
                  refetchQueries: [
                    {
                      query: GET_THREE_BOX_SPACE,
                      variables: { id: account.toLowerCase() },
                    },
                  ],
                  context: {
                    box,
                    address: account.toLowerCase(),
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
                await updateProfile({
                  variables: {
                    defaultProfile: '3box',
                  },
                  refetchQueries: [
                    {
                      query: GET_THREE_BOX_SPACE,
                      variables: { id: account.toLowerCase() },
                    },
                  ],
                  context: {
                    ethereumProvider: context.library.currentProvider,
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
                      width: '0.1px',
                      height: '0.1px',
                      opacity: '0',
                      overflow: 'hidden',
                      position: 'absolute',
                      zIndex: '-1',
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
                  defaultValue={threeBoxSpace ? threeBoxSpace.url : ''}
                  label="Website"
                  type="url"
                  name="url"
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
              <ol sx={{ pl: 15, pt: 4 }}>
                <li sx={{ mb: 3 }}>
                  <div sx={{ mb: 2 }}>
                    Run livepeer-cli and select option "Sign a message"
                  </div>
                </li>
                <li sx={{ mb: 3 }}>
                  <div sx={{ mb: 2 }}>
                    When prompted for the message to sign, copy and paste the
                    following message:
                  </div>
                  <div
                    sx={{
                      p: 2,
                      color: 'primary',
                      bg: 'background',
                      borderRadius: 4,
                      fontFamily: 'monospace',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: message,
                    }}
                  />
                </li>
                <li sx={{ mb: 3 }}>
                  <div sx={{ mb: 2 }}>
                    The cli will copy the Ethereum signed message signature to
                    your clipboard. Paste it here.
                  </div>
                  <Textfield
                    inputRef={register}
                    name="signature"
                    label="Signature"
                    rows={4}
                    sx={{ width: '100%' }}
                  />
                </li>
                <li sx={{ mb: 3 }}>
                  <div sx={{ mb: 2 }}>
                    Verify the signature by entering the public address of the
                    external account you signed the message with below, then
                    save.
                  </div>
                  <Textfield
                    inputRef={register}
                    name="externalAccount"
                    label="External Account"
                    error={signature && externalAccount && !verified}
                    messageFixed
                    message={
                      signature &&
                      externalAccount &&
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
                    (signature || externalAccount) &&
                    !verified)
                }
                type="submit"
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </Flex>
          </footer>
        </form>
      </Modal>
    </>
  )
}
