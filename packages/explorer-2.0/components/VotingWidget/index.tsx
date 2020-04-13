import { Box, Flex } from 'theme-ui'
import { Grid } from '@theme-ui/components'
import Utils from 'web3-utils'
import { abbreviateNumber } from '../../lib/utils'
import VoteButton from '../VoteButton'
import { useWeb3React } from '@web3-react/core'
import Button from '../Button'
import { useApolloClient } from '@apollo/react-hooks'

export default ({ data }) => {
  const context = useWeb3React()
  const client = useApolloClient()
  const pendingStake = data.myAccount?.delegator?.pendingStake
    ? parseFloat(
        Utils.fromWei(data.myAccount.delegator.pendingStake.toString()),
      )
    : 0

  let noVoteStake = parseFloat(Utils.fromWei(data.poll.tally.no))
  let yesVoteStake = parseFloat(Utils.fromWei(data.poll.tally.yes))
  let totalVoteStake = noVoteStake + yesVoteStake
  let totalStake = parseFloat(Utils.fromWei(data.totalStake))
  let votingPower = 0
  let delegate = null
  if (data?.myAccount?.delegator?.delegate) {
    delegate = data?.myAccount?.delegator?.delegate
  }
  if (data.vote?.voteStake) {
    votingPower = abbreviateNumber(
      parseFloat(Utils.fromWei(data.vote?.voteStake)),
      4,
    )
  }
  if (data.myAccount?.delegator?.pendingStake) {
    votingPower = abbreviateNumber(
      parseFloat(Utils.fromWei(data.myAccount?.delegator?.pendingStake)),
      4,
    )
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
        Do you support LIP-19?
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
              {(yesVoteStake / totalVoteStake) * 100}%
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
              {(noVoteStake / totalVoteStake) * 100}%
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
          · {abbreviateNumber(totalVoteStake, 2)} LPT · 21 hours left
        </Box>
      </Box>

      {context.active ? (
        <>
          <Box sx={{ mb: 5 }}>
            <Flex
              sx={{
                fontSize: 1,
                mb: 1,
                justifyContent: 'space-between',
              }}
            >
              <span sx={{ color: 'muted' }}>
                Delegate Vote{' '}
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
            <Flex sx={{ fontSize: 1, justifyContent: 'space-between' }}>
              <span sx={{ color: 'muted' }}>Voting Power</span>
              <span sx={{ fontWeight: 500, color: 'white' }}>
                <span>
                  {votingPower} LPT (
                  {((pendingStake / totalStake) * 100).toPrecision(2)}
                  %)
                </span>
              </span>
            </Flex>
          </Box>
          <Grid gap={2} columns={[2]}>
            <VoteButton choiceId={0} pollAddress={data.poll.id}>
              Yes
            </VoteButton>
            <VoteButton variant="red" choiceId={1} pollAddress={data.poll.id}>
              No
            </VoteButton>
          </Grid>
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
