/** @jsx jsx */
import React, { useState, useEffect } from 'react'
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
import { useWeb3Context } from 'web3-react'

export default ({ transcoder, amount, disabled }) => {
  const context = useWeb3Context()
  const [isOpen, setIsModalOpen] = useState(false)

  if (!context.active) {
    return null
  }

  const UNBOND = gql`
    mutation unbond($amount: String!) {
      txHash: unbond(amount: $amount)
    }
  `

  const GET_TRANSACTION_RECEIPT = gql`
    query unbondEvent($id: ID!) {
      unbondEvent(id: $id) {
        id
        blockNumber
        hash
      }
    }
  `

  const [unbond, { data }] = useMutation(UNBOND, {
    variables: {
      amount: Utils.toWei(amount.toString()),
    },
    notifyOnNetworkStatusChange: true,
    context: {
      provider: context.library.currentProvider,
      account: context.account.toLowerCase(),
      returnTxHash: true,
    },
  })

  let isBroadcasted = data && data.txHash
  let isMined = false
  let isMining = false

  const { data: transaction } = useQuery(GET_TRANSACTION_RECEIPT, {
    variables: {
      id: `${data && data.txHash}-Unbond`,
    },
    ssr: false,
    // skip query if tx hasn't yet been broadcasted or has been mined
    skip: !isBroadcasted || isMined,
  })

  useEffect(() => {
    if (isBroadcasted) {
      setIsModalOpen(true)
    }
  }, [isBroadcasted])

  isMining = transaction && !transaction.unbondEvent
  isMined = transaction && transaction.unbondEvent

  return (
    <>
      <Button
        disabled={disabled}
        onClick={async () => {
          try {
            await unbond()
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
      {isBroadcasted && (
        <Modal
          isOpen={isOpen}
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
