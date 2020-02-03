import { useState, useEffect } from 'react'
import { Flex } from 'theme-ui'
import gql from 'graphql-tag'
import Utils from 'web3-utils'
import Button from '../Button'
import Modal from '../Modal'
import StakingFlow from '../StakingFlow'
import Spinner from '../Spinner'
import Broadcast from '../../public/img/wifi.svg'
import NewTab from '../../public/img/open-in-new.svg'
import { useWeb3React } from '@web3-react/core'
import { useWeb3Mutation } from '../../hooks'

export default ({ transcoder, amount, disabled }) => {
  const context = useWeb3React()
  const [isOpen, setIsModalOpen] = useState(false)

  if (!context.active) {
    return null
  }

  const UNBOND = gql`
    mutation unbond($amount: String!) {
      txHash: unbond(amount: $amount)
    }
  `

  const {
    result: { mutate: unbond, isBroadcasted, isMined, txHash },
    reset,
  } = useWeb3Mutation(UNBOND, {
    context: {
      provider: context.library.currentProvider,
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
        disabled={disabled}
        onClick={async () => {
          try {
            await unbond({
              variables: {
                amount: Utils.toWei(amount ? amount.toString() : '0'),
              },
            })
          } catch (e) {
            return {
              error: e.message.replace('GraphQL error: ', ''),
            }
          }
        }}
        sx={{ backgroundColor: 'red', width: '100%' }}
      >
        Unstake
      </Button>

      <Modal
        isOpen={isOpen}
        onDismiss={() => {
          reset()
          setIsModalOpen(false)
        }}
        title={isMined ? 'Success!' : 'Broadcasted'}
        Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
      >
        <StakingFlow action="unstake" account={transcoder.id} amount={amount} />
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
            <Button
              onClick={() => {
                reset()
                setIsModalOpen(false)
              }}
              sx={{ ml: 'auto' }}
            >
              Done
            </Button>
          )}
        </Flex>
      </Modal>
    </>
  )
}
