/** @jsx jsx */
import { jsx } from 'theme-ui'
import Button from '../Button'
import Stake from './Stake'
import Unstake from './Unstake'
import Link from 'next/link'
import { Account, Delegator, Transcoder, Round } from '../../@types'
import Utils from 'web3-utils'
import { getDelegatorStatus, MAX_EARNINGS_CLAIMS_ROUNDS } from '../../lib/utils'
import { useWeb3Context } from 'web3-react'
import Warning from './Warning'
import Approve from '../Approve'

interface Props {
  action: string
  amount: number
  transcoder: Transcoder
  delegator?: Delegator
  currentRound: Round
  account: Account
}

export default ({
  delegator,
  transcoder,
  action,
  amount,
  account,
  currentRound,
}: Props) => {
  const context = useWeb3Context()
  if (!context.account) {
    return (
      <Link href="/connect-wallet" passHref>
        <a>
          <Button sx={{ width: '100%' }}>Connect Wallet</Button>
        </a>
      </Link>
    )
  }

  const tokenBalance =
    account && parseFloat(Utils.fromWei(account.tokenBalance))
  const hasTokenBalance = account && tokenBalance > 0
  const tokenAllowance = account && parseFloat(Utils.fromWei(account.allowance))
  const approved = account && parseFloat(Utils.fromWei(account.allowance)) > 0
  const delegatorStatus = getDelegatorStatus(delegator, currentRound)
  const isStaked =
    delegatorStatus == 'Bonded' || delegatorStatus == 'Unbonding' ? true : false
  const sufficientBalance = account && amount && amount <= tokenBalance
  const sufficientTransferAllowance =
    account && amount && amount <= tokenAllowance
  const stake =
    delegator &&
    Math.max(
      delegator.bondedAmount ? Utils.fromWei(delegator.bondedAmount) : 0,
      delegator.pendingStake ? Utils.fromWei(delegator.pendingStake) : 0,
    )

  const sufficientStake = delegator && amount && amount <= stake

  const roundsSinceLastClaim =
    currentRound &&
    delegator &&
    delegator.lastClaimRound &&
    parseInt(currentRound.id, 10) - parseInt(delegator.lastClaimRound.id, 10)

  const canStake =
    hasTokenBalance &&
    sufficientBalance &&
    roundsSinceLastClaim <= MAX_EARNINGS_CLAIMS_ROUNDS &&
    approved &&
    sufficientTransferAllowance &&
    amount > 0

  const canUnstake =
    isStaked && roundsSinceLastClaim <= MAX_EARNINGS_CLAIMS_ROUNDS && amount > 0

  if (action == 'stake') {
    return (
      <>
        <Stake disabled={!canStake} transcoder={transcoder} amount={amount} />
        {renderStakeWarnings(
          roundsSinceLastClaim,
          amount,
          hasTokenBalance,
          sufficientBalance,
          sufficientTransferAllowance,
          context,
          account,
        )}
      </>
    )
  }
  return (
    <>
      <Unstake disabled={!canUnstake} transcoder={transcoder} amount={amount} />
      {renderUnstakeWarnings(
        roundsSinceLastClaim,
        amount,
        delegatorStatus,
        isStaked,
        sufficientStake,
      )}
    </>
  )
}

function renderStakeWarnings(
  roundsSinceLastClaim,
  amount,
  hasTokenBalance,
  sufficientBalance,
  sufficientTransferAllowance,
  context,
  account,
) {
  if (roundsSinceLastClaim > MAX_EARNINGS_CLAIMS_ROUNDS && amount > 0) {
    return (
      <Warning>
        You must claim your earnings before you can continue staking.
      </Warning>
    )
  }
  if (!hasTokenBalance) {
    return <Warning>You have 0 LPT in your wallet.</Warning>
  }

  if (amount && !sufficientBalance) {
    return <Warning>Insufficient Balance</Warning>
  }

  if (amount && !sufficientTransferAllowance) {
    return (
      <Warning>
        Your transfer allowance is set too low.{' '}
        <Approve account={account} context={context} banner={false} />
      </Warning>
    )
  }
}

function renderUnstakeWarnings(
  roundsSinceLastClaim,
  amount,
  delegatorStatus,
  isStaked,
  sufficientStake,
) {
  if (roundsSinceLastClaim > MAX_EARNINGS_CLAIMS_ROUNDS && amount > 0) {
    return (
      <Warning>
        You must claim your earnings before you can continue staking.
      </Warning>
    )
  }
  if (delegatorStatus == 'Pending') {
    return (
      <Warning>
        Your account is in a pending state. You can unstake during the next
        round.
      </Warning>
    )
  }
  if (!isStaked) {
    return <Warning>One must stake before one can unstake.</Warning>
  }
  if (amount && !sufficientStake) {
    return <Warning>Insufficient stake</Warning>
  }
}
