/** @jsx jsx */
import React, { useState } from 'react'
import { jsx, Flex } from 'theme-ui'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Utils from 'web3-utils'
import Button from '../Button'
import Modal from '../Modal'
import StakeFlow from '../StakeFlow'
import CircularProgress from '@material-ui/core/CircularProgress'
import Broadcast from '../../static/img/wifi.svg'
import NewTab from '../../static/img/open-in-new.svg'

export default ({ transcoder = null, action, amount, context }) => {
  const [, setIsModalOpen] = useState(false)

  if (!context.active) {
    return null
  }

  // const APPROVE = gql`
  //   mutation approve($type: String!, $amount: String!) {
  //     approve(type: $type, amount: $amount)
  //   }
  // `

  const BOND = gql`
    mutation bond($to: String!, $amount: String!) {
      txHash: bond(to: $to, amount: $amount)
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

  const [bond, { data }] = useMutation(BOND, {
    variables: {
      to: '0x21d1130dc36958db75fbb0e5a9e3e5f5680238ff',
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
        onClick={async () => {
          stake(bond)
        }}
        sx={{ width: '100%' }}
      >
        Stake
      </Button>
      {isBroadcasted && (
        <Modal
          isOpen={isBroadcasted}
          setOpen={setIsModalOpen}
          title={isMined ? 'Success!' : 'Broadcasted'}
          Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
        >
          <StakeFlow />
          <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            {!isMined && (
              <Flex sx={{ alignItems: 'center', fontSize: 0 }}>
                <div sx={{ color: 'primary', mr: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                </div>
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

async function stake(stake: any) {
  try {
    const txHash = await stake()
  } catch (e) {
    return {
      error: e.message.replace('GraphQL error: ', ''),
    }
  }
}

async function unstake(unstake: any) {
  try {
    const txHash = await unstake()
  } catch (e) {
    return {
      error: e.message.replace('GraphQL error: ', ''),
    }
  }
}
