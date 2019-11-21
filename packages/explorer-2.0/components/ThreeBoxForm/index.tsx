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

interface Props {
  account: string
  threeBoxSpace: ThreeBoxSpace
  onSubmitCallBack: Function
}

export default ({ account, threeBoxSpace, onSubmitCallBack }: Props) => {
  const context = useWeb3Context()
  const { register, handleSubmit, watch, errors } = useForm()

  const onSubmit = data => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Textfield
          inputRef={register}
          name="textInput"
          label="Name"
          sx={{ mb: 2, width: '100%' }}
        />
        <Textfield label="Campaign URL" sx={{ mb: 2, width: '100%' }} />
        <Textfield label="Description" sx={{ mb: 4, width: '100%' }} />
      </div>
      <Flex sx={{ justifyContent: 'flex-end' }}>
        <Button sx={{ mr: 2 }} variant="outline">
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={async () => {
            const box = await Box.openBox(
              account,
              context.library.currentProvider,
            )
            const space = await box.openSpace('livepeer')
            await space.public.setMultiple(
              ['name', 'description', 'url'],
              ['Soffer', 'sweet', 'https://soffer.dev'],
            )
            onSubmitCallBack()
          }}
        >
          Save
        </Button>
      </Flex>
    </form>
  )
}
