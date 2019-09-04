/** @jsx jsx */
import React from 'react'
import { jsx } from 'theme-ui'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Utils from 'web3-utils'
import Button from '../../Button'

export default props => {
  if (!props.context.active) {
    return null
  }
  // const APPROVE = gql`
  //   mutation approve($type: String!, $amount: String!) {
  //     approve(type: $type, amount: $amount)
  //   }
  // `
  const BOND = gql`
    mutation bond($to: String!, $amount: String!) {
      bond(to: $to, amount: $amount)
    }
  `

  const [bond] = useMutation(BOND, {
    variables: {
      to: '0x21d1130dc36958db75fbb0e5a9e3e5f5680238ff',
      amount: Utils.toWei('.01', 'ether'),
    },
    context: {
      provider: props.context.library.currentProvider,
      account: props.context.account.toLowerCase(),
    },
  })

  return (
    <Button
      onClick={async () => {
        try {
          await bond()
        } catch (e) {
          console.log(e)
          return {
            error: e.message.replace('GraphQL error: ', ''),
          }
        }
      }}
      sx={{ width: '100%' }}
    >
      Stake
    </Button>
  )
}
