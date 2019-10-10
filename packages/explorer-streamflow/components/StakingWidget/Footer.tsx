/** @jsx jsx */
import { jsx } from 'theme-ui'
import Button from '../Button'
import Stake from './Stake'
import Unstake from './Unstake'
import Link from 'next/link'
import { Account, Delegator, Transcoder, Round } from '../../@types'
import Utils from 'web3-utils'
import { getDelegatorStatus } from '../../lib/utils'
import { useWeb3Context } from 'web3-react'

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
  const approved = account && parseFloat(Utils.fromWei(account.allowance)) > 0
  const delegatorStatus = getDelegatorStatus(delegator, currentRound)
  const isStaked =
    delegatorStatus == 'Bonded' || delegatorStatus == 'Unbonding' ? true : false
  const canStake = hasTokenBalance && approved && amount > 0
  const canUnstake = isStaked
  const insufficientBalance = account && amount > tokenBalance

  if (action == 'stake') {
    return (
      <>
        <Stake disabled={!canStake} transcoder={transcoder} amount={amount} />
        {!hasTokenBalance && (
          <div
            sx={{
              px: 2,
              pt: 2,
              color: 'muted',
              textAlign: 'center',
              fontSize: 0,
            }}
          >
            You have 0 LPT in your wallet.
          </div>
        )}
        {insufficientBalance && (
          <div
            sx={{
              px: 2,
              pt: 2,
              color: 'muted',
              textAlign: 'center',
              fontSize: 0,
            }}
          >
            Insufficient Balance
          </div>
        )}
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
