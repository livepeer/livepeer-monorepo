/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { jsx } from 'theme-ui'
import { ThreeBoxSpace } from '../../@types'
import { Flex } from 'theme-ui'
import Button from '../Button'
import Textfield from '../Textfield'
import Box from '3box'
import { useWeb3Context } from 'web3-react'
import useForm from 'react-hook-form'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

interface Props {
  account: string
  threeBoxSpace: ThreeBoxSpace
  onSubmitCallBack: Function
  onCancel: Function
}

const UPDATE_PROFILE = gql`
  mutation updateProfile($name: String, $url: String, $description: String) {
    updateProfile(name: $name, url: $url, description: $description) {
      name
      url
      description
    }
  }
`

export default ({
  account,
  threeBoxSpace,
  onSubmitCallBack,
  onCancel,
}: Props) => {
  const context = useWeb3Context()
  const { register, handleSubmit, watch, errors } = useForm()

  const name = watch('name')
  const url = watch('url')
  const description = watch('description')

  const [updateProfile, { error, data }] = useMutation(UPDATE_PROFILE, {
    variables: { name, url, description },
    context: {
      ethereumProvider: context.library.currentProvider,
      address: context.account,
    },
    optimisticResponse: {
      __typename: 'Mutation',
      updateProfile: {
        __typename: 'ThreeBoxSpace',
        name,
        url,
        description,
      },
    },
  })
  console.log('error', error)
  console.log('data', data)
  const onSubmit = async (data, e) => {
    updateProfile()
    // const box = await Box.openBox(account, context.library.currentProvider)
    // const space = await box.openSpace('livepeer')
    // await space.public.setMultiple(
    //   ['name', 'description', 'url'],
    //   [data.name, data.description, data.url],
    // )
    onSubmitCallBack()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
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
          sx={{ mb: 4, width: '100%' }}
        />
      </div>
      <Flex sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} sx={{ mr: 2 }} variant="outline">
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </Flex>
    </form>
  )
}
