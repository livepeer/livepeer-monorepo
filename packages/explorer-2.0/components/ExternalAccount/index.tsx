import { useState } from 'react'
import { Flex } from 'theme-ui'
import { Collapse } from 'react-collapse'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { useWeb3React } from '@web3-react/core'
import Button from '../Button'

const REMOVE_ADDRESS_LINK = gql`
  mutation removeAddressLink($address: String) {
    removeAddressLink(address: $address)
  }
`

export default ({ threeBoxSpace, refetch, children }) => {
  const [open, setOpen] = useState(false)
  const context = useWeb3React()
  const [removeAddressLink] = useMutation(REMOVE_ADDRESS_LINK)
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
        <div sx={{ color: 'muted' }}>External Accounts</div>
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
      <Collapse isOpened={open}>{children}</Collapse>
      <Collapse isOpened={threeBoxSpace.addressLinks.length && !open}>
        <div sx={{ pt: 2, color: 'text' }}>
          {threeBoxSpace.addressLinks.map((link, i) => (
            <Flex
              key={i}
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
              <div
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontFamily: 'monospace',
                  fontSize: 1,
                }}
              >
                {link.address}
              </div>
              <Button
                as="div"
                variant="dangerSmall"
                onClick={async () => {
                  const r = confirm(
                    'Are you sure you want to disconnect this account?',
                  )
                  if (r) {
                    const Box = require('3box')

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
                      context: {
                        box,
                      },
                    })
                    await refetch({
                      variables: context.account,
                    })
                    setDisconnecting({
                      address: link.address,
                      isDisconnecting: false,
                    })
                  }
                }}
              >
                {disconnecting.address == link.address &&
                disconnecting.isDisconnecting
                  ? 'Disconnecting...'
                  : 'Disconnect'}
              </Button>
            </Flex>
          ))}
        </div>
      </Collapse>
    </div>
  )
}
