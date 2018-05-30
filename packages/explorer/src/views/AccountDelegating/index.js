// @flow
import * as React from 'react'
import { Link } from 'react-router-dom'
import BN from 'bn.js'
import { Minus as MinusIcon, Plus as PlusIcon } from 'react-feather'
import {
  formatBalance,
  MathBN,
  openSocket,
  pathInfo,
  promptForArgs,
  toBaseUnit,
} from '../../utils'
import {
  Button,
  InlineAccount,
  InlineHint,
  MetricBox,
  Wrapper,
} from '../../components'
import enhance from './enhance'

export type AccountDelegatingProps = {
  coinbase: GraphQLProps<Coinbase>,
  currentRound: GraphQLProps<Round>,
  delegator: GraphQLProps<Delegator>,
  history: History,
  match: Match,
  claimEarnings: () => void,
  withdrawStake: () => void,
  withdrawFees: () => void,
}

const AccountDelegating: React.ComponentType<AccountDelegatingProps> = ({
  currentRound,
  coinbase,
  delegator,
  history,
  match,
  claimEarnings,
  withdrawStake,
  withdrawFees,
}) => {
  const isMe = match.params.accountId === coinbase.data.coinbase
  const { accountId } = match.params
  const {
    status,
    delegateAddress,
    bondedAmount,
    fees,
    delegatedAmount,
    lastClaimRound,
    startRound,
    withdrawRound,
  } = delegator.data
  const { lastInitializedRound } = currentRound.data
  // const from = MathBN.add(lastClaimRound, '1')
  const unclaimedRounds =
    !delegator.loading && !currentRound.loading
      ? MathBN.sub(lastInitializedRound, lastClaimRound)
      : '0'
  const roundsUntilUnbonded =
    withdrawRound !== '0' ? MathBN.sub(withdrawRound, lastInitializedRound) : ''
  const hasUnclaimedRounds = unclaimedRounds !== '0'
  const hasStake = bondedAmount !== '0'
  const hasFees = fees !== '0'
  const isUnbonding = status === 'Unbonding'
  const isUnbonded = status === 'Unbonded'
  const isBonding = status === 'Pending'
  const isBonded = status === 'Bonded'
  return (
    <Wrapper>
      {/*<InlineHint flag="account-delegating">
        <h3>Lorem Ipsum</h3>
        <p>
          Lorem ipsum dolor sit amet, et arcu viverra elit. Velit sapien odio
          sollicitudin, in neque magna, orci pede, vel eleifend urna.
        </p>
  </InlineHint>*/}
      <MetricBox
        help="A delegator can be in one of the following states: Pending, Bonded, Unbonding or Unbonded"
        title="Status"
        value={status}
        subvalue={
          isBonded
            ? `Bonded to delegate at round #${startRound}`
            : isBonding
              ? `Bonding will complete at round #${startRound}`
              : isUnbonding
                ? `${roundsUntilUnbonded} round(s) left in the unbonding period`
                : ''
        }
      />
      <MetricBox
        help="The ETH account the delegator has bonded token to"
        title="Delegate"
        value={
          !delegateAddress ? (
            'N/A'
          ) : (
            <Link
              onClick={e => {
                if (delegateAddress === accountId) e.preventDefault()
              }}
              to={`/accounts/${delegateAddress}`}
              style={{ textDecoration: 'none' }}
            >
              <InlineAccount address={delegateAddress} border truncate={8} />
            </Link>
          )
        }
        subvalue={
          !delegateAddress ? 'Not currently bonded to any delegate' : ''
        }
      />
      <MetricBox
        help="Total tokens earned from reward cuts each round"
        title="Stake"
        suffix="LPT"
        value={formatBalance(bondedAmount)}
        subvalue={
          withdrawRound === '0'
            ? ''
            : `Token may be withdrawn at round #${withdrawRound}`
        }
      >
        {isMe && (
          <React.Fragment>
            {/** request */}
            <Button disabled={!hasStake} onClick={withdrawStake}>
              <MinusIcon size={12} />
              <span style={{ marginLeft: 8 }}>withdraw stake</span>
            </Button>
          </React.Fragment>
        )}
      </MetricBox>
      <MetricBox
        help="Total ETH earned from fee shares each round"
        title="Fees"
        suffix="ETH"
        value={formatBalance(fees)}
        subvalue={`${formatBalance(fees, 18, 'wei')} WEI`}
      >
        {isMe && (
          <React.Fragment>
            {/** request */}
            <Button disabled={!hasFees} onClick={withdrawFees}>
              <MinusIcon size={12} />
              <span style={{ marginLeft: 8 }}>withdraw fees</span>
            </Button>
          </React.Fragment>
        )}
      </MetricBox>
      <MetricBox
        help="Total tokens bonded to this account"
        title="Delegated Amount"
        suffix="LPT"
        value={formatBalance(delegatedAmount)}
      />
      <MetricBox
        help="Rounds with stake and fees available to be claimed"
        title="Unclaimed Rounds"
        value={!delegateAddress ? 'N/A' : unclaimedRounds}
        subvalue={
          !delegateAddress ? (
            'No round-based earnings are gained when unbonded'
          ) : !hasUnclaimedRounds ? (
            `All caught up!`
          ) : (
            <span>
              {`Earnings available from rounds #${MathBN.add(
                lastClaimRound,
                '1',
              )} - #${lastInitializedRound}`}
            </span>
          )
        }
      >
        {isMe &&
          delegateAddress &&
          hasUnclaimedRounds && (
            <React.Fragment>
              {/** request */}
              <Button
                onClick={claimEarnings}
                disabled={unclaimedRounds === '0'}
              >
                claim stake & fees
              </Button>
            </React.Fragment>
          )}
      </MetricBox>
    </Wrapper>
  )
}

export default enhance(AccountDelegating)
