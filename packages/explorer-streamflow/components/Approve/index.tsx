/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Utils from 'web3-utils'
import Button from '../Button'
import Modal from '../Modal'
import Spinner from '../Spinner'
import Broadcast from '../../static/img/wifi.svg'
import NewTab from '../../static/img/open-in-new.svg'
import { useWeb3Context } from 'web3-react'
import { Account } from '../../@types'

interface Props {
  amount?: string
  account: Account
  children: React.ReactNode
}

export default ({ children, amount, account }: Props) => {
  const context = useWeb3Context()
  const [, setIsModalOpen] = useState(false)

  if (!account) {
    return null
  }

  const APPROVE = gql`
    mutation approve($type: String!, $amount: String!) {
      txHash: approve(type: $type, amount: $amount)
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

  const [approve, { data, error }] = useMutation(APPROVE, {
    variables: {
      type: 'bond',
      amount: Utils.toWei(
        // set transfer allowance to a near inifinite amount if none is provided
        amount ? amount : '10000000000000000000000000000000000000000',
        'ether',
      ),
    },
    notifyOnNetworkStatusChange: true,
    context: {
      provider: context.library.currentProvider,
      account: context.account.toLowerCase(),
      returnTxHash: true,
    },
  })

  console.log('data', data)
  console.log('error', error)

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
        {children}
      </Button>
      {isBroadcasted && (
        <Modal
          isOpen={isBroadcasted}
          setOpen={setIsModalOpen}
          title={isMined ? 'Success!' : 'Broadcasted'}
          Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
        >
          All set! You're ready to begin staking.
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
