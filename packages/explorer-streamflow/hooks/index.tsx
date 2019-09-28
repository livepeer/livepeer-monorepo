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
    }
  }
`

export function useAccount(): Account {
  let context = useWeb3Context()

  const [account, setAccount] = useState(null)

  const { data } = useQuery(GET_ACCOUNT, {
    variables: {
      account: context.active ? context.account : '',
    },
    ssr: false,
    skip: !context.active,
  })

  useEffect(() => {
    setAccount(data ? data.account : null)
  }, [data])

  return account
}
