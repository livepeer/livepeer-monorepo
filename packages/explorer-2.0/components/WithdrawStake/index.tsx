import { Flex } from 'theme-ui'
import { useState, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import gql from 'graphql-tag'
import StakingFlow from '../StakingFlow'
import Spinner from '../Spinner'
import Modal from '../Modal'
import Broadcast from '../../public/img/wifi.svg'
import NewTab from '../../public/img/open-in-new.svg'
import Button from '../Button'
import { useWeb3Mutation } from '../../hooks'
import Utils from 'web3-utils'

export default ({ lock }) => {
  const context = useWeb3Context()
  const [isOpen, setIsModalOpen] = useState(false)

  if (!context.active) {
    return null
  }

  const WITHDRAW_STAKE = gql`
    mutation withdrawStake($unbondingLockId: Int!) {
      txHash: withdrawStake(unbondingLockId: $unbondingLockId)
    }
  `

  const {
    result: { mutate: withdrawStake, isBroadcasted, isMined, txHash },
    reset,
  } = useWeb3Mutation(WITHDRAW_STAKE, {
    variables: {
      unbondingLockId: lock.unbondingLockId,
    },
    notifyOnNetworkStatusChange: true,
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
  console.log('is broadcasted', isBroadcasted)
  return (
    <>
      <Button
        onClick={async () => {
          try {
            await withdrawStake(lock.unbondingLockId)
          } catch (e) {
            return {
              error: e.message.replace('GraphQL error: ', ''),
            }
          }
        }}
        sx={{ py: 1, mr: 2, variant: 'buttons.secondary' }}
      >
        Withdraw
      </Button>
      {isBroadcasted && (
        <Modal
          isOpen={isOpen}
          onDismiss={() => {
            reset()
            setIsModalOpen(false)
          }}
          title={isMined ? 'Successfully Withdrawn' : 'Broadcasted'}
          Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
        >
          <StakingFlow
            action="withdraw"
            account={context.account}
            amount={Utils.fromWei(lock.amount)}
          />
          <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            {txHash && !isMined && (
              <>
                <Flex sx={{ alignItems: 'center', fontSize: 0 }}>
                  <Spinner sx={{ mr: 2 }} />
                  <div sx={{ color: 'text' }}>
                    Waiting for your transaction to be mined.
                  </div>
                </Flex>
                <Button
                  sx={{ display: 'flex', alignItems: 'center' }}
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
      )}
    </>
  )
}
