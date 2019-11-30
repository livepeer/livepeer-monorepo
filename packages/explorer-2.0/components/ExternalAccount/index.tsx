/** @jsx jsx */
import React, { useState, useEffect } from 'react'
import { Styled, jsx } from 'theme-ui'
import { Collapse } from 'react-collapse'
import { Flex } from 'theme-ui'
import Textfield from '../Textfield'
import gql from 'graphql-tag'
import { useWeb3Context } from 'web3-react'
import { useQuery } from '@apollo/react-hooks'

interface Props {
  account: string
}

const GET_BOX = gql`
  query getBox($id: ID!) {
    getBox(id: $id) {
      id
      did
    }
  }
`

export default ({ account, ...props }: Props) => {
  const [open, setOpen] = useState()
  const context = useWeb3Context()
  // const { data, error } = useQuery(GET_BOX, {
  //   variables: {
  //     id: context.account,
  //     ethereumProvider: context.library.provider,
  //   },
  //   context: {
  //     ethereumProvider: context.library.currentProvider,
  //   },
  // })

  // console.log('err', error)
  // console.log('dat', data)
  return (
    <div
      sx={{
        border: '1px dashed',
        borderColor: 'border',
        borderRadius: '4px',
        p: 2,
      }}
      {...props}
    >
      <Flex
        sx={{
          alignItems: 'center',
          fontWeight: 500,
          fontSize: 2,
          mb: 2,
        }}
      >
        <div sx={{ color: 'muted' }}>External Account</div>
        <div
          sx={{ borderRadius: 1000, width: 2, height: 2, bg: 'muted', mx: 1 }}
        />
        <div
          onClick={() => {
            setOpen(open ? false : true)
          }}
          sx={{ color: 'primary', cursor: 'pointer' }}
        >
          {open ? 'Cancel' : 'Edit'}
        </div>
      </Flex>
      <div sx={{ fontSize: 1, lineHeight: '24px', color: 'text' }}>
        Add an external account. This is a required action for orchestrators
        that wish to use their profiles with an external livepeer-cli account.
      </div>
      <Collapse isOpened={open}>
        <div sx={{ mt: 3 }}>
          <div sx={{ mb: 3 }}>
            <div sx={{ mb: 2 }}>
              1. Run livepeer-cli and select option #18 "Sign a message"
            </div>
            <div
              sx={{
                p: 2,
                color: 'primary',
                bg: 'background',
                borderRadius: 4,
                fontFamily: 'monospace',
              }}
            >{`~ livepeer-cli link-profile <did: 12kj21923hasdj>`}</div>
          </div>
          <div>
            <div sx={{ mb: 2 }}>2. Paste the hex signature output here</div>
            <Textfield
              defaultValue=""
              name="hexSignature"
              label="Hex Signature"
              as="textarea"
              rows={4}
              sx={{ width: '100%' }}
            />
          </div>
          <div
            sx={{
              pt: 3,
              pb: 2,
              cursor: 'pointer',
              color: 'red',
              paddingBottom: '16px',
              display: 'inline-flex',
              padding: '12px 16px',
              marginTop: '16px',
              background: 'rgba(211, 47, 47, .1)',
              borderRadius: '6px',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <span>Disconnect external account</span>
          </div>
        </div>
      </Collapse>
    </div>
  )
}
