/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import StakingFlow from '../StakingFlow'
import Spinner from '../Spinner'
import Modal from '../Modal'
import Broadcast from '../../public/img/wifi.svg'
import NewTab from '../../public/img/open-in-new.svg'
import Button from '../Button'
import { useWeb3Mutation } from '../../hooks'
import { useWeb3Context } from 'web3-react'
import gql from 'graphql-tag'
import Utils from 'web3-utils'

export default ({ lock }) => {
  const [isOpen, setIsModalOpen] = useState(false)
  const context = useWeb3Context()

  const REBOND = gql`
    mutation rebond($unbondingLockId: Int!) {
      txHash: rebond(unbondingLockId: $unbondingLockId)
    }
  `

  const {
    mutate: rebond,
    isBroadcasted,
    isMined,
    isMining,
    txHash,
  } = useWeb3Mutation(REBOND, {
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

  return (
    <>
      <Button
        onClick={async () => {
          try {
            await rebond(lock.unbondingLockId)
          } catch (e) {
            return {
              error: e.message.replace('GraphQL error: ', ''),
            }
          }
        }}
        sx={{ py: 1, mr: 2, variant: 'buttons.secondary' }}
      >
        Restake
      </Button>
      <Modal
        isOpen={isOpen}
        setOpen={setIsModalOpen}
        title={isMined ? 'Successfully Restaked' : 'Broadcasted'}
        Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
      >
        <StakingFlow
          action="stake"
          account={lock.delegate.id}
          amount={Utils.fromWei(lock.amount)}
        />
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          {!isMined && (
            <Flex sx={{ alignItems: 'center', fontSize: 0 }}>
              <Spinner sx={{ mr: 2 }} />
              {isMining && (
                <div sx={{ color: 'text' }}>
                  Waiting for your transaction to be mined.
                </div>
              )}
            </Flex>
          )}
          {!isMined && (
            <Button
              sx={{ display: 'flex', alignItems: 'center' }}
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://etherscan.io/tx/${txHash}`}
            >
              View on Etherscan <NewTab sx={{ ml: 1, width: 16, height: 16 }} />
            </Button>
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
