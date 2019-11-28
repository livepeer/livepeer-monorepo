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

interface Props {
  account: string
  threeBoxSpace?: ThreeBoxSpace
}

const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $name: String
    $url: String
    $description: String
    $image: String
  ) {
    updateProfile(
      name: $name
      url: $url
      description: $description
      image: $image
    ) {
      __typename
      id
      name
      url
      description
      image
    }
  }
`

export default ({ threeBoxSpace, account }: Props) => {
  const context = useWeb3Context()
  const { register, handleSubmit, watch, errors } = useForm()
  const [previewImage, setPreviewImage] = useState()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  let name = watch('name')
  let url = watch('url')
  let description = watch('description')
  let image = watch('image')

  let reader = new FileReader()

  const [updateProfile] = useMutation(UPDATE_PROFILE)

  reader.onload = function(e) {
    setPreviewImage(e.target.result)
  }

  if (image && image.length) {
    reader.readAsDataURL(image[0])
  }

  const onSubmit = async () => {
    setLoading(true)
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

    updateProfile({
      variables: { name, url, description, image: hash },
      context: {
        ethereumProvider: context.library.currentProvider,
        address: account.toLowerCase(),
      },
      optimisticResponse: {
        __typename: 'Mutation',
        updateProfile: {
          __typename: 'ThreeBoxSpace',
          id: account.toLowerCase(),
          name,
          url,
          description,
          image: hash,
        },
      },
    })
    setLoading(false)
    setOpen(false)
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        sx={{ mt: '3px', ml: 2 }}
        variant="primaryOutlineSmall"
      >
        Edit Profile
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
            <ExternalAccount account={account} />
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
              <Button disabled={loading} type="submit">
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </Flex>
          </footer>
        </form>
      </Modal>
    </>
  )
}
