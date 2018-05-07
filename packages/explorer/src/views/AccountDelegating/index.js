// @flow
import * as React from 'react'
import { Link } from 'react-router-dom'
import BN from 'bn.js'
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
  currentRound: GraphQLProps<Round>,
  delegator: GraphQLProps<Delegator>,
  match: Match,
  // TODO: 1. Add to mutation queries to schema 2. inject via enhancers
  // For now, go with tx.activate() and create confirmation modals
  onClaimEarnings: any => () => void,
  onWithdrawStake: any => () => void,
  onWithdrawFees: any => () => void,
}

const AccountDelegating: React.ComponentType<AccountDelegatingProps> = ({
  currentRound,
  delegator,
  match,
  onClaimEarnings,
  onWithdrawStake,
  onWithdrawFees,
}) => {
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
  const hasUnclaimedRounds = unclaimedRounds !== '0'
  const hasStake = bondedAmount !== '0'
  const hasFees = fees !== '0'
  const isUnbonded = status === 'Unbonded'
  const isMyAccount = !accountId && !delegator.loading
  return (
    <Wrapper>
      {/*<InlineHint flag="account-delegating">
        <h3>Lorem Ipsum</h3>
        <p>
          Lorem ipsum dolor sit amet, et arcu viverra elit. Velit sapien odio
          sollicitudin, in neque magna, orci pede, vel eleifend urna.
        </p>
  </InlineHint>*/}
      <MetricBox title="Status" value={status} />
      <MetricBox
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
      />
      <MetricBox
        title="Stake"
        suffix="LPT"
        value={formatBalance(bondedAmount)}
        subvalue={formatBalance(bondedAmount, 18)}
      >
        {isMyAccount &&
          hasStake &&
          isUnbonded && (
            <React.Fragment>
              {/** request */}
              <Button onClick={onWithdrawStake(delegator.data.id)}>
                withdraw stake
              </Button>
            </React.Fragment>
          )}
      </MetricBox>
      <MetricBox
        title="Fees"
        suffix="ETH"
        value={formatBalance(fees)}
        subvalue={formatBalance(fees, 18)}
      >
        {isMyAccount &&
          hasFees && (
            <React.Fragment>
              {/** request */}
              <Button onClick={onWithdrawFees(delegator.data.id)}>
                withdraw fees
              </Button>
            </React.Fragment>
          )}
      </MetricBox>
      <MetricBox
        title="Delegated Amount"
        suffix="LPT"
        value={formatBalance(delegatedAmount)}
        subvalue={formatBalance(delegatedAmount, 18)}
      />
      <MetricBox
        title="Unclaimed Rounds"
        value={!delegateAddress ? 'N/A' : unclaimedRounds}
        subvalue={
          !delegateAddress || !isMyAccount ? (
            ''
          ) : !hasUnclaimedRounds ? (
            `You're all caught up!`
          ) : (
            <span>
              {`You have unclaimed earnings from round #${lastClaimRound} to #${lastInitializedRound}`}
            </span>
          )
        }
      >
        {isMyAccount &&
          delegateAddress &&
          hasUnclaimedRounds && (
            <React.Fragment>
              {/** request */}
              <Button
                onClick={onClaimEarnings(delegator.data.id)}
                disabled={unclaimedRounds === '0'}
              >
                claim stake & fees
              </Button>
            </React.Fragment>
          )}
      </MetricBox>
      <MetricBox
        title="Start Round"
        value={startRound === '0' ? 'N/A' : `#${startRound}`}
      />
      <MetricBox
        title="Withdraw Round"
        value={withdrawRound === '0' ? 'N/A' : `#${withdrawRound}`}
      />
    </Wrapper>
  )
}

export default enhance(AccountDelegating)
