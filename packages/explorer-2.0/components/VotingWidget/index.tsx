import { Box, Flex } from 'theme-ui'
import { Grid } from '@theme-ui/components'
import Utils from 'web3-utils'
import { abbreviateNumber } from '../../lib/utils'
import VoteButton from '../VoteButton'
import { useWeb3React } from '@web3-react/core'
import Button from '../Button'
import { useApolloClient } from '@apollo/react-hooks'
import moment from 'moment'

export default ({ data }) => {
  const context = useWeb3React()
  const client = useApolloClient()
  const pendingStake = data.myAccount?.delegator?.pendingStake
    ? parseFloat(
        Utils.fromWei(data.myAccount.delegator.pendingStake.toString()),
      )
    : 0

  let noVoteStake = parseFloat(
    Utils.fromWei(data.poll?.tally?.no ? data.poll?.tally?.no : '0'),
  )
  let yesVoteStake = parseFloat(
    Utils.fromWei(data.poll?.tally?.yes ? data.poll?.tally?.yes : '0'),
  )
  let totalVoteStake = noVoteStake + yesVoteStake

  let totalNonVoteStake = parseFloat(Utils.fromWei(data.poll.totalNonVoteStake))

  let delegate = null
  if (data?.myAccount?.delegator?.delegate) {
    delegate = data?.myAccount?.delegator?.delegate
  }
  return (
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
        sx={{ mb: 2, pb: 2, borderBottom: '1px solid', borderColor: 'border' }}
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
                : ((yesVoteStake / totalVoteStake) * 100).toPrecision(4)}
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
                : ((noVoteStake / totalVoteStake) * 100).toPrecision(4)}
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
                .humanize()}{' '}
          left
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
            <Flex sx={{ mb: 1, fontSize: 1, justifyContent: 'space-between' }}>
              <span sx={{ color: 'muted' }}>
                My Vote (
                {context.account.replace(context.account.slice(5, 39), '…')})
              </span>
              <span sx={{ fontWeight: 500, color: 'white' }}>
                {data?.vote?.choiceID ? data?.vote?.choiceID : 'N/A'}
              </span>
            </Flex>
            {!data?.vote?.choiceID && data.poll.isActive && (
              <Flex sx={{ fontSize: 1, justifyContent: 'space-between' }}>
                <span sx={{ color: 'muted' }}>My Voting Power</span>
                <span sx={{ fontWeight: 500, color: 'white' }}>
                  <span>
                    {abbreviateNumber(pendingStake, 4)} LPT (
                    {(
                      (pendingStake / (totalVoteStake + totalNonVoteStake)) *
                      100
                    ).toPrecision(2)}
                    %)
                  </span>
                </span>
              </Flex>
            )}
            {data?.vote?.choiceID && data?.vote?.voteStake && (
              <Flex sx={{ fontSize: 1, justifyContent: 'space-between' }}>
                <span sx={{ color: 'muted' }}>My Voting Power</span>
                <span sx={{ fontWeight: 500, color: 'white' }}>
                  <span>
                    {abbreviateNumber(+Utils.fromWei(data?.vote?.voteStake), 4)}{' '}
                    LPT (
                    {(
                      (+Utils.fromWei(data?.vote?.voteStake) /
                        (totalVoteStake + totalNonVoteStake)) *
                      100
                    ).toPrecision(2)}
                    %)
                  </span>
                </span>
              </Flex>
            )}
          </Box>
          {data.poll.isActive && (
            <Grid sx={{ mt: 3 }} gap={2} columns={[2]}>
              <VoteButton choiceId={0} pollAddress={data.poll.id}>
                Yes
              </VoteButton>
              <VoteButton variant="red" choiceId={1} pollAddress={data.poll.id}>
                No
              </VoteButton>
            </Grid>
          )}
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
  )
}
