/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Button from '../Button'
import Modal from '../Modal'
import Spinner from '../Spinner'
import Broadcast from '../../public/img/wifi.svg'
import NewTab from '../../public/img/open-in-new.svg'
import { useWeb3Context } from 'web3-react'

interface Props {
  lastClaimRound: number
  endRound: number
  children: React.ReactNode
}

export default ({ children, lastClaimRound, endRound }: Props) => {
  const context = useWeb3Context()
  const [isOpen, setIsModalOpen] = useState(false)
  const totalRoundsToClaim = endRound - (lastClaimRound + 1)

  const BATCH_CLAIM_EARNINGS = gql`
    mutation batchClaimEarnings($lastClaimRound: String!, $endRound: String!) {
      txns: batchClaimEarnings(
        lastClaimRound: $lastClaimRound
        endRound: $endRound
      )
    }
  `

  const GET_TRANSACTION_RECEIPT = gql`
    query claimEarningsEvent($id: ID!) {
      claimEarningsEvent(id: $id) {
        id
        blockNumber
        hash
      }
    }
  `

  const [batchClaimEarnings, { data, error }] = useMutation(
    BATCH_CLAIM_EARNINGS,
    {
      variables: {
        lastClaimRound: lastClaimRound.toString(),
        endRound: endRound.toString(),
      },
      notifyOnNetworkStatusChange: true,
      context: {
        web3: context.library,
        provider: context.library.currentProvider,
        account: context.account.toLowerCase(),
        returnTxHash: true,
      },
    },
  )

  if (error) {
    console.error(error)
  }

  let isBroadcasted = data && data.txns
  let isMined = false
  let isMining = false

  const { data: transaction } = useQuery(GET_TRANSACTION_RECEIPT, {
    variables: {
      id: `${data && data.txns[data.txns.length]}-ClaimEarnings`,
    },
    ssr: false,
    pollInterval: 2000,
    // skip query if tx hasn't yet been broadcasted or has been mined
    skip: !isBroadcasted || isMined,
  })

  useEffect(() => {
    if (isBroadcasted) {
      setIsModalOpen(true)
    }
  }, [isBroadcasted])

  isMining = transaction && !transaction.claimEarningsEvent
  isMined = transaction && transaction.claimEarningsEvent

  return (
    <>
      <Button
        onClick={async () => {
          try {
            await batchClaimEarnings()
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
              <div>Successfully claimed earnings.</div>
            ) : (
              <div>
                Claiming {totalRoundsToClaim} rounds worth of earnings.{' '}
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
                href={`https://etherscan.io/tx/${
                  data.txns[data.txns.length - 1]
                }`}
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
