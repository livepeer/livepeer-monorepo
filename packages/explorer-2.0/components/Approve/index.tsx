import { Flex, Box } from 'theme-ui'
import { useState, useEffect } from 'react'
import Button from '../Button'
import Modal from '../Modal'
import Spinner from '../Spinner'
import Broadcast from '../../public/img/wifi.svg'
import NewTab from '../../public/img/open-in-new.svg'
import { useWeb3Mutation } from '../../hooks'
import gql from 'graphql-tag'
import { MAXIUMUM_VALUE_UINT256 } from '../../lib/utils'
import Banner from '../Banner'
import { useWeb3React } from '@web3-react/core'

export default ({ account, banner = true }) => {
  const context = useWeb3React()
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [learnMoreModalOpen, setLearnMoreModalOpen] = useState(false)
  const MDXDocument = require('../../data/unlock-tokens.mdx').default

  const APPROVE = gql`
    mutation approve($type: String!, $amount: String!) {
      txHash: approve(type: $type, amount: $amount)
    }
  `
  const {
    result: { mutate: approve, isBroadcasted, isMined, txHash },
    reset,
  } = useWeb3Mutation(APPROVE, {
    variables: {
      type: 'bond',
      amount: MAXIUMUM_VALUE_UINT256,
    },
    context: {
      provider: context.library._web3Provider,
      account: context.account.toLowerCase(),
      returnTxHash: true,
    },
  })

  useEffect(() => {
    if (isBroadcasted) {
      setApproveModalOpen(true)
    }
  }, [isBroadcasted])

  let element = null

  if (account && account.id.toLowerCase() == context.account.toLowerCase()) {
    if (banner) {
      element = (
        <Box sx={{ mb: [3, 3, 3, 4] }}>
          <Banner
            label={
              <Box sx={{ mb: 1 }}>Unlock your Livepeer tokens for staking.</Box>
            }
            button={
              <Flex sx={{ alignSelf: 'flex-end' }}>
                <Button
                  onClick={() => setLearnMoreModalOpen(true)}
                  variant="text"
                  sx={{ mr: 2 }}
                >
                  Learn More
                </Button>
                <Button
                  variant="text"
                  onClick={async () => {
                    try {
                      await approve()
                    } catch (e) {
                      return {
                        error: e.message.replace('GraphQL error: ', ''),
                      }
                    }
                  }}
                >
                  Unlock LPT
                  <Modal
                    title="Unlocking Tokens"
                    showCloseButton
                    isOpen={learnMoreModalOpen}
                    onDismiss={() => setLearnMoreModalOpen(false)}
                  >
                    <MDXDocument />
                  </Modal>
                </Button>
              </Flex>
            }
          />
        </Box>
      )
    } else {
      element = (
        <Box
          sx={{ cursor: 'pointer', color: 'primary' }}
          onClick={async () => {
            try {
              await approve()
            } catch (e) {
              return {
                error: e.message.replace('GraphQL error: ', ''),
              }
            }
          }}
        >
          Unlock Livepeer tokens for staking.
        </Box>
      )
    }
  }

  return (
    <>
      <Modal
        isOpen={approveModalOpen}
        onDismiss={() => {
          reset()
          setApproveModalOpen(false)
        }}
        title={isMined ? 'Success!' : 'Broadcasted'}
        Icon={isMined ? () => <Box sx={{ mr: 1 }}>🎊</Box> : Broadcast}
      >
        <Flex
          sx={{
            border: '1px solid',
            borderColor: 'border',
            borderRadius: 6,
            p: 3,
            alignItems: 'center',
            justifyContent: 'center',
            my: 5,
          }}
        >
          {isMined ? (
            <Box>All set! You're ready to begin staking.</Box>
          ) : (
            <Box>Unlocking Livepeer tokens for staking...</Box>
          )}
        </Flex>
        <Flex
          sx={{
            flexDirection: ['column-reverse', 'column-reverse', 'row'],
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {txHash && !isMined && (
            <>
              <Flex sx={{ alignItems: 'center', fontSize: 0 }}>
                <Spinner sx={{ mr: 2 }} />
                <Box sx={{ color: 'text' }}>
                  Waiting for your transaction to be mined.
                </Box>
              </Flex>
              <Button
                sx={{
                  mb: [2, 2, 0],
                  justifyContent: 'center',
                  width: ['100%', '100%', 'auto'],
                  display: 'flex',
                  alignItems: 'center',
                }}
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://etherscan.io/tx/${txHash}`}
              >
                View on Etherscan{' '}
                <NewTab sx={{ ml: 1, width: 16, height: 16 }} />
              </Button>
            </>
          )}
          {isMined && (
            <Button
              onClick={() => setApproveModalOpen(false)}
              sx={{ ml: 'auto' }}
            >
              Done
            </Button>
          )}
        </Flex>
      </Modal>
      {element}
    </>
  )
}
