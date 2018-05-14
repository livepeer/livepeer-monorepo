// @flow
import * as React from 'react'
import { formatBalance, formatPercentage } from '../../utils'
import { Button, InlineHint, MetricBox, Wrapper } from '../../components'
import enhance from './enhance'

type AccountTranscodingViewProps = {
  transcoder: GraphQLProps<Transcoder>,
  coinbase: GraphQLProps<Coinbase>,
  match: Match,
}

const AccountTranscodingView: React.ComponentType<
  AccountTranscodingViewProps,
> = ({ coinbase, transcoder, match }) => {
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
  const isMe = match.params.accountId === coinbase.data.coinbase
  const { accountId } = match.params
  const notRegistered = status !== 'Registered'
  return (
    <Wrapper>
      {notRegistered ? (
        <React.Fragment>
          {isMe ? (
            <InlineHint flag="account-transcoding" disableHide>
              <h3>You are not registered as a transcoder</h3>
              <p>
                In The Livepeer network, nodes who play the role of transcoder,
                perform this very important function, and as a result it's
                important that they have high bandwidth connections, sufficient
                hardware, and reliable devOps practices. These nodes are
                delegated towards and elected to perform this role, and they are
                rewarded with the ability to earn fees from the network.
                <br />
                <br />
                <Button
                  style={{ margin: 0 }}
                  onClick={() =>
                    window.open(
                      'http://livepeer.readthedocs.io/en/latest/transcoding.html',
                    )
                  }
                >
                  Learn More About Transcoding
                </Button>
              </p>
            </InlineHint>
          ) : (
            <InlineHint flag="account-transcoding" disableHide>
              <h3>This Account is not registered as a transcoder</h3>
              <p>
                In The Livepeer network, nodes who play the role of transcoder,
                perform this very important function, and as a result it's
                important that they have high bandwidth connections, sufficient
                hardware, and reliable devOps practices. These nodes are
                delegated towards and elected to perform this role, and they are
                rewarded with the ability to earn fees from the network.
                <br />
                <br />
                <Button
                  style={{ margin: 0 }}
                  onClick={() =>
                    window.open(
                      'http://livepeer.readthedocs.io/en/latest/transcoding.html',
                    )
                  }
                >
                  Learn More About Transcoding
                </Button>
              </p>
            </InlineHint>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
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
        </React.Fragment>
      )}
    </Wrapper>
  )
}

export default enhance(AccountTranscodingView)
