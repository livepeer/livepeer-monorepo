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

export default ({ lock }) => {
  const context = useWeb3React()
  const [isOpen, setIsModalOpen] = useState(false)

  if (!context.active) {
    return null
  }

  const REBOND_FROM_UNBONDED = gql`
    mutation rebondFromUnbonded($unbondingLockId: Int!, $delegate: String!) {
      txHash: rebondFromUnbonded(
        unbondingLockId: $unbondingLockId
        delegate: $delegate
      )
    }
  `

  const {
    result: { mutate: rebondFromUnbonded, isBroadcasted, isMined, txHash },
    reset,
  } = useWeb3Mutation(REBOND_FROM_UNBONDED, {
    variables: {
      unbondingLockId: lock.unbondingLockId,
      delegate: lock.delegate.id,
    },
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
        onClick={async () => {
          try {
            await rebondFromUnbonded(lock.unbondingLockId)
          } catch (e) {
            return {
              error: e.message.replace('GraphQL error: ', ''),
            }
          }
        }}
        sx={{ py: 1, mr: 2, variant: 'buttons.secondary' }}
      >
        Rebond
      </Button>

      <Modal
        isOpen={isOpen}
        onDismiss={() => {
          reset()
          setIsModalOpen(false)
        }}
        title={isMined ? 'Successfully Rebonded' : 'Broadcasted'}
        Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
      >
        <Flow
          action="stake"
          account={lock.delegate.id}
          amount={parseFloat(Utils.fromWei(lock.amount))}
        />
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
