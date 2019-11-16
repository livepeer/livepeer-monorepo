import React, { useState, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { MAXIUMUM_VALUE_UINT256 } from '../lib/utils'
import Utils from 'web3-utils'

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
      lastClaimRound {
        id
      }
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
  const context = useWeb3Context()
  const [account, setAccount] = useState(null)
  const [delegator, setDelegator] = useState(null)

  const { data } = useQuery(GET_ACCOUNT, {
    variables: {
      account: address
        ? address.toLowerCase()
        : context.account && context.account.toLowerCase(),
    },
    skip: !context.account,
  })

  useEffect(() => {
    if (data && context.active) {
      setAccount(data.account ? data.account : null)
      setDelegator(data.delegator ? data.delegator : null)
    } else {
      setAccount(null)
      setDelegator(null)
    }
  }, [data, context.active])

  return { account, delegator }
}

export function useWeb3Mutation(mutation, options) {
  const [result, setResult] = useState({
    mutate: null,
    isBroadcasted: false,
    isMining: false,
    isMined: false,
    txHash: null,
  })

  const [mutate, { data }] = useMutation(mutation, options)

  const GET_TRANSACTION_STATUS = gql`
    query getTxReceiptStatus($txHash: String!) {
      getTxReceiptStatus: getTxReceiptStatus(txHash: $txHash) {
        status
      }
    }
  `

  const { data: transaction } = useQuery(GET_TRANSACTION_STATUS, {
    variables: {
      txHash: `${data && data.txHash}`,
    },
    pollInterval: 2000,
    // skip query if tx hasn't yet been broadcasted or has been mined
    skip: !result.isBroadcasted || result.isMined,
  })

  let isMining = !!(transaction && !transaction.getTxReceiptStatus.status)
  let isMined = !!(transaction && transaction.getTxReceiptStatus.status)

  useEffect(() => {
    if (mutate) {
      setResult({ ...result, mutate })
    }
    if (data) {
      setResult({ ...result, isBroadcasted: true, txHash: data.txHash })
    }
    if (transaction) {
      setResult({
        ...result,
        isMining: isMining && !isMined,
        isMined: isMined,
        isBroadcasted: true,
      })
    }
  }, [transaction, data, mutate])

  return result
}
