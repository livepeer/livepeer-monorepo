/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import Button from '../Button'
import Modal from '../Modal'
import Spinner from '../Spinner'
import Broadcast from '../../public/img/wifi.svg'
import NewTab from '../../public/img/open-in-new.svg'
import { useWeb3Mutation } from '../../hooks'
import { useWeb3Context } from 'web3-react'
import gql from 'graphql-tag'
import { MAX_EARNINGS_CLAIMS_ROUNDS } from '../../lib/utils'
import Banner from '../Banner'

export default ({ account, delegator, currentRound }) => {
  const context = useWeb3Context()

  if (!account || (delegator && !delegator.lastClaimRound)) {
    return null
  }

  // Display approve banner first
  if (parseFloat(account.allowance) == 0) {
    return null
  }

  const [claimModalOpen, setClaimModalOpen] = useState(false)

  let lastClaimRound = parseInt(delegator.lastClaimRound.id, 10)
  let roundsSinceLastClaim = parseInt(currentRound.id, 10) - lastClaimRound
  let totalRoundsToClaim = parseInt(currentRound.id, 10) - lastClaimRound

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
      lastClaimRound: delegator.lastClaimRound.id,
      endRound: currentRound.id,
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
      setClaimModalOpen(true)
    }
  }, [isBroadcasted])

  let banner = null

  if (
    context.account &&
    account &&
    account.id.toLowerCase() == context.account.toLowerCase() &&
    roundsSinceLastClaim > MAX_EARNINGS_CLAIMS_ROUNDS
  ) {
    banner = (
      <Banner
        label={
          <div sx={{ pr: 3 }}>
            It's been over 100 rounds since your last claim.
            {/* <Help
              sx={{
                position: 'relative',
                ml: 1,
                top: '2px',
                width: 12,
                height: 12,
              }}
            /> */}
          </div>
        }
        button={
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
            Claim
          </Button>
        }
      />
    )
  }

  useEffect(() => {
    if (isBroadcasted) {
      setClaimModalOpen(true)
    }
  }, [isBroadcasted])

  return (
    <>
      <Modal
        isOpen={claimModalOpen}
        onDismiss={() => {
          reset()
          setClaimModalOpen(false)
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
            <Button
              onClick={() => setClaimModalOpen(false)}
              sx={{ ml: 'auto' }}
            >
              Done
            </Button>
          )}
        </Flex>
      </Modal>
      {banner}
    </>
  )
}
