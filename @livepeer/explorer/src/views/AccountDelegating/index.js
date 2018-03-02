// @flow
import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  formatBalance,
  openSocket,
  pathInfo,
  promptForArgs,
  toBaseUnit,
} from '../../utils'
import { Button, MetricBox, Wrapper } from '../../components'
import enhance from './enhance'

type AccountDelegatingProps = {
  delegator: GraphQLProps<Delegator>,
  match: Match,
}

const AccountDelegating: React.ComponentType<AccountDelegatingProps> = ({
  delegator,
  match,
}) => {
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
  const { accountId } = match.params
  return (
    <Wrapper>
      <MetricBox title="Status" value={status} />
      <MetricBox
        title="Delegate Address"
        value={
          !delegateAddress ? (
            'N/A'
          ) : (
            <Link to={`/accounts/${delegateAddress}`}>View Account</Link>
          )
        }
        subvalue={delegateAddress}
      />
      <MetricBox
        title="Bonded Amount"
        suffix="LPT"
        value={formatBalance(bondedAmount)}
        subvalue={formatBalance(bondedAmount, 18)}
      />
      <MetricBox
        title="Fees"
        suffix="LPT"
        value={formatBalance(fees)}
        subvalue={formatBalance(fees, 18)}
      />
      <MetricBox
        title="Delegated Amount"
        suffix="LPT"
        value={formatBalance(delegatedAmount)}
        subvalue={formatBalance(delegatedAmount, 18)}
      />
      <MetricBox title="Last Claim Round" value={lastClaimRound} />
      <MetricBox title="Start Round" value={startRound} />
      <MetricBox title="Withdraw Round" value={withdrawRound} />
    </Wrapper>
  )
}

export default enhance(AccountDelegating)
