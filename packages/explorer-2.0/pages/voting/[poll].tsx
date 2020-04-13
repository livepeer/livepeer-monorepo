import { Flex, Styled } from 'theme-ui'
import Ballot from '../../public/img/ballot.svg'
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
import useWindowSize from 'react-use/lib/useWindowSize'
import { useQuery } from '@apollo/react-hooks'
import { useWeb3React } from '@web3-react/core'
import Spinner from '../../components/Spinner'
import { useEffect, useState } from 'react'
import gql from 'graphql-tag'

const Poll = () => {
  const pollQuery = require('../../queries/poll.gql')
  const totalStakeQuery = require('../../queries/totalStake.gql')
  const accountQuery = require('../../queries/account.gql')
  const voteQuery = require('../../queries/vote.gql')
  const router = useRouter()
  const context = useWeb3React()

  // const { width } = useWindowSize()
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

  const { data: blockData } = useQuery(
    gql`
      {
        block(id: "latest")
      }
    `,
    {
      ssr: false,
    },
  )

  const { data: totalStakeData } = useQuery(totalStakeQuery, {
    variables: {
      // if polling period is over get total stake at end block
      block:
        parseInt(blockData?.block?.number) > parseInt(data?.poll?.endBlock)
          ? parseInt(data?.poll?.endBlock)
          : parseInt(blockData?.block?.number),
    },
    skip: !data || !blockData,
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
        const response = await transformData(data)
        setPollData(response)
      }
    }
    init()
  }, [data])

  if (!pollData || !totalStakeData) {
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

  let noVoteStake = parseFloat(Utils.fromWei(pollData.tally.no))
  let yesVoteStake = parseFloat(Utils.fromWei(pollData.tally.yes))
  let totalVoteStake = noVoteStake + yesVoteStake
  let totalStake = parseFloat(Utils.fromWei(totalStakeData.protocol.totalStake))

  return (
    <>
      <Flex sx={{ width: '100%' }}>
        <Flex
          sx={{
            mt: [3, 3, 3, 5],
            pr: [0, 0, 0, 0, 6],
            width: '100%',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Styled.h1
              sx={{
                fontSize: [3, 3, 4, 5],
                display: 'flex',
                mb: 4,
                alignItems: 'center',
              }}
            >
              <Ballot
                sx={{
                  width: [20, 20, 20, 26],
                  height: [20, 20, 20, 26],
                  color: 'primary',
                  mr: 2,
                }}
              />
              {pollData.title} (LIP-{pollData.lip})
            </Styled.h1>
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
                      Total Support (50% needed)
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
                    {isNaN(yesVoteStake / totalVoteStake)
                      ? 0
                      : (yesVoteStake / totalVoteStake) * 100}
                    %
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
                          : (yesVoteStake / totalVoteStake) * 100}
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
                          : (noVoteStake / totalVoteStake) * 100}
                        %)
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
                      Total Participation (33% needed)
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
                    {abbreviateNumber((totalVoteStake / totalStake) * 100, 4)}%
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
                      Voters (
                      {abbreviateNumber((totalVoteStake / totalStake) * 100, 4)}
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
                      Nonvoters (
                      {abbreviateNumber(
                        ((totalStake - totalVoteStake) / totalStake) * 100,
                        7,
                      )}
                      %)
                    </span>
                    <span>
                      <span sx={{ fontFamily: 'monospace' }}>
                        {abbreviateNumber(totalStake - totalVoteStake, 4)} LPT
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

        <Flex
          sx={{
            display: ['none', 'none', 'none', 'none', 'flex'],
            position: 'sticky',
            alignSelf: 'flex-start',
            top: 5,
            minWidth: '30%',
          }}
        >
          <VotingWidget
            data={{
              poll: pollData,
              delegateVote: delegateVoteData?.vote,
              vote: voteData?.vote,
              totalStake: totalStakeData.protocol.totalStake,
              myAccount: myAccountData,
            }}
          />
        </Flex>
      </Flex>
    </>
  )
}

Poll.getLayout = getLayout

export default withApollo({
  ssr: true,
})(Poll)

async function transformData(data) {
  const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  })
  const { gitCommitHash, proposal } = await ipfs.catJSON(data.poll.proposal)
  const response = fm(proposal.text)
  return {
    ...data.poll,
    ...response.attributes,
    created: response.attributes.created.toString(),
    text: response.body,
    gitCommitHash,
  }
}
