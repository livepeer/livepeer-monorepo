import { Flex, Box } from 'theme-ui'
import { useState, useEffect } from 'react'
import Button from '../Button'
import Modal from '../Modal'
import Spinner from '../Spinner'
import Broadcast from '../../public/img/wifi.svg'
import NewTab from '../../public/img/open-in-new.svg'
import { useWeb3Mutation } from '../../hooks'
import gql from 'graphql-tag'
import { MAX_EARNINGS_CLAIMS_ROUNDS } from '../../lib/utils'
import Banner from '../Banner'
import { useWeb3React } from '@web3-react/core'

export default ({ delegator, currentRound }) => {
  const context = useWeb3React()
  const [claimModalOpen, setClaimModalOpen] = useState(false)
  const [learnMoreModalOpen, setLearnMoreModalOpen] = useState(false)
  const MDXDocument = require('../../data/claim-earnings.mdx').default

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
      web3: context?.library,
      provider: context?.library?.currentProvider,
      account: context?.account?.toLowerCase(),
      returnTxHash: true,
    },
  })

  useEffect(() => {
    if (isBroadcasted) {
      setClaimModalOpen(true)
    }
  }, [isBroadcasted])

  let banner = null

  if (context.account && roundsSinceLastClaim > MAX_EARNINGS_CLAIMS_ROUNDS) {
    banner = (
      <Box sx={{ mt: [2, 2, 2, 0], mb: 4 }}>
        <Banner
          label={
            <Box sx={{ mb: 1 }}>
              It's been over 100 rounds since your last claim.
            </Box>
          }
          button={
            <Flex sx={{ alignSelf: 'flex-end' }}>
              <Button
                onClick={() => setLearnMoreModalOpen(true)}
                variant="text"
                sx={{ mr: 2 }}
              >
                Learn More
              </Button>
              <Button
                variant="text"
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
                Claim Earnings
                <Modal
                  title="Claiming Your Earnings"
                  showCloseButton
                  isOpen={learnMoreModalOpen}
                  onDismiss={() => setLearnMoreModalOpen(false)}
                >
                  <MDXDocument />
                </Modal>
              </Button>
            </Flex>
          }
        />
      </Box>
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
        Icon={isMined ? () => <Box sx={{ mr: 1 }}>🎊</Box> : Broadcast}
      >
        <Box
          sx={{
            border: '1px solid',
            borderRadius: 10,
            borderColor: 'border',
            p: 3,
          }}
        >
          {isMined ? (
            <Box>Successfully claimed earnings.</Box>
          ) : (
            <Box>Claiming {totalRoundsToClaim} rounds worth of earnings. </Box>
          )}
        </Box>
        <Flex
          sx={{
            flexDirection: ['column-reverse', 'column-reverse', 'row'],
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {txHash && !isMined && (
            <>
              <Flex sx={{ alignItems: 'center', fontSize: 0 }}>
                <Spinner sx={{ mr: 2 }} />
                <div sx={{ color: 'text' }}>
                  Waiting for your transaction to be mined.
                </div>
              </Flex>
              <Button
                sx={{
                  mb: [2, 2, 0],
                  justifyContent: 'center',
                  width: ['100%', '100%', 'auto'],
                  display: 'flex',
                  alignItems: 'center',
                }}
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
