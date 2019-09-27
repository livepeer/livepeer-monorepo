/** @jsx jsx */
import { jsx } from 'theme-ui'
import Button from '../Button'
import Stake from './Stake'
import Unstake from './Unstake'
import Link from 'next/link'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Utils from 'web3-utils'

const GET_ACCOUNT = gql`
  query($account: ID!) {
    account(id: $account) {
      id
      tokenBalance
    }
    delegator(id: $account) {
      id
      allowance
      pendingStake
      bondedAmount
    }
  }
`

export default ({ transcoder, action, amount, context }) => {
  if (!context.active) {
    return (
      <Link href="/connect-wallet" passHref>
        <a>
          <Button sx={{ width: '100%' }}>Connect Wallet</Button>
        </a>
      </Link>
    )
  }

  const { data, loading, error } = useQuery(GET_ACCOUNT, {
    variables: {
      account: context.account.toLowerCase(),
    },
  })
  if (loading) {
    return null
  }
  let allowance = null
  let pendingStake = 0

  if (data.delegator) {
    allowance = Utils.fromWei(data.delegator.allowance)
    pendingStake = Math.max(
      Utils.fromWei(data.delegator.bondedAmount),
      Utils.fromWei(data.delegator.pendingStake),
    )
  }
  if (!allowance) {
    console.log('Approve Livepeer Token for Staking')
  }
  if (action == 'stake') {
    return (
      <>
        <Stake
          disabled={!allowance}
          transcoder={transcoder}
          amount={amount}
          context={context}
        />
      </>
    )
  }
  return (
    <Unstake
      disabled={!allowance}
      transcoder={transcoder}
      amount={amount}
      context={context}
    />
  )
}
