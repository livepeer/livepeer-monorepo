/** @jsx jsx */
import React, { useState } from 'react'
import { jsx, Flex } from 'theme-ui'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Utils from 'web3-utils'
import Button from '../Button'
import Modal from '../Modal'
import StakingFlow from '../StakingFlow'
import Spinner from '../Spinner'
import Broadcast from '../../static/img/wifi.svg'
import NewTab from '../../static/img/open-in-new.svg'

export default ({ transcoder, amount, context, disabled }) => {
  const [, setIsModalOpen] = useState(false)

  if (!context.active) {
    return null
  }

  const UNBOND = gql`
    mutation unbond($amount: String!) {
      txHash: unbond(amount: $amount)
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

  const [unbond, { data }] = useMutation(UNBOND, {
    variables: {
      amount: Utils.toWei(amount, 'ether'),
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
        disabled={disabled}
        onClick={async () => {
          unstake(unbond)
        }}
        sx={{ backgroundColor: 'red', width: '100%' }}
      >
        Unstake
      </Button>
      {isBroadcasted && (
        <Modal
          isOpen={isBroadcasted}
          setOpen={setIsModalOpen}
          title={isMined ? 'Success!' : 'Broadcasted'}
          Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
        >
          <StakingFlow
            action="unstake"
            account={transcoder.id}
            amount={amount}
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

async function unstake(unstake: any) {
  try {
    await unstake()
  } catch (e) {
    return {
      error: e.message.replace('GraphQL error: ', ''),
    }
  }
}
