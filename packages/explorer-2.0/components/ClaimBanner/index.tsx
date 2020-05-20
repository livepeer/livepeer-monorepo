import { Flex, Box } from 'theme-ui'
import { useState, useContext } from 'react'
import Button from '../Button'
import Modal from '../Modal'
import { MAX_EARNINGS_CLAIMS_ROUNDS } from '../../lib/utils'
import Banner from '../Banner'
import { useWeb3React } from '@web3-react/core'
import { MutationsContext } from '../../contexts'
import { useApolloClient } from '@apollo/react-hooks'

export default ({ delegator, currentRound }) => {
  const context = useWeb3React()
  const client = useApolloClient()
  const { batchClaimEarnings }: any = useContext(MutationsContext)
  const [learnMoreModalOpen, setLearnMoreModalOpen] = useState(false)
  const MDXDocument = require('../../data/claim-earnings.mdx').default

  let lastClaimRound = parseInt(delegator.lastClaimRound.id, 10)
  let roundsSinceLastClaim = parseInt(currentRound.id, 10) - lastClaimRound

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
                    client.writeData({
                      data: {
                        txSummaryModal: {
                          __typename: 'TxSummaryModal',
                          open: true,
                        },
                      },
                    })
                    await batchClaimEarnings({
                      variables: {
                        lastClaimRound: delegator.lastClaimRound.id,
                        endRound: currentRound.id,
                      },
                    })
                    client.writeData({
                      data: {
                        txSummaryModal: {
                          __typename: 'TxSummaryModal',
                          open: false,
                        },
                      },
                    })
                  } catch (e) {
                    client.writeData({
                      data: {
                        txSummaryModal: {
                          __typename: 'TxSummaryModal',
                          error: true,
                        },
                      },
                    })
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

  return banner
}
