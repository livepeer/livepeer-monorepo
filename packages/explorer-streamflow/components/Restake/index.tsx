/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import React, { useState } from 'react'
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
  const [, setIsModalOpen] = useState(false)

  if (!context.active) {
    return null
  }
  console.log(lock)
  const REBOND = gql`
    mutation rebond($unbondingLockId: Int!) {
      txHash: rebond(unbondingLockId: $unbondingLockId)
    }
  `

  const GET_TRANSACTION_RECEIPT = gql`
    query transaction($id: String!) {
      receipt: transaction(id: $id) {
        blockNumber
        blockHash
        transactionIndex
        from
        to
        status
        cumulativeGasUsed
        gasUsed
      }
    }
  `

  const [rebond, { data }] = useMutation(REBOND, {
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

  const isBroadcasted = data && data.txHash

  const { data: transaction, loading: mining } = useQuery(
    GET_TRANSACTION_RECEIPT,
    {
      variables: {
        id: data && data.txHash,
      },
      skip: !isBroadcasted, // skip query if tx hasn't yet been broadcasted
      notifyOnNetworkStatusChange: true,
    },
  )

  const isMined =
    transaction && transaction.receipt && transaction.receipt.blockNumber

  return (
    <>
      <Button
        onClick={() => rebond(lock.unbondingLockId)}
        sx={{ py: 1, mr: 2, variant: 'buttons.secondary' }}
      >
        Rebond
      </Button>
      {isBroadcasted && (
        <Modal
          isOpen={isBroadcasted}
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
                <Spinner />
                {mining && (
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
