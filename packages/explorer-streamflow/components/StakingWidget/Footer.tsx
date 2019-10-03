/** @jsx jsx */
import { jsx } from 'theme-ui'
import Button from '../Button'
import Stake from './Stake'
import Unstake from './Unstake'
import Link from 'next/link'
import { Account, Delegator, Transcoder, Round } from '../../@types'
import Utils from 'web3-utils'
import { getDelegatorStatus } from '../../lib/utils'

interface Props {
  action: string
  amount: string
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
  if (!account) {
    return (
      <Link href="/connect-wallet" passHref>
        <a>
          <Button sx={{ width: '100%' }}>Connect Wallet</Button>
        </a>
      </Link>
    )
  }

  const bondedAmount = delegator ? delegator.bondedAmount : 0
  const hasTokenBalance =
    account && parseInt(Utils.fromWei(account.tokenBalance)) == 0
  const delegatorStatus = getDelegatorStatus(delegator, currentRound)
  const isStaked =
    delegatorStatus == 'Bonded' || delegatorStatus == 'Unbonding' ? true : false
  const canStake = hasTokenBalance
  const canUnstake = isStaked

  if (action == 'stake') {
    return (
      <>
        <Stake disabled={!canStake} transcoder={transcoder} amount={amount} />
        <div
          sx={{
            px: 2,
            pt: 2,
            color: 'muted',
            textAlign: 'center',
            fontSize: 0,
          }}
        >
          {!hasTokenBalance && `You have 0 LPT in your wallet.`}
        </div>
      </>
    )
  }
  return (
    <>
      <Unstake disabled={!canUnstake} transcoder={transcoder} amount={amount} />
      {!canUnstake && (
        <div
          sx={{
            px: 2,
            pt: 2,
            color: 'muted',
            textAlign: 'center',
            fontSize: 0,
          }}
        >
          {delegatorStatus == 'Pending'
            ? `Your account is in a pending state. You can unstake during the next round.`
            : 'One must stake before one can unstake.'}
        </div>
      )}
    </>
  )
}
