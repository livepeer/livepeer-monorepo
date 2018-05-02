// @flow
import * as React from 'react'
import { formatBalance, formatPercentage } from '../../utils'
import { Button, InlineHint, MetricBox, Wrapper } from '../../components'
import enhance from './enhance'

type AccountTranscodingViewProps = {
  transcoder: GraphQLProps<Transcoder>,
  match: Match,
}

const AccountTranscodingView: React.ComponentType<
  AccountTranscodingViewProps,
> = ({ transcoder, match }) => {
  const {
    active,
    status,
    lastRewardRound,
    rewardCut,
    feeShare,
    pricePerSegment,
    pendingRewardCut,
    pendingFeeShare,
    pendingPricePerSegment,
  } = transcoder.data
  const { accountId } = match.params
  return (
    <Wrapper>
      {/*<InlineHint flag="account-transcoding">
        <h3>Lorem Ipsum</h3>
        <p>
          Lorem ipsum dolor sit amet, et arcu viverra elit. Velit sapien odio
          sollicitudin, in neque magna, orci pede, vel eleifend urna.
        </p>
  </InlineHint>*/}
      <MetricBox title="Status" value={status} />
      <MetricBox title="Active" value={active ? 'True' : 'False'} />
      <MetricBox
        title="Block Reward Cut"
        suffix="%"
        value={formatPercentage(rewardCut)}
      />
      <MetricBox
        title="Pending Block Reward Cut"
        suffix="%"
        value={formatPercentage(pendingRewardCut)}
      />
      <MetricBox
        title="Fee Share"
        suffix="%"
        value={formatPercentage(feeShare)}
      />
      <MetricBox
        title="Pending Fee Share"
        suffix="%"
        value={formatPercentage(pendingFeeShare)}
      />
      <MetricBox
        title="Price Per Segment"
        suffix="WEI"
        value={pricePerSegment}
        subvalue={`${formatBalance(pricePerSegment, 18)} ETH`}
      />
      <MetricBox
        title="Pending Price Per Segment"
        suffix="WEI"
        value={pendingPricePerSegment}
        subvalue={`${formatBalance(pendingPricePerSegment, 18)} ETH`}
      />
      <MetricBox title="Last Reward Round" value={lastRewardRound} />
    </Wrapper>
  )
}

export default enhance(AccountTranscodingView)
