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

export function useApproveMutation(amount = null) {
  const context = useWeb3Context()
  const [result, setResult] = useState({
    approve: null,
    isBroadcasted: false,
    isMining: false,
    isMined: false,
    txHash: null,
  })

  const APPROVE = gql`
    mutation approve($type: String!, $amount: String!) {
      txHash: approve(type: $type, amount: $amount)
    }
  `

  const GET_TRANSACTION_STATUS = gql`
    query getTxReceiptStatus($txHash: String!) {
      getTxReceiptStatus: getTxReceiptStatus(txHash: $txHash) {
        status
      }
    }
  `

  const [approve, { data }] = useMutation(APPROVE, {
    variables: {
      type: 'bond',
      amount: amount ? Utils.toWei(amount, 'ether') : MAXIUMUM_VALUE_UINT256,
    },
    notifyOnNetworkStatusChange: true,
    context: {
      provider: context.library.currentProvider,
      account: context.account.toLowerCase(),
      returnTxHash: true,
    },
  })

  const { data: transaction } = useQuery(GET_TRANSACTION_STATUS, {
    variables: {
      txHash: `${data && data.txHash}`,
    },
    ssr: false,
    pollInterval: 2000,
    // skip query if tx hasn't yet been broadcasted or has been mined
    skip: !result.isBroadcasted || result.isMined,
  })

  let isMining = !!(transaction && !transaction.getTxReceiptStatus.status)
  let isMined = !!(transaction && transaction.getTxReceiptStatus.status)

  useEffect(() => {
    if (approve) {
      setResult({ ...result, approve })
    }
    if (data) {
      setResult({ ...result, isBroadcasted: true, txHash: data.txHash })
    }
    if (transaction) {
      setResult({
        ...result,
        isMining: isMining && !isMined,
        isMined: isMined,
        isBroadcasted: isMined ? false : true,
      })
    }
  }, [transaction, data, approve])

  return result
}
