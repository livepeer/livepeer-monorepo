// @flow
import * as React from 'react'
import { Icon } from 'rmwc/Icon'
import { formatBalance, formatPercentage, MathBN } from '../../utils'
import {
  Button,
  EmptyMessage,
  InlineHint,
  MetricBox,
  Tooltip,
  Wrapper,
} from '../../components'
import enhance from './enhance'

type AccountTranscodingViewProps = {
  currentRound: GraphQLProps<Round>,
  transcoder: GraphQLProps<Transcoder>,
  coinbase: GraphQLProps<Coinbase>,
  match: Match,
}

const AccountTranscodingView: React.ComponentType<
  AccountTranscodingViewProps,
> = ({ coinbase, currentRound, transcoder, match }) => {
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
  const currentRoundNum = currentRound.data.id
  const notRegistered = status !== 'Registered'
  return (
    <Wrapper>
      {notRegistered ? (
        <React.Fragment>
          {
            <EmptyMessage>
              <h2>Not registered as a transcoder</h2>
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
            </EmptyMessage>
          }
        </React.Fragment>
      ) : (
        <React.Fragment>
          <MetricBox
            help="A transcoder can be in one of the following states: NotRegistered or Registered"
            title="Status"
            value={status}
          />
          <MetricBox
            help="Transcoders with the most delegated stake become active and process transcode jobs for the network. Active transcoders may also claim inflationary rewards and fees each round"
            title="Active"
            value={active ? 'True' : 'False'}
          />
          <MetricBox
            help="The percentage of inflationary rewards that a transcoder keeps each round"
            title="Reward Cut"
            value={
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: 24,
                }}
              >
                {`${formatPercentage(rewardCut)}`}%{' '}
                {rewardCut !== pendingRewardCut && (
                  <Tooltip text="This value will change next round">
                    <Icon
                      use="hourglass_empty"
                      style={{ opacity: 0.75, cursor: 'help', color: 'orange' }}
                    />
                  </Tooltip>
                )}
              </span>
            }
            subvalue={
              rewardCut !== pendingRewardCut ? (
                <span>
                  A reward cut of{' '}
                  <strong>{`${formatPercentage(pendingRewardCut)}%`}</strong>{' '}
                  will kick in next round
                </span>
              ) : (
                ''
              )
            }
          />
          <MetricBox
            help="The percentage of transcode job fees that a transcoder shares with its delegators"
            title="Fee Share"
            value={
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: 24,
                }}
              >
                {`${formatPercentage(feeShare)}`}%{' '}
                {feeShare !== pendingFeeShare && (
                  <Tooltip text="This value will change next round">
                    <Icon
                      use="hourglass_empty"
                      style={{ opacity: 0.75, cursor: 'help', color: 'orange' }}
                    />
                  </Tooltip>
                )}
              </span>
            }
            subvalue={
              feeShare !== pendingFeeShare ? (
                <span>
                  A fee share of{' '}
                  <strong>{`${formatPercentage(pendingFeeShare)}%`}</strong>{' '}
                  will kick in next round
                </span>
              ) : (
                ''
              )
            }
          />
          <MetricBox
            help="The price a transcoder charges a broadcaster to transcode each segment of video"
            title="Price Per Segment"
            value={
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: 24,
                }}
              >
                {`${formatBalance(pricePerSegment, 18, 'gwei')} GWEI`}{' '}
                {pricePerSegment !== pendingPricePerSegment && (
                  <Tooltip text="This value will change next round">
                    <Icon
                      use="hourglass_empty"
                      style={{ opacity: 0.75, cursor: 'help', color: 'orange' }}
                    />
                  </Tooltip>
                )}
              </span>
            }
            subvalue={
              pricePerSegment !== pendingPricePerSegment ? (
                <span>
                  A price per segment of{' '}
                  <strong>{`${formatBalance(
                    pendingPricePerSegment,
                    18,
                    'gwei',
                  )} GWEI`}</strong>{' '}
                  will kick in next round
                </span>
              ) : (
                ''
              )
            }
          />
          <MetricBox
            help="The last round that the transcoder received rewards as an active transcoder"
            title="Last Reward Round"
            value={
              !active ? (
                'N/A'
              ) : currentRoundNum === lastRewardRound ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: 24,
                  }}
                >
                  {lastRewardRound}
                  <Icon use="check" style={{ color: 'var(--primary)' }} />
                </span>
              ) : (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: 24,
                  }}
                >
                  {lastRewardRound}
                  <Icon use="close" style={{ color: 'var(--error)' }} />
                </span>
              )
            }
            subvalue={
              !active
                ? 'No rewards to claim while inactive'
                : currentRoundNum === lastRewardRound
                  ? 'Transcoder claimed rewards this round'
                  : 'Transcoder has not claimed rewards this round'
            }
          />
        </React.Fragment>
      )}
    </Wrapper>
  )
}

export default enhance(AccountTranscodingView)
