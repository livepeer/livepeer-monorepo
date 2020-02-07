import { useState, useEffect, useCallback, useRef } from 'react'
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
    }
  `
  const [account, setAccount] = useState(null)

  const { data, refetch } = useQuery(GET_ACCOUNT, {
    variables: {
      account: address && address.toLowerCase(),
    },
    skip: !address,
    pollInterval: 10000,
  })

  useEffect(() => {
    if (data) {
      setAccount(data.account ? data.account : null)
    } else {
      setAccount(null)
    }
  }, [data])

  return { account, refetch, query: GET_ACCOUNT }
}

export function useThreeBoxSpace(address = null) {
  const GET_THREE_BOX = gql`
    query($account: ID!) {
      threeBoxSpace(id: $account) {
        __typename
        id
        did
        name
        website
        description
        image
        addressLinks
        defaultProfile
      }
    }
  `
  const [threeBoxSpace, setThreeBoxSpace] = useState(null)

  const { data, refetch } = useQuery(GET_THREE_BOX, {
    variables: {
      account: address && address.toLowerCase(),
    },
    skip: !address,
    pollInterval: 10000,
  })

  useEffect(() => {
    if (data) {
      setThreeBoxSpace(data.threeBoxSpace ? data.threeBoxSpace : null)
    } else {
      setThreeBoxSpace(null)
    }
  }, [data])

  return { threeBoxSpace, refetch, query: GET_THREE_BOX }
}

export function useDelegator(address = null) {
  const GET_DELEGATOR = gql`
    query($account: ID!) {
      delegator(id: $account) {
        id
        pendingStake
        bondedAmount
        principal
        unbonded
        pendingFees
        accruedFees
        startRound
        lastClaimRound {
          id
        }
        unbondingLocks {
          id
          amount
          unbondingLockId
          withdrawRound
          delegate {
            id
          }
        }
        delegate {
          id
          rewardCut
          totalStake
          threeBoxSpace {
            __typename
            name
            website
            image
            description
          }
        }
      }
    }
  `

  const [delegator, setDelegator] = useState(null)

  const { data, refetch } = useQuery(GET_DELEGATOR, {
    variables: {
      account: address && address.toLowerCase(),
    },
    skip: !address,
    pollInterval: 10000,
  })

  useEffect(() => {
    if (data) {
      setDelegator(data.delegator ? data.delegator : null)
    } else {
      setDelegator(null)
    }
  }, [data])

  return { delegator, refetch, query: GET_DELEGATOR }
}

export function useTranscoder(address = null) {
  const GET_TRANSCODER = gql`
    query($account: ID!) {
      transcoder(id: $account) {
        id
        active
        feeShare
        rewardCut
        status
        active
        totalStake
        accruedFees
        pools(first: 30, orderBy: id, orderDirection: desc) {
          rewardTokens
        }
        threeBoxSpace {
          __typename
          name
          website
          image
          description
        }
      }
    }
  `

  const [transcoder, setTranscoder] = useState(null)
  const [loading, setLoading] = useState(true)

  const { data, loading: dataLoading, refetch } = useQuery(GET_TRANSCODER, {
    variables: {
      account: address && address.toLowerCase(),
    },
    skip: !address,
    pollInterval: 10000,
    ssr: true,
  })

  useEffect(() => {
    setLoading(dataLoading)
    if (data) {
      setTranscoder(data.transcoder ? data.transcoder : null)
    } else {
      setTranscoder(null)
    }
  }, [data, dataLoading])

  return { transcoder, loading, refetch, query: GET_TRANSCODER }
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

// modified from https://usehooks.com/usePrevious/
export function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef()

  // Store current value in ref
  useEffect(() => {
    ref.current = value
  }, [value]) // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current
}
