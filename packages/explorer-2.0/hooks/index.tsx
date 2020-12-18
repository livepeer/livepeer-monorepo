import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useApolloClient } from '@apollo/client'
import gql from 'graphql-tag'
import { useWeb3React } from '@web3-react/core'
import { Injected } from '../lib/connectors'
import { isMobile } from 'react-device-detect'
import submittedTxsQuery from '../queries/transactions.gql'

export function useWeb3Mutation(mutation, options) {
  const client: any = useApolloClient()
  const context = useWeb3React()
  const [mutate, { data, loading: dataLoading }] = useMutation(mutation, {
    ...options,
  })
  const GET_TRANSACTION_STATUS = gql`
    query getTxReceiptStatus($txHash: String) {
      getTxReceiptStatus(txHash: $txHash) {
        status
      }
    }
  `

  let {
    data: transactionStatusData,
    loading: transactionStatusLoading,
  } = useQuery(GET_TRANSACTION_STATUS, {
    ...options,
    variables: {
      txHash: data?.tx?.txHash,
    },
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    context: options?.context,
  })

  const GET_TRANSACTION = gql`
    query transaction($txHash: String) {
      transaction(txHash: $txHash)
    }
  `

  let { data: transactionData, loading: transactionLoading } = useQuery(
    GET_TRANSACTION,
    {
      ...options,
      variables: {
        txHash: data?.tx?.txHash,
      },
      skip: !data?.tx?.txHash,
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    },
  )

  const GET_TX_PREDICTION = gql`
    query txPrediction($gasPrice: String) {
      txPrediction(gasPrice: $gasPrice)
    }
  `

  let { data: txPredictionData, loading: txPredictionLoading } = useQuery(
    GET_TX_PREDICTION,
    {
      ...options,
      variables: {
        gasPrice: transactionData?.transaction?.gasPrice?.toString(),
      },
      skip: !transactionData?.transaction?.gasPrice?.toString(),
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    },
  )

  const { data: transactionsData } = useQuery(submittedTxsQuery)

  useEffect(() => {
    if (data) {
      client.writeQuery({
        query: gql`
          query {
            txs
          }
        `,
        data: {
          txs: [
            ...transactionsData.txs.filter((t) => t.txHash !== data.tx.txHash),
            {
              __typename: mutation.definitions[0].name.value,
              txHash: data.tx.txHash,
              startTime: new Date().getTime(),
              from: context.account,
              inputData: JSON.stringify(data.tx.inputData),
              confirmed: !!transactionStatusData?.getTxReceiptStatus?.status,
              estimate: txPredictionData?.txPrediction?.result
                ? txPredictionData?.txPrediction?.result
                : null,
              gas: data.tx.gas,
              gasPrice: transactionData?.transaction?.gasPrice?.toString()
                ? transactionData?.transaction?.gasPrice?.toString()
                : null,
            },
          ],
        },
      })
    }
  }, [
    dataLoading,
    transactionLoading,
    txPredictionLoading,
    transactionStatusLoading,
  ])
  return {
    mutate,
  }
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

export function useEagerConnect() {
  const { activate, active } = useWeb3React()
  const [tried, setTried] = useState(false)

  useEffect(() => {
    Injected.isAuthorized().then((isAuthorized: boolean) => {
      if (isAuthorized) {
        activate(Injected, undefined, true).catch(() => {
          setTried(true)
        })
      } else {
        if (isMobile && window['ethereum']) {
          activate(Injected, undefined, true).catch(() => {
            setTried(true)
          })
        } else {
          setTried(true)
        }
      }
    })
  }, []) // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true)
    }
  }, [tried, active])

  return tried
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React()

  useEffect(() => {
    const ethereum = window['ethereum']

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(Injected, undefined, true).catch(() => {})
      }

      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          // eat errors
          activate(Injected, undefined, true).catch(() => {})
        }
      }

      const handleNetworkChanged = () => {
        // eat errors
        activate(Injected, undefined, true).catch(() => {})
      }

      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('networkChanged', handleNetworkChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged)
          ethereum.removeListener('networkChanged', handleNetworkChanged)
          ethereum.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }

    return () => {}
  }, [active, error, suppress, activate])
}

export function useMutations() {
  const mutations = require('../mutations').default
  const context = useWeb3React()
  let mutationsObj: any = {}
  Object.keys(mutations).map((key) => {
    const { mutate } = useWeb3Mutation(mutations[key], {
      context: {
        library: context?.library,
        account: context?.account?.toLowerCase(),
        returnTxHash: true,
      },
    })
    mutationsObj[key] = mutate
  })
  return mutationsObj
}

export function useTimeEstimate({ startTime, estimate }) {
  const [timeLeft, setTimeLeft] = useState(null)
  const [timeElapsed] = useState((new Date().getTime() - startTime) / 1000)

  useEffect(() => {
    if (estimate) {
      setTimeLeft(estimate - timeElapsed)
    }
  }, [estimate])

  useEffect(() => {
    // exit early when we reach 0
    if (!timeLeft) return

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId)
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft])

  return { timeLeft }
}

export function getBrowserVisibilityProp() {
  if (typeof document.hidden !== 'undefined') {
    // Opera 12.10 and Firefox 18 and later support
    return 'visibilitychange'
  } else if (typeof document['msHidden'] !== 'undefined') {
    return 'msvisibilitychange'
  } else if (typeof document['webkitHidden'] !== 'undefined') {
    return 'webkitvisibilitychange'
  }
}
export function getBrowserDocumentHiddenProp() {
  if (typeof document.hidden !== 'undefined') {
    return 'hidden'
  } else if (typeof document['msHidden'] !== 'undefined') {
    return 'msHidden'
  } else if (typeof document['webkitHidden'] !== 'undefined') {
    return 'webkitHidden'
  }
}

export function getIsDocumentVisible() {
  return !process.browser || !document[getBrowserDocumentHiddenProp()]
}

export function usePageVisibility() {
  const [isVisible, setIsVisible] = useState(getIsDocumentVisible())
  const onVisibilityChange = () => setIsVisible(getIsDocumentVisible())
  useEffect(() => {
    const visibilityChange = getBrowserVisibilityProp()
    document.addEventListener(visibilityChange, onVisibilityChange, false)
    return () => {
      document.removeEventListener(visibilityChange, onVisibilityChange)
    }
  })
  return isVisible
}

export function useComponentDidMount(func: () => any) {
  useEffect(func, [])
}

export function useComponentWillMount(func: () => any) {
  const willMount = useRef(true)

  if (willMount.current) {
    func()
  }

  useComponentDidMount(() => {
    willMount.current = false
  })
}
