/** @jsx jsx */
import React, { useState } from 'react'
import { jsx } from 'theme-ui'
import { ThreeBoxSpace, ThreeBox } from '../../@types'
import { Flex } from 'theme-ui'
import Camera from '../../public/img/camera.svg'
import Button from '../Button'
import Textfield from '../Textfield'
import { useWeb3Context } from 'web3-react'
import useForm from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import QRCode from 'qrcode.react'
import Modal from '../Modal'
import ExternalAccount from '../ExternalAccount'
import Box from '3box'

interface Props {
  account: string
  threeBoxSpace?: ThreeBoxSpace
  threeBox?: ThreeBox
}

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

export default ({ threeBoxSpace, threeBox, account }: Props) => {
  const context = useWeb3Context()
  const { register, handleSubmit, watch, errors } = useForm()
  const [previewImage, setPreviewImage] = useState()
  const [saving, setSaving] = useState(false)
  const [open, setOpen] = useState(false)
  const [timestamp] = useState(Math.floor(Date.now() / 1000))

  let name = watch('name')
  let url = watch('url')
  let description = watch('description')
  let image = watch('image')
  let signature = watch('signature')

  let reader = new FileReader()

  const [updateProfile, error] = useMutation(UPDATE_PROFILE, {
    refetchQueries: [`threeBox`],
  })

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
      await Box.openBox(context.account, context.library.currentProvider)
      setOpen(true)
    }
  }

  const message = `Create a new 3Box profile<br /><br />-<br />Your unique profile ID is ${threeBox.did}<br />Timestamp: ${timestamp}`

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

    const box = await Box.openBox(
      context.account,
      context.library.currentProvider,
    )

    updateProfile({
      variables: {
        name: name ? name : threeBoxSpace.name,
        url: url ? url : threeBoxSpace.url,
        description: description ? description : threeBoxSpace.description,
        image: hash ? hash : threeBoxSpace.image,
        proof,
        defaultProfile: 'livepeer',
      },
      context: {
        box,
        address: account,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateProfile: {
          __typename: 'ThreeBoxSpace',
          id: account,
          name,
          url,
          description,
          image: hash,
          defaultProfile: 'livepeer',
        },
      },
    })
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
      <Modal
        isOpen={open}
        onDismiss={() => setOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div sx={{ mb: 3 }}>
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
            <ExternalAccount message={message} threeBox={threeBox}>
              <Textfield
                inputRef={register}
                name="signature"
                label="Signature"
                as="textarea"
                rows={4}
                sx={{ width: '100%' }}
              />
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
              <Button disabled={saving} type="submit">
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </Flex>
          </footer>
        </form>
      </Modal>
    </>
  )
}
