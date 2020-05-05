import { Flex, Styled } from 'theme-ui'
import { Text } from '@theme-ui/components'
import { getLayout } from '../../layouts/main'
import fm from 'front-matter'
import IPFS from 'ipfs-mini'
import { Box } from 'theme-ui'
import Card from '../../components/Card'
import ReactTooltip from 'react-tooltip'
import Help from '../../public/img/help.svg'
import VotingWidget from '../../components/VotingWidget'
import ReactMarkdown from 'react-markdown'
import Utils from 'web3-utils'
import { abbreviateNumber } from '../../lib/utils'
import { withApollo } from '../../lib/apollo'
import { useRouter } from 'next/router'
import { useQuery, useApolloClient } from '@apollo/react-hooks'
import { useWeb3React } from '@web3-react/core'
import Spinner from '../../components/Spinner'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { useWindowSize } from 'react-use'
import BottomDrawer from '../../components/BottomDrawer'
import Button from '../../components/Button'

const Poll = () => {
  const pollQuery = require('../../queries/poll.gql')
  const accountQuery = require('../../queries/account.gql')
  const voteQuery = require('../../queries/vote.gql')
  const router = useRouter()
  const context = useWeb3React()
  const client = useApolloClient()
  const { width } = useWindowSize()
  const [pollData, setPollData] = useState(null)
  const { query } = router
  const pollId = query.poll.toString().toLowerCase()
  const { data } = useQuery(pollQuery, {
    variables: {
      id: pollId,
    },
    pollInterval: 10000,
    ssr: false,
  })

  const { data: myAccountData } = useQuery(accountQuery, {
    variables: {
      account: context?.account?.toLowerCase(),
    },
    pollInterval: 20000,
    skip: !context.active,
  })

  const { data: voteData } = useQuery(voteQuery, {
    variables: {
      id: `${context?.account?.toLowerCase()}-${pollId}`,
    },
    pollInterval: 20000,
    skip: !context.active,
  })

  const { data: delegateVoteData } = useQuery(voteQuery, {
    variables: {
      id: `${myAccountData?.delegator?.delegate?.id.toLowerCase()}-${pollId}`,
    },
    pollInterval: 20000,
    skip: !myAccountData?.delegator?.delegate,
  })

  useEffect(() => {
    const init = async () => {
      if (data) {
        const response = await transformData({
          poll: data.poll,
        })
        setPollData(response)
      }
    }
    init()
  }, [data])

  if (!pollData) {
    return (
      <Flex
        sx={{
          height: [
            'calc(100vh - 100px)',
            'calc(100vh - 100px)',
            'calc(100vh - 100px)',
            '100vh',
          ],
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spinner />
      </Flex>
    )
  }

  let noVoteStake = parseFloat(
    Utils.fromWei(pollData?.tally?.no ? pollData?.tally?.no : '0'),
  )
  let yesVoteStake = parseFloat(
    Utils.fromWei(pollData?.tally?.yes ? pollData?.tally?.yes : '0'),
  )
  let totalVoteStake = noVoteStake + yesVoteStake

  return (
    <>
      <Flex sx={{ width: '100%' }}>
        <Flex
          sx={{
            mt: [0, 0, 0, 5],
            pr: [0, 0, 0, 6],
            width: '100%',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ mb: 4, width: '100%' }}>
            <Flex
              sx={{
                mb: 1,
                alignItems: 'center',
              }}
            >
              <Box sx={{ mr: 1 }}>Status:</Box>
              <Text
                variant={pollData.status}
                sx={{ textTransform: 'capitalize', fontWeight: 700 }}
              >
                {pollData.status}
              </Text>
            </Flex>
            <Styled.h1
              sx={{
                fontSize: [3, 3, 4, 4, 5],
                display: 'flex',
                mb: '10px',
                alignItems: 'center',
              }}
            >
              {pollData.title} (LIP-{pollData.lip})
            </Styled.h1>
            <Box sx={{ fontSize: 0, color: 'muted' }}>
              {!pollData.isActive ? (
                <Box>
                  Voting ended on{' '}
                  {moment.unix(pollData.endTime).format('MMM Do, YYYY')} at
                  block {pollData.endBlock}
                </Box>
              ) : (
                <Box>
                  Voting ends in ~
                  {moment()
                    .add(pollData.estimatedTimeRemaining, 'seconds')
                    .fromNow(true)}
                </Box>
              )}
            </Box>
            {pollData.isActive && (
              <Button
                sx={{ display: ['flex', 'flex', 'flex', 'none'], mt: 2, mr: 2 }}
                onClick={() =>
                  client.writeData({
                    data: {
                      bottomDrawerOpen: true,
                    },
                  })
                }
              >
                Vote
              </Button>
            )}
          </Box>

          <Box>
            <Box
              sx={{
                display: 'grid',
                gridGap: 2,
                gridTemplateColumns: [
                  '100%',
                  '100%',
                  `repeat(auto-fit, minmax(128px, 1fr))`,
                ],
                mb: 2,
              }}
            >
              <Card
                sx={{ flex: 1, mb: 0 }}
                title={
                  <Flex sx={{ alignItems: 'center' }}>
                    <Box sx={{ color: 'muted' }}>
                      Total Support ({pollData.threshold / 10000}% needed)
                    </Box>
                    {/* <Flex>
                      <ReactTooltip
                        id="tooltip-total-staked"
                        className="tooltip"
                        place="top"
                        type="dark"
                        effect="solid"
                      />
                      <Help
                        data-tip="This is the amount currently delegated to an Orchestrator."
                        data-for="tooltip-total-staked"
                        sx={{
                          color: 'muted',
                          cursor: 'pointer',
                          ml: 1,
                        }}
                      />
                    </Flex> */}
                  </Flex>
                }
                subtitle={
                  <Box
                    sx={{
                      fontSize: 5,
                      color: 'text',
                      lineHeight: 'heading',
                    }}
                  >
                    {pollData.totalSupport.toPrecision(4)}%
                  </Box>
                }
              >
                <Box sx={{ mt: 3 }}>
                  <Flex
                    sx={{ fontSize: 1, mb: 1, justifyContent: 'space-between' }}
                  >
                    <Flex sx={{ alignItems: 'center' }}>
                      <Box sx={{ color: 'muted' }}>
                        Yes (
                        {isNaN(yesVoteStake / totalVoteStake)
                          ? 0
                          : ((yesVoteStake / totalVoteStake) * 100).toPrecision(
                              4,
                            )}
                        %)
                      </Box>
                    </Flex>
                    <span sx={{ fontFamily: 'monospace' }}>
                      {abbreviateNumber(yesVoteStake, 4)} LPT
                    </span>
                  </Flex>
                  <Flex
                    sx={{
                      fontSize: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <Flex sx={{ alignItems: 'center' }}>
                      <Box sx={{ color: 'muted' }}>
                        No (
                        {isNaN(noVoteStake / totalVoteStake)
                          ? 0
                          : ((noVoteStake / totalVoteStake) * 100).toPrecision(
                              4,
                            )}
                        %
                      </Box>
                    </Flex>
                    <span sx={{ fontFamily: 'monospace' }}>
                      {abbreviateNumber(noVoteStake, 4)} LPT
                    </span>
                  </Flex>
                </Box>
              </Card>

              <Card
                sx={{ flex: 1, mb: 0 }}
                title={
                  <Flex sx={{ alignItems: 'center' }}>
                    <Box sx={{ color: 'muted' }}>
                      Total Participation ({pollData.quorum / 10000}% needed)
                    </Box>
                    {/* <Flex>
                      <ReactTooltip
                        id="tooltip-equity"
                        className="tooltip"
                        place="top"
                        type="dark"
                        effect="solid"
                      />
                      <Help
                        data-tip="Account's equity relative to the entire network."
                        data-for="tooltip-equity"
                        sx={{
                          color: 'muted',
                          cursor: 'pointer',
                          ml: 1,
                        }}
                      />
                    </Flex> */}
                  </Flex>
                }
                subtitle={
                  <Box
                    sx={{
                      fontSize: 5,
                      color: 'text',
                      lineHeight: 'heading',
                    }}
                  >
                    {pollData.totalParticipation.toPrecision(4)}%
                  </Box>
                }
              >
                <Box sx={{ mt: 3 }}>
                  <Flex
                    sx={{
                      fontSize: 1,
                      mb: 1,
                      justifyContent: 'space-between',
                    }}
                  >
                    <span sx={{ color: 'muted' }}>
                      Voters ({pollData.totalParticipation.toPrecision(4)}
                      %)
                    </span>
                    <span>
                      <span sx={{ fontFamily: 'monospace' }}>
                        {abbreviateNumber(totalVoteStake, 4)} LPT
                      </span>
                    </span>
                  </Flex>
                  <Flex sx={{ fontSize: 1, justifyContent: 'space-between' }}>
                    <span sx={{ color: 'muted' }}>
                      Nonvoters ({pollData.nonVoters.toPrecision(4)}
                      %)
                    </span>
                    <span>
                      <span sx={{ fontFamily: 'monospace' }}>
                        {abbreviateNumber(pollData.nonVotersStake, 4)} LPT
                      </span>
                    </span>
                  </Flex>
                </Box>
              </Card>
            </Box>
            <Card
              sx={{
                mb: 2,
                h2: { ':first-of-type': { mt: 0 }, mt: 2 },
                h3: { mt: 2 },
                h4: { mt: 2 },
                h5: { mt: 2 },
              }}
            >
              <ReactMarkdown source={pollData.text} />
            </Card>
          </Box>
        </Flex>

        {width > 1020 ? (
          <Flex
            sx={{
              display: ['none', 'none', 'none', 'flex'],
              position: 'sticky',
              alignSelf: 'flex-start',
              top: 5,
              minWidth: '31%',
            }}
          >
            <VotingWidget
              data={{
                poll: pollData,
                delegateVote: delegateVoteData?.vote,
                vote: voteData?.vote,
                myAccount: myAccountData,
              }}
            />
          </Flex>
        ) : (
          <BottomDrawer>
            <VotingWidget
              data={{
                poll: pollData,
                delegateVote: delegateVoteData?.vote,
                vote: voteData?.vote,
                myAccount: myAccountData,
              }}
            />
          </BottomDrawer>
        )}
      </Flex>
    </>
  )
}

async function transformData({ poll }) {
  let noVoteStake = parseFloat(
    Utils.fromWei(poll?.tally?.no ? poll?.tally?.no : '0'),
  )
  let yesVoteStake = parseFloat(
    Utils.fromWei(poll?.tally?.yes ? poll?.tally?.yes : '0'),
  )
  let totalVoteStake = parseFloat(Utils.fromWei(poll.totalVoteStake))
  let totalNonVoteStake = parseFloat(Utils.fromWei(poll.totalNonVoteStake))
  let totalSupport = isNaN(yesVoteStake / totalVoteStake)
    ? 0
    : (yesVoteStake / totalVoteStake) * 100
  let totalStake = totalNonVoteStake + totalVoteStake
  let totalParticipation = (totalVoteStake / totalStake) * 100
  let nonVotersStake = totalStake - totalVoteStake
  let nonVoters = ((totalStake - totalVoteStake) / totalStake) * 100

  const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  })
  const { gitCommitHash, text } = await ipfs.catJSON(poll.proposal)
  const response = fm(text)
  return {
    ...response.attributes,
    created: response.attributes.created.toString(),
    text: response.body,
    gitCommitHash,
    totalStake,
    totalSupport,
    totalParticipation,
    nonVoters,
    nonVotersStake,
    yesVoteStake,
    noVoteStake,
    ...poll,
  }
}

Poll.getLayout = getLayout

export default withApollo({
  ssr: true,
})(Poll)
