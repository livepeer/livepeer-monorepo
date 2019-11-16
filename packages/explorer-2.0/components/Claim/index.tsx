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
import { useWeb3Mutation } from '../../hooks'

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
      txHash: batchClaimEarnings(
        lastClaimRound: $lastClaimRound
        endRound: $endRound
      )
    }
  `

  const {
    result: { mutate: batchClaimEarnings, isBroadcasted, isMined, txHash },
    reset,
  } = useWeb3Mutation(BATCH_CLAIM_EARNINGS, {
    variables: {
      lastClaimRound: lastClaimRound.toString(),
      endRound: endRound.toString(),
    },
    context: {
      web3: context.library,
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
      <Modal
        isOpen={isOpen}
        onDismiss={() => {
          reset()
          setIsModalOpen(false)
        }}
        title={isMined ? 'Success!' : 'Broadcasted'}
        Icon={isMined ? () => <div sx={{ mr: 1 }}>🎊</div> : Broadcast}
      >
        <div sx={{ mb: 4 }}>
          {isMined ? (
            <div>Successfully claimed earnings.</div>
          ) : (
            <div>Claiming {totalRoundsToClaim} rounds worth of earnings. </div>
          )}
        </div>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          {txHash && !isMined && (
            <>
              <Flex sx={{ alignItems: 'center', fontSize: 0 }}>
                <Spinner sx={{ mr: 2 }} />
                <div sx={{ color: 'text' }}>
                  Waiting for your transaction to be mined.
                </div>
              </Flex>
              <Button
                sx={{ display: 'flex', alignItems: 'center' }}
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://etherscan.io/tx/${txHash}`}
              >
                View on Etherscan{' '}
                <NewTab sx={{ ml: 1, width: 16, height: 16 }} />
              </Button>
            </>
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
