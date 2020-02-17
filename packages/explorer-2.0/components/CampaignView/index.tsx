import { Flex } from 'theme-ui'
import * as Utils from 'web3-utils'
import Card from '../Card'
import { abbreviateNumber } from '../../lib/utils'
import { Box } from 'theme-ui'

export default ({ transcoder }) => {
  const callsMade = transcoder.pools.filter(r => r.rewardTokens != null).length
  return (
    <Box sx={{ pt: 4 }}>
      <>
        <Box
          sx={{
            display: 'grid',
            gridGap: [2, 2, 2],
            gridTemplateColumns: [
              'repeat(auto-fit, minmax(33%, 1fr))',
              'repeat(auto-fit, minmax(33%, 1fr))',
              'repeat(auto-fit, minmax(33%, 1fr))',
              `repeat(auto-fit, minmax(30%, 1fr))`,
            ],
          }}
        >
          <Card
            sx={{ flex: 1 }}
            title="Total Stake"
            subtitle={
              <Box
                sx={{
                  fontSize: [3, 3, 4, 4, 5],
                  color: 'text',
                  fontWeight: 500,
                  lineHeight: 'heading',
                  fontFamily: 'monospace',
                }}
              >
                {abbreviateNumber(Utils.fromWei(transcoder.totalStake), 4)}
                <span sx={{ ml: 1, fontSize: 1 }}>LPT</span>
              </Box>
            }
          />
          <Card
            sx={{ flex: 1 }}
            title="Earned Fees"
            subtitle={
              <Box
                sx={{
                  fontSize: [3, 3, 4, 4, 5],
                  color: 'text',
                  fontWeight: 500,
                  lineHeight: 'heading',
                  fontFamily: 'monospace',
                }}
              >
                {transcoder.accruedFees
                  ? abbreviateNumber(Utils.fromWei(transcoder.accruedFees), 3)
                  : 0}
                <span sx={{ ml: 1, fontSize: 1 }}>ETH</span>
              </Box>
            }
          />
          <Card
            title="Reward Calls"
            subtitle={
              <Flex
                sx={{
                  alignItems: 'center',
                  fontSize: [3, 3, 4, 4, 5],
                  color: 'text',
                  fontWeight: 500,
                  lineHeight: 'heading',
                  fontFamily: 'monospace',
                }}
              >
                {callsMade}/{transcoder.pools.length}
              </Flex>
            }
          />
          <Card
            sx={{ flex: 1 }}
            title="Reward Cut"
            subtitle={
              <Box
                sx={{
                  fontSize: [3, 3, 4, 4, 5],
                  color: 'text',
                  fontWeight: 500,
                  lineHeight: 'heading',
                  fontFamily: 'monospace',
                }}
              >
                {!transcoder.rewardCut
                  ? 0
                  : parseInt(transcoder.rewardCut, 10) / 10000}
                %
              </Box>
            }
          />
          <Card
            sx={{ flex: 1 }}
            title="Fee Cut"
            subtitle={
              <Box
                sx={{
                  fontSize: [3, 3, 4, 4, 5],
                  color: 'text',
                  fontWeight: 500,
                  lineHeight: 'heading',
                  fontFamily: 'monospace',
                }}
              >
                {!transcoder.feeShare
                  ? 0
                  : 100 - parseInt(transcoder.feeShare, 10) / 10000}
                %
              </Box>
            }
          />
        </Box>
      </>
    </Box>
  )
}
