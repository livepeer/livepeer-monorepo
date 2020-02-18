import { Flex } from 'theme-ui'
import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import gql from 'graphql-tag'
import Flow from '../Flow'
import Spinner from '../Spinner'
import Modal from '../Modal'
import Broadcast from '../../public/img/wifi.svg'
import NewTab from '../../public/img/open-in-new.svg'
import Button from '../Button'
import { useWeb3Mutation } from '../../hooks'
import Utils from 'web3-utils'
import { Box } from 'theme-ui'

export default ({ delegator, ...props }) => {
  const context = useWeb3React()
  const [isOpen, setIsModalOpen] = useState(false)

  if (!context.active) {
    return null
  }

  const WITHDRAW_FEES = gql`
    mutation withdrawFees {
      txHash: withdrawFees
    }
  `

  const {
    result: { mutate: withdrawFees, isBroadcasted, isMined, txHash },
    reset,
  } = useWeb3Mutation(WITHDRAW_FEES, {
    notifyOnNetworkStatusChange: true,
    context: {
      provider: context.library._web3Provider,
      account: context.account.toLowerCase(),
      returnTxHash: true,
    },
  })

  useEffect(() => {
    if (isBroadcasted) {
      setIsModalOpen(true)
    }
  }, [isBroadcasted])

  return (
    <>
      <Button
        onClick={async () => {
          try {
            await withdrawFees()
          } catch (e) {
            return {
              error: e.message.replace('GraphQL error: ', ''),
            }
          }
        }}
        {...props}
      >
        Withdraw
      </Button>
      <Modal
        isOpen={isOpen}
        onDismiss={() => {
          reset()
          setIsModalOpen(false)
        }}
        title={isMined ? 'Successfully Withdrawn' : 'Broadcasted'}
        Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
      >
        {isMined ? (
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'border',
              borderRadius: 6,
              p: 3,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Your earned fees have been withdrawn into your wallet.
          </Box>
        ) : (
          <Flow
            action="withdraw"
            reverse
            currencyType="ETH"
            account={context.account}
            amount={Utils.fromWei(delegator.pendingFees)}
          />
        )}
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
                <div sx={{ color: 'text' }}>
                  Waiting for your transaction to be mined.
                </div>
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
            <Button onClick={() => setIsModalOpen(false)} sx={{ ml: 'auto' }}>
              Done
            </Button>
          )}
        </Flex>
      </Modal>
    </>
  )
}
