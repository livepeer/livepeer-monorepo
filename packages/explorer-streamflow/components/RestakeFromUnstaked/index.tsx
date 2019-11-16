/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import StakingFlow from '../StakingFlow'
import Spinner from '../Spinner'
import Modal from '../Modal'
import Broadcast from '../../static/img/wifi.svg'
import NewTab from '../../static/img/open-in-new.svg'
import Button from '../Button'

export default ({ lock }) => {
  const context = useWeb3Context()
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

  const GET_TRANSACTION_RECEIPT = gql`
    query rebondEvent($id: ID!) {
      rebondEvent(id: $id) {
        id
        blockNumber
        hash
      }
    }
  `
  console.log(lock.delegate.id)

  const [rebondFromUnbonded, { data, error }] = useMutation(
    REBOND_FROM_UNBONDED,
    {
      variables: {
        unbondingLockId: lock.unbondingLockId,
        delegate: lock.delegate.id,
      },
      notifyOnNetworkStatusChange: true,
      context: {
        provider: context.library.currentProvider,
        account: context.account.toLowerCase(),
        returnTxHash: true,
      },
    },
  )

  console.log(error)
  let isBroadcasted = data && data.txHash
  let isMined = false
  let isMining = false

  const { data: transaction } = useQuery(GET_TRANSACTION_RECEIPT, {
    variables: {
      id: `${data && data.txHash}-Rebond`,
    },
    ssr: false,
    pollInterval: 1000,
    // skip query if tx hasn't yet been broadcasted or has been mined
    skip: !isBroadcasted || isMined,
  })

  useEffect(() => {
    if (isBroadcasted) {
      setIsModalOpen(true)
    }
  }, [isBroadcasted])

  isMining = transaction && !transaction.rebondEvent
  isMined = transaction && transaction.rebondEvent

  return (
    <>
      <Button
        onClick={async () => {
          console.log('wrong')
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
      {isBroadcasted && (
        <Modal
          isOpen={isOpen}
          setOpen={setIsModalOpen}
          title={isMined ? 'Successfully Rebonded' : 'Broadcasted'}
          Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
        >
          <StakingFlow
            action="stake"
            account={lock.delegate.id}
            amount={lock.amount}
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
                href={`https://etherscan.io/tx/${data.txHash}`}
              >
                View on Etherscan{' '}
                <NewTab sx={{ ml: 1, width: 16, height: 16 }} />
              </Button>
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
