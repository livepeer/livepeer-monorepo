/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Utils from 'web3-utils'
import Button from '../Button'
import Modal from '../Modal'
import Spinner from '../Spinner'
import Broadcast from '../../static/img/wifi.svg'
import NewTab from '../../static/img/open-in-new.svg'
import { useWeb3Context } from 'web3-react'

interface Props {
  amount?: string
  children: React.ReactNode
}

export default ({ children, amount }: Props) => {
  const context = useWeb3Context()
  const [isOpen, setIsModalOpen] = useState(false)

  const APPROVE = gql`
    mutation approve($type: String!, $amount: String!) {
      txHash: approve(type: $type, amount: $amount)
    }
  `

  const GET_TRANSACTION_RECEIPT = gql`
    query approvalEvent($id: ID!) {
      approvalEvent(id: $id) {
        id
        blockNumber
        hash
      }
    }
  `

  const [approve, { data }] = useMutation(APPROVE, {
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

  let isBroadcasted = data && data.txHash
  let isMined = false
  let isMining = false

  const { data: transaction } = useQuery(GET_TRANSACTION_RECEIPT, {
    variables: {
      id: `${data && data.txHash}-Approval`,
    },
    ssr: false,
    pollInterval: 1000,
    skip: !isBroadcasted || isMined, // skip query if tx hasn't yet been broadcasted
  })

  useEffect(() => {
    if (isBroadcasted) {
      setIsModalOpen(true)
    }
  }, [isBroadcasted])

  isMining = transaction && !transaction.approvalEvent
  isMined = transaction && transaction.approvalEvent

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
          isOpen={isOpen}
          setOpen={setIsModalOpen}
          title={isMined ? 'Success!' : 'Broadcasted'}
          Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
        >
          <div sx={{ mb: 4 }}>
            {isMined ? (
              <div>All set! You're ready to begin staking.</div>
            ) : (
              <div>
                Approving {amount ? Utils.fromWei(amount, 'ether') : ''}{' '}
                Livepeer tokens for staking...
              </div>
            )}
          </div>
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
