/** @jsx jsx */
import React, { useState } from 'react'
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

interface Props {
  account: string
  threeBoxSpace?: ThreeBoxSpace
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
const GET_TRANSCODERS = gql`
  {
    transcoders(
      where: { status: Registered }
      orderBy: totalStake
      orderDirection: desc
    ) {
      id
      active
      feeShare
      rewardCut
      status
      active
      totalStake
      threeBoxSpace {
        __typename
        id
        did
        name
        url
        description
        image
      }
      delegator {
        startRound
        bondedAmount
        unbondingLocks {
          withdrawRound
        }
      }
      pools(first: 30, orderBy: id, orderDirection: desc) {
        rewardTokens
      }
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

export default ({ threeBoxSpace, account }: Props) => {
  const context = useWeb3Context()
  const { register, handleSubmit, watch } = useForm()
  const [previewImage, setPreviewImage] = useState(null)
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [existingProfileOpen, setExistingProfileOpen] = useState(false)
  const [timestamp] = useState(Math.floor(Date.now() / 1000))
  const name = watch('name')
  const url = watch('url')
  const description = watch('description')
  const image = watch('image')
  const signature = watch('signature')
  const externalAccount = watch('externalAccount')
  const reader = new FileReader()
  const [updateProfile] = useMutation(UPDATE_PROFILE)

  reader.onload = function(e) {
    setPreviewImage(e.target.result)
  }

  if (image && image.length) {
    reader.readAsDataURL(image[0])
  }

  const onClick = async () => {
    if (threeBoxSpace.defaultProfile) {
      setOpen(true)
    } else {
      setApproveModalOpen(true)
      const box = await Box.openBox(
        context.account,
        context.library.currentProvider,
      )
      const space = await box.openSpace('livepeer')
      const profile = await box.public.all()
      await space.syncDone
      await box.syncDone

      setApproveModalOpen(false)

      if (
        profile.name ||
        profile.website ||
        profile.description ||
        profile.image
      ) {
        setExistingProfileOpen(true)
      } else {
        updateProfile({
          variables: { defaultProfile: 'livepeer' },
          context: {
            box,
            address: account.toLowerCase(),
          },
        })
        setOpen(true)
      }
    }
  }

  const message = `Create a new 3Box profile<br /><br />-<br />Your unique profile ID is ${threeBoxSpace.did}<br />Timestamp: ${timestamp}`

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
      refetchQueries: [
        {
          query: GET_THREE_BOX_SPACE,
          variables: { id: account.toLowerCase() },
        },
        { query: GET_TRANSCODERS },
      ],
      context: {
        box,
        address: account.toLowerCase(),
      },
    })
    // If a user is linking an external account, let's wait until it successfully
    // links before closing the modal since we're not optimistically responding
    if (signature) {
      await result
    }
    setSaving(false)
    setOpen(false)
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
      <Modal isOpen={approveModalOpen} title="Sign Message">
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
              <span>Sign the message in your wallet to continue.</span>
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
                setOpen(true)
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
                setOpen(true)
              }}
            >
              Use Existing
            </Button>
          </Flex>
        </>
      </Modal>
      <Modal
        isOpen={open}
        onDismiss={() => setOpen(false)}
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
            <ExternalAccount message={message} threeBoxSpace={threeBoxSpace}>
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
                    external account you signed the message with below.
                  </div>
                  <Textfield
                    inputRef={register}
                    name="externalAccount"
                    label="External Account"
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
                onClick={() => setOpen(false)}
                sx={{ mr: 2 }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={
                  saving ||
                  (threeBoxSpace.defaultProfile === '3box' && !signature)
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
