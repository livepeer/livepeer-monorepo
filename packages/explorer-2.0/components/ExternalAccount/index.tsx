/** @jsx jsx */
import React, { useState } from 'react'
import { jsx, Flex } from 'theme-ui'
import { Collapse } from 'react-collapse'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { useWeb3Context } from 'web3-react'
import Utils from 'web3-utils'
import Box from '3box'

const REMOVE_ADDRESS_LINK = gql`
  mutation removeAddressLink($address: String) {
    removeAddressLink(address: $address)
  }
`

export default ({ threeBox, message, children }) => {
  const [open, setOpen] = useState()
  const context = useWeb3Context()
  const [removeAddressLink] = useMutation(REMOVE_ADDRESS_LINK)
  const addressLinks = threeBox.addressLinks.filter(
    link =>
      Utils.toChecksumAddress(link.address) !=
      Utils.toChecksumAddress(context.account),
  )
  const [disconnecting, setDisconnecting] = useState({
    address: '',
    isDisconnecting: false,
  })

  return (
    <div
      sx={{
        border: '1px dashed',
        borderColor: 'border',
        borderRadius: '4px',
        p: 2,
      }}
    >
      <Flex
        sx={{
          alignItems: 'center',
          fontWeight: 500,
          fontSize: 2,
          mb: 2,
        }}
      >
        <div sx={{ color: 'muted' }}>
          External Account{addressLinks.length > 1 ? 's' : ''}
        </div>
        <div
          sx={{ borderRadius: 1000, width: 2, height: 2, bg: 'muted', mx: 1 }}
        />
        <div
          onClick={() => {
            setOpen(open ? false : true)
          }}
          sx={{ color: 'primary', cursor: 'pointer' }}
        >
          {open ? 'Cancel' : 'Add Account'}
        </div>
      </Flex>
      <div sx={{ lineHeight: '24px' }}>
        If you operate an orchestrator, adding an external account allows you to
        enjoy the benefits of a profile web UI, while keeping your keys in a
        more secure environment.
      </div>
      <Collapse isOpened={open}>
        <div sx={{ pt: 4 }}>
          <div sx={{ mb: 3 }}>
            <div sx={{ mb: 2 }}>
              1. Run livepeer-cli and select option "Sign a message"
            </div>
          </div>
          <div sx={{ mb: 3 }}>
            <div sx={{ mb: 2 }}>
              2. When prompted for the message to sign, copy and paste the
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
          </div>
          <div>
            <div sx={{ mb: 2 }}>
              3. The cli will copy the Ethereum signed message signature to your
              clipboard. Paste it here:
            </div>
            {children}
          </div>
        </div>
      </Collapse>
      <Collapse isOpened={addressLinks.length && !open}>
        <div sx={{ pt: 2, color: 'text' }}>
          {addressLinks.map(link => (
            <Flex
              key={link.address}
              sx={{
                alignItems: 'center',
                p: 2,
                borderRadius: 6,
                mb: 2,
                bg: 'rgba(255, 255, 255, .05)',
                justifyContent: 'space-between',
                '&:last-child': {
                  mb: 0,
                },
              }}
            >
              <div sx={{ fontFamily: 'monospace', fontSize: 1 }}>
                {link.address}
              </div>
              <div
                onClick={async () => {
                  setDisconnecting({
                    address: link.address,
                    isDisconnecting: true,
                  })
                  const box = await Box.openBox(
                    context.account,
                    context.library.currentProvider,
                  )
                  await removeAddressLink({
                    variables: {
                      address: link.address,
                    },
                    refetchQueries: ['threeBox'],
                    context: {
                      box,
                    },
                  })
                  setDisconnecting({
                    address: link.address,
                    isDisconnecting: false,
                  })
                }}
                sx={{
                  borderRadius: 6,
                  cursor: 'pointer',
                  py: '6px',
                  px: 2,
                  backgroundColor: 'rgba(211, 47, 47, .1)',
                  transition: '.2s background-color',
                  color: 'red',
                  '&:hover': {
                    transition: '.2s background-color',
                    backgroundColor: 'rgba(211, 47, 47, .2)',
                  },
                }}
              >
                {disconnecting.address == link.address &&
                disconnecting.isDisconnecting
                  ? 'Disconnecting...'
                  : 'Disconnect'}
              </div>
            </Flex>
          ))}
        </div>
      </Collapse>
    </div>
  )
}
