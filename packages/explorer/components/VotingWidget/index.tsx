import { Box, Flex } from 'theme-ui'
import { Grid } from '@theme-ui/components'
import Utils from 'web3-utils'
import { abbreviateNumber } from '../../lib/utils'
import VoteButton from '../VoteButton'
import { useWeb3React } from '@web3-react/core'
import Button from '../Button'
import ReactTooltip from 'react-tooltip'
import { useApolloClient } from '@apollo/react-hooks'
import moment from 'moment'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Check from '../../public/img/check.svg'
import Copy from '../../public/img/copy.svg'
import { useState, useEffect } from 'react'
import Modal from '../Modal'

export default ({ data }) => {
  const context = useWeb3React()
  const client = useApolloClient()
  const [copied, setCopied] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  let noVoteStake = parseFloat(
    Utils.fromWei(data.poll?.tally?.no ? data.poll?.tally?.no : '0'),
  )
  let yesVoteStake = parseFloat(
    Utils.fromWei(data.poll?.tally?.yes ? data.poll?.tally?.yes : '0'),
  )
  let totalVoteStake = noVoteStake + yesVoteStake
  let totalNonVoteStake = parseFloat(Utils.fromWei(data.poll.totalNonVoteStake))
  let votingPower = getVotingPower(data?.myAccount, data?.vote)

  let delegate = null
  if (data?.myAccount?.delegator?.delegate) {
    delegate = data?.myAccount?.delegator?.delegate
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Box
          sx={{
            width: '100%',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: 10,
            backgroundColor: 'surface',
            px: 3,
            py: 2,
          }}
        >
          <Box sx={{ fontWeight: 'bold', fontSize: 3, mb: 2 }}>
            Do you support LIP-{data.poll.lip}?
          </Box>
          <Box
            sx={{
              mb: 2,
              pb: 2,
              borderBottom: '1px solid',
              borderColor: 'border',
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Flex
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                  width: '100%',
                  height: 24,
                  mb: '8px',
                }}
              >
                <Box
                  sx={{
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                    borderTopRightRadius:
                      yesVoteStake / totalVoteStake === 1 ? 6 : 0,
                    borderBottomRightRadius:
                      yesVoteStake / totalVoteStake === 1 ? 6 : 0,
                    position: 'absolute',
                    height: '100%',
                    bg: 'rgba(255, 255, 255, .2)',
                    width: `${(yesVoteStake / totalVoteStake) * 100}%`,
                  }}
                />
                <Box
                  sx={{
                    lineHeight: 1,
                    fontWeight: 500,
                    pl: 1,
                    color: 'text',
                    fontSize: 1,
                  }}
                >
                  Yes
                </Box>
                <Box sx={{ lineHeight: 1, pr: 1, color: 'text', fontSize: 1 }}>
                  {isNaN(yesVoteStake / totalVoteStake)
                    ? 0
                    : ((yesVoteStake / totalVoteStake) * 100).toPrecision(5)}
                  %
                </Box>
              </Flex>
              <Flex
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                  height: 24,
                  width: '100%',
                }}
              >
                <Box
                  sx={{
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                    borderTopRightRadius:
                      noVoteStake / totalVoteStake === 1 ? 6 : 0,
                    borderBottomRightRadius:
                      noVoteStake / totalVoteStake === 1 ? 6 : 0,
                    position: 'absolute',
                    height: '100%',
                    bg: 'rgba(255, 255, 255, .2)',
                    width: `${(noVoteStake / totalVoteStake) * 100}%`,
                  }}
                />
                <Box
                  sx={{
                    lineHeight: 1,
                    pl: 1,
                    fontWeight: 500,
                    color: 'text',
                    fontSize: 1,
                  }}
                >
                  No
                </Box>
                <Box sx={{ lineHeight: 1, pr: 1, color: 'text', fontSize: 1 }}>
                  {isNaN(noVoteStake / totalVoteStake)
                    ? 0
                    : ((noVoteStake / totalVoteStake) * 100).toPrecision(5)}
                  %
                </Box>
              </Flex>
            </Box>
            <Box sx={{ fontSize: 1, color: 'muted' }}>
              {data.poll.votes.length}{' '}
              {`${
                data.poll.votes.length > 1 || data.poll.votes.length === 0
                  ? 'votes'
                  : 'vote'
              }`}{' '}
              · {abbreviateNumber(totalVoteStake, 4)} LPT ·{' '}
              {!data.poll.isActive
                ? 'Final Results'
                : moment
                    .duration(data.poll.estimatedTimeRemaining, 'seconds')
                    .humanize() + ' left'}
            </Box>
          </Box>

          {context.active ? (
            <>
              <Box>
                <Flex
                  sx={{
                    fontSize: 1,
                    mb: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <span sx={{ color: 'muted' }}>
                    My Delegate Vote{' '}
                    {delegate &&
                      `(${delegate.id.replace(delegate.id.slice(5, 39), '…')})`}
                  </span>
                  <span sx={{ fontWeight: 500, color: 'white' }}>
                    {data?.delegateVote?.choiceID
                      ? data?.delegateVote?.choiceID
                      : 'N/A'}
                  </span>
                </Flex>
                <Flex
                  sx={{ mb: 1, fontSize: 1, justifyContent: 'space-between' }}
                >
                  <span sx={{ color: 'muted' }}>
                    My Vote (
                    {context.account.replace(context.account.slice(5, 39), '…')}
                    )
                  </span>
                  <span sx={{ fontWeight: 500, color: 'white' }}>
                    {data?.vote?.choiceID ? data?.vote?.choiceID : 'N/A'}
                  </span>
                </Flex>
                {((!data?.vote?.choiceID && data.poll.isActive) ||
                  data?.vote?.choiceID) && (
                  <Flex sx={{ fontSize: 1, justifyContent: 'space-between' }}>
                    <span sx={{ color: 'muted' }}>My Voting Power</span>
                    <span sx={{ fontWeight: 500, color: 'white' }}>
                      <span>
                        {abbreviateNumber(Utils.fromWei(votingPower), 4)} LPT (
                        {(
                          (+Utils.fromWei(votingPower) /
                            (totalVoteStake + totalNonVoteStake)) *
                          100
                        ).toPrecision(2)}
                        %)
                      </span>
                    </span>
                  </Flex>
                )}
              </Box>
              {data.poll.isActive && renderVoteButton(data)}
            </>
          ) : (
            <Button
              onClick={() => {
                client.writeData({
                  data: {
                    walletModalOpen: true,
                  },
                })
              }}
              sx={{
                width: '100%',
              }}
            >
              Connect Wallet
            </Button>
          )}
        </Box>
      </Box>
      {data.poll.isActive && (
        <Box
          sx={{
            display: ['none', 'none', 'none', 'block'],
            mt: 2,
            fontSize: 0,
            borderRadius: 6,
            border: '1px solid',
            borderColor: 'border',
            p: 2,
          }}
        >
          <Box sx={{ lineHeight: 1.8 }}>
            Are you an orchestrator?{' '}
            <span
              onClick={() => setModalOpen(true)}
              sx={{ color: 'primary', cursor: 'pointer' }}
            >
              Follow these instructions
            </span>{' '}
            if you prefer to vote with the Livepeer CLI.
          </Box>
        </Box>
      )}
      <Modal
        title="Livepeer CLI Voting Instructions"
        isOpen={modalOpen}
        onDismiss={() => setModalOpen(false)}
      >
        <ol sx={{ pl: 15 }}>
          <li sx={{ mb: 4 }}>
            <div sx={{ mb: 2 }}>
              Run the Livepeer CLI and select the option to "Vote on a poll".
              When prompted for a contract address, copy and paste this poll's
              contract address:
            </div>
            <div
              sx={{
                p: 2,
                mb: 1,
                position: 'relative',
                color: 'primary',
                bg: 'background',
                borderRadius: 4,
                fontFamily: 'monospace',
              }}
            >
              {data.poll.id}
              <CopyToClipboard
                text={data.poll.id}
                onCopy={() => setCopied(true)}
              >
                <Flex
                  data-for="copyAddress"
                  data-tip={`${
                    copied ? 'Copied' : 'Copy poll address to clipboard'
                  }`}
                  sx={{
                    ml: 1,
                    mt: '3px',
                    position: 'absolute',
                    right: 12,
                    top: 10,
                    cursor: 'pointer',
                    borderRadius: 1000,
                    bg: 'surface',
                    width: 26,
                    height: 26,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ReactTooltip
                    id="copyAddress"
                    className="tooltip"
                    place="left"
                    type="dark"
                    effect="solid"
                  />
                  {copied ? (
                    <Check
                      sx={{
                        width: 12,
                        height: 12,
                        color: 'muted',
                      }}
                    />
                  ) : (
                    <Copy
                      sx={{
                        width: 12,
                        height: 12,
                        color: 'muted',
                      }}
                    />
                  )}
                </Flex>
              </CopyToClipboard>
            </div>
          </li>
          <li sx={{ mb: 3 }}>
            <div sx={{ mb: 2 }}>
              The Livepeer CLI will prompt you for your vote. Enter 0 to vote
              "Yes" or 1 to vote "No".
            </div>
          </li>
          <li sx={{ mb: 0 }}>
            <div sx={{ mb: 2 }}>
              Once your vote is confirmed, check back here to see it reflected
              in the UI.
            </div>
          </li>
        </ol>
      </Modal>
    </Box>
  )
}

function renderVoteButton(data) {
  switch (data?.vote?.choiceID) {
    case 'Yes':
      return (
        <VoteButton
          disabled={!(parseFloat(data?.myAccount?.delegator?.pendingStake) > 0)}
          sx={{ mt: 3, width: '100%' }}
          variant="red"
          choiceId={1}
          pollAddress={data.poll.id}
        >
          Change Vote To No
        </VoteButton>
      )
    case 'No':
      return (
        <VoteButton
          disabled={!(parseFloat(data?.myAccount?.delegator?.pendingStake) > 0)}
          sx={{ mt: 3, width: '100%' }}
          choiceId={0}
          pollAddress={data.poll.id}
        >
          Change Vote To Yes
        </VoteButton>
      )
    default:
      return (
        <Grid sx={{ mt: 3 }} gap={2} columns={[2]}>
          <VoteButton
            disabled={
              !(parseFloat(data?.myAccount?.delegator?.pendingStake) > 0)
            }
            choiceId={0}
            pollAddress={data.poll.id}
          >
            Yes
          </VoteButton>
          <VoteButton
            disabled={
              !(parseFloat(data?.myAccount?.delegator?.pendingStake) > 0)
            }
            variant="red"
            choiceId={1}
            pollAddress={data.poll.id}
          >
            No
          </VoteButton>
        </Grid>
      )
  }
}

function getVotingPower(myAccount, vote) {
  // if account is a delegate its voting power is its total stake minus its delegators' vote stake (nonVoteStake)
  if (myAccount?.account.id === myAccount?.delegator?.delegate.id) {
    if (vote?.voteStake) {
      return Utils.toBN(vote.voteStake)
        .sub(Utils.toBN(vote?.nonVoteStake ? vote.nonVoteStake : 0))
        .toString()
    }
    return Utils.toBN(
      myAccount?.delegator?.delegate?.totalStake
        ? myAccount?.delegator?.delegate?.totalStake
        : 0,
    )
      .sub(Utils.toBN(vote?.nonVoteStake ? vote.nonVoteStake : 0))
      .toString()
  }

  return myAccount?.delegator?.pendingStake
    ? myAccount?.delegator?.pendingStake
    : '0'
}
