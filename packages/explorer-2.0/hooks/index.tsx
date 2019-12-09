import React, { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

export function useAccount(address = null) {
  const GET_ACCOUNT = gql`
    query($account: ID!) {
      account(id: $account) {
        id
        tokenBalance
        ethBalance
        allowance
      }
      threeBoxSpace(id: $account) {
        __typename
        id
        did
        name
        url
        description
        image
        addressLinks
        defaultProfile
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
  const [account, setAccount] = useState(null)
  const [delegator, setDelegator] = useState(null)
  const [threeBoxSpace, setThreeBoxSpace] = useState(null)

  const { data } = useQuery(GET_ACCOUNT, {
    variables: {
      account: address && address.toLowerCase(),
    },
    skip: !address,
  })

  useEffect(() => {
    if (data) {
      setAccount(data.account ? data.account : null)
      setDelegator(data.delegator ? data.delegator : null)
      setThreeBoxSpace(data.threeBoxSpace ? data.threeBoxSpace : null)
    } else {
      setAccount(null)
      setDelegator(null)
      setThreeBoxSpace(null)
    }
  }, [data])

  return { account, delegator, threeBoxSpace }
}

export function useWeb3Mutation(mutation, options) {
  const initialState = {
    mutate: null,
    isBroadcasted: false,
    isMining: false,
    isMined: false,
    txHash: null,
    error: null,
  }
  const [result, setResult] = useState(initialState)

  const reset = useCallback(() => {
    setResult(initialState)
  }, [initialState])

  const [mutate, { data, error: mutationError }] = useMutation(
    mutation,
    options,
  )

  const GET_TRANSACTION_STATUS = gql`
    query getTxReceiptStatus($txHash: String!) {
      getTxReceiptStatus: getTxReceiptStatus(txHash: $txHash) {
        status
      }
    }
  `

  const { data: transaction, error: queryError } = useQuery(
    GET_TRANSACTION_STATUS,
    {
      variables: {
        txHash: `${data && data.txHash}`,
      },
      pollInterval: 2000,
      // skip query if tx hasn't yet been broadcasted or has been mined
      skip: !result.isBroadcasted || result.isMined,
    },
  )

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
      })
    }
    if (mutationError) {
      setResult({
        ...result,
        error: mutationError,
      })
    }
    if (queryError) {
      setResult({
        ...result,
        error: queryError,
      })
    }
  }, [transaction, data, mutate])

  return { result, reset }
}
