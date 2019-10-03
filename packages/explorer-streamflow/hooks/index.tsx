import { useState, useMemo, useCallback, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Account } from '../@types'

const GET_ACCOUNT = gql`
  query($account: ID!) {
    account(id: $account) {
      id
      tokenBalance
      ethBalance
      allowance
    }
    delegator(id: $account) {
      id
      pendingStake
      startRound
      bondedAmount
      unbondingLocks {
        withdrawRound
      }
      delegate {
        id
        rewardCut
      }
    }
  }
`

export function useAccount(address = null) {
  let context = useWeb3Context()

  const [account, setAccount] = useState()
  const [delegator, setDelegator] = useState()

  const { data } = useQuery(GET_ACCOUNT, {
    variables: {
      account: address
        ? address.toLowerCase()
        : context.account && context.account.toLowerCase(),
    },
    pollInterval: 10000,
    ssr: false,
  })

  useEffect(() => {
    if (data && data.account) {
      setAccount(data.account)
    }
    if (data && data.delegator) {
      setDelegator(data.delegator)
    }
  }, [data])

  return { account, delegator }
}
