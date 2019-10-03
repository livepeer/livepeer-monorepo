/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import React, { useState, useEffect } from 'react'
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
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

export default ({ transcoder, amount, disabled }) => {
  const context = useWeb3Context()
  const [isOpen, setIsModalOpen] = useState(false)
  const { width, height } = useWindowSize()

  if (!context.active) {
    return null
  }

  const BOND = gql`
    mutation bond($to: String!, $amount: String!) {
      txHash: bond(to: $to, amount: $amount)
    }
  `

  const GET_TRANSACTION_RECEIPT = gql`
    query bondEvent($id: ID!) {
      bondEvent(id: $id) {
        id
        blockNumber
        hash
      }
    }
  `

  const [bond, { data }] = useMutation(BOND, {
    variables: {
      to: transcoder.id,
      amount: Utils.toWei(amount ? amount : '0'),
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
      id: `${data && data.txHash}-Bond`,
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

  isMining = transaction && !transaction.bondEvent
  isMined = transaction && transaction.bondEvent

  return (
    <>
      <Button
        disabled={disabled}
        onClick={async () => {
          try {
            await bond()
          } catch (e) {
            return {
              error: e.message.replace('GraphQL error: ', ''),
            }
          }
        }}
        sx={{ width: '100%' }}
      >
        Stake
      </Button>
      {isBroadcasted && (
        <Modal
          isOpen={isOpen}
          setOpen={setIsModalOpen}
          title={isMined ? 'Success!' : 'Broadcasted'}
          Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
        >
          {isMined && (
            <Confetti
              canvasRef={React.createRef()}
              width={width}
              height={height}
            />
          )}
          <StakingFlow action="stake" account={transcoder.id} amount={amount} />
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
