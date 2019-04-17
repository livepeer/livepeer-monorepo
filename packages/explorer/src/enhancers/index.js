// @flow
import * as React from 'react'
import { matchPath } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { mapProps } from 'recompose'
import { Subscribe } from 'unstated'
import {
  mockBlock,
  mockRound,
  mockProtocol,
  mockDelegator,
} from '@livepeer/graphql-sdk'
import { ToastNotificationContainer } from '../containers'

export { default as withTransactionHandlers } from './withTransactionHandlers'

type nestFunc = (
  parent: React.ComponentType<any>,
  child: React.ComponentType<any>,
  ...children: React.ComponentType<any>[]
) => React.ComponentType<any>
/**
 * Creates a component which nests given components from right to left
 */
export const nest: nestFunc = (A, B, ...rest) => {
  const C = props => (
    <A {...props}>
      <B />
    </A>
  )
  return rest.length ? nest(C, ...rest) : C
}

type condFunc = <C: React.ComponentType<any>>(
  component: C,
) => React.ComponentType<C | void>
/**
 * Enhances a component by allowing it to conditionally render itself via `test` prop
 */
export const cond: condFunc = (() => {
  type CondProps = {
    test: (props: { [string]: any }) => boolean,
    children: React.Element<any>,
  }
  /**
   * Conditionally renders children if `test` prop is truthy
   */
  const Cond: CondProps => React.Node = ({ test, children, ...props }) =>
    !test ? null : React.cloneElement(children, props)
  return child => nest(Cond, child)
})()

/**
 * Sets a component prop to a hard-coded value
 */
export const withProp = (key: string, value: any) => (
  C: React.ComponentType<any>,
) => {
  const component: React.ComponentType<any> = (props: any) => (
    <C {...props} {...{ [key]: value }} />
  )
  return component
}

/**
 * Adds a `paths` object to props
 */
export const withPathMatches = (matches: { [key: string]: string }) =>
  mapProps(props => {
    return {
      ...props,
      paths: Object.entries(matches).reduce((paths, [key, path]) => {
        return {
          ...paths,
          [key]: matchPath(props.match.path, { path }),
        }
      }, {}),
    }
  })

/**
 * Subscribes a component to the ToastNofiticationContainer's state
 */
export const connectToasts = (Consumer: React.ComponentType<any>) => {
  return (
    props: React.ElementProps<typeof Consumer>,
  ): React.Element<typeof Consumer> => (
    <Subscribe to={[ToastNotificationContainer]}>
      {(toasts: ToastNotificationContainer) => (
        <Consumer {...props} toasts={toasts} />
      )}
    </Subscribe>
  )
}

export const connectApproveMutation = graphql(
  gql`
    mutation approve($type: String!, $amount: String!) {
      approve(type: $type, amount: $amount)
    }
  `,
  {
    name: 'approve',
  },
)

export const connectUnbondMutation = graphql(
  gql`
    mutation bond($amount: String!) {
      unbond(amount: $amount)
    }
  `,
  {
    name: 'unbond',
  },
)

export const connectBondMutation = graphql(
  gql`
    mutation bond($to: String!, $amount: String!) {
      bond(to: $to, amount: $amount)
    }
  `,
  {
    name: 'bond',
  },
)

export const connectClaimEarningsMutation = graphql(
  gql`
    mutation claimEarnings($endRound: String!) {
      claimEarnings(endRound: $endRound)
    }
  `,
  {
    name: 'claimEarnings',
  },
)

export const connectSendTransactionMutation = graphql(
  gql`
    mutation sendTransaction($options: JSON!) {
      sendTransaction(options: $options)
    }
  `,
  {
    name: 'sendTransaction',
  },
)

export const connectRebondMutation = graphql(
  gql`
    mutation rebond($unbondingLockId: Int!) {
      rebond(unbondingLockId: $unbondingLockId)
    }
  `,
  {
    name: 'rebond',
  },
)

export const connectRebondFromUnbondedMutation = graphql(
  gql`
    mutation rebondFromUnbonded($delegate: String!, $unbondingLockId: Int!) {
      rebondFromUnbonded(delegate: $delegate, unbondingLockId: $unbondingLockId)
    }
  `,
  {
    name: 'rebondFromUnbonded',
  },
)

export const connectInitializeRoundMutation = graphql(
  gql`
    mutation initializeRound {
      initializeRound
    }
  `,
  {
    name: 'initializeRound',
  },
)

const CoinbaseQuery = gql`
  query CoinbaseQuery {
    coinbase
  }
`

export const connectCoinbaseQuery = graphql(CoinbaseQuery, {
  props: ({ data, ownProps }) => {
    const { coinbase, ...queryData } = data
    return {
      ...ownProps,
      coinbase: {
        ...queryData,
        data: {
          coinbase: coinbase || '',
        },
      },
    }
  },
  options: () => ({
    // this query doesn't touch the network, so we can run it often
    pollInterval: 1000,
    variables: {},
  }),
})

const CurrentBlockQuery = gql`
  fragment BlockFragment on Block {
    id
  }

  query CurrentBlockQuery {
    currentBlock {
      ...BlockFragment
    }
  }
`

export const connectCurrentBlockQuery = graphql(CurrentBlockQuery, {
  props: ({ data, ownProps }) => {
    const { currentBlock, ...queryData } = data
    return {
      ...ownProps,
      currentBlock: {
        ...queryData,
        data: mockBlock(currentBlock),
      },
    }
  },
  options: ({ match }) => ({
    pollInterval: 15000,
    variables: {},
  }),
})

const CurrentRoundQuery = gql`
  fragment RoundFragment on Round {
    id
    initialized
    lastInitializedRound
    length
    startBlock
  }

  query CurrentRoundQuery {
    currentRound {
      ...RoundFragment
    }
  }
`

export const connectCurrentRoundQuery = graphql(CurrentRoundQuery, {
  props: ({ data, ownProps }) => {
    const { currentRound, ...queryData } = data
    return {
      ...ownProps,
      currentRound: {
        ...queryData,
        data: mockRound(currentRound),
      },
    }
  },
  options: ({ match }) => ({
    pollInterval: 3000,
    variables: {},
  }),
})

const ProtocolQuery = gql`
  fragment ProtocolFragment on Protocol {
    paused
    totalTokenSupply
    totalBondedToken
    targetBondingRate
    transcoderPoolMaxSize
    maxEarningsClaimsRounds
  }

  query ProtocolQuery {
    protocol {
      ...ProtocolFragment
    }
  }
`

export const connectProtocolQuery = graphql(ProtocolQuery, {
  props: ({ data, ownProps }) => {
    const { protocol, ...queryData } = data
    return {
      ...ownProps,
      protocol: {
        ...queryData,
        data: mockProtocol(protocol),
      },
    }
  },
  options: ({ match }) => ({
    pollInterval: 5 * 1000,
    variables: {},
  }),
})

export const TransactionSubmittedSubscription = gql`
  subscription TransactionSubmitted {
    transactionSubmitted {
      id
      blockNumber
      timeStamp
      nonce
      blockHash
      transactionIndex
      from
      to
      value
      gas
      gasPrice
      isError
      status
      input
      contractAddress
      cumulativeGasUsed
      gasUsed
      confirmations
      contract
      method
      params
    }
  }
`

export const TransactionConfirmedSubscription = gql`
  subscription TransactionConfirmed {
    transactionConfirmed {
      id
      blockNumber
      timeStamp
      nonce
      blockHash
      transactionIndex
      from
      to
      value
      gas
      gasPrice
      isError
      status
      input
      contractAddress
      cumulativeGasUsed
      gasUsed
      confirmations
      contract
      method
      params
    }
  }
`

export const TransactionsQuery = gql`
  fragment TransactionFragment on Transaction {
    id
    blockNumber
    timeStamp
    nonce
    blockHash
    transactionIndex
    from
    to
    value
    gas
    gasPrice
    isError
    status
    input
    contractAddress
    cumulativeGasUsed
    gasUsed
    confirmations
    contract
    method
    params
  }

  query TransactionQuery(
    $address: String!
    $startBlock: String
    $endBlock: String
    $skip: String
    $limit: String
    $sort: String
  ) {
    transactions(
      address: $address
      startBlock: $startBlock
      endBlock: $endBlock
      skip: $skip
      limit: $limit
      sort: $sort
    ) {
      ...TransactionFragment
    }
  }
`

export const connectTransactionsQuery = graphql(TransactionsQuery, {
  props: ({ data, ownProps }) => {
    const { transactions, ...queryData } = data
    return {
      ...ownProps,
      transactions: {
        ...queryData,
        data: transactions || [],
      },
    }
  },
  options: ({ match }) => ({
    pollInterval: 30 * 1000,
    variables: {
      address: match.params.accountId,
    },
    fetchPolicy: 'cache-and-network',
  }),
})

export const TranscodersQuery = gql`
  fragment TranscoderFragment on Transcoder {
    id
    active
    ensName
    status
    lastRewardRound
    rewardCut
    feeShare
    pricePerSegment
    pendingRewardCut
    pendingFeeShare
    pendingPricePerSegment
    totalStake
    rewards(orderBy: id, orderDirection: desc) {
      rewardTokens
      round {
        id
      }
    }
  }

  query TranscodersQuery {
    transcoders {
      ...TranscoderFragment
    }
  }
`

export const connectTranscodersQuery = graphql(TranscodersQuery, {
  props: ({ data, ownProps }) => {
    let { transcoders, ...queryData } = data
    // Filter by registered transcoders
    // TODO: Use graphql variables instead when The Graph supports them
    if (transcoders) {
      transcoders = transcoders.filter(t => t.status === 'Registered')
    }
    return {
      ...ownProps,
      transcoders: {
        ...queryData,
        data: transcoders || [],
      },
    }
  },
  options: ({ match }) => ({
    pollInterval: 10000,
    variables: {
      skip: 0,
      first: 100,
    },
    fetchPolicy: 'cache-and-network',
  }),
})

export const AccountDelegatorUnbondLockQuery = gql`
  fragment DelegatorFragment on Delegator {
    id
    allowance
    status
    delegateAddress
    bondedAmount
    fees
    delegatedAmount
    lastClaimRound
    pendingFees
    pendingStake
    startRound
    withdrawAmount
    withdrawRound
  }

  query AccountDelegatorQuery($id: String!, $lockId: String!) {
    account(id: $id) {
      id
      delegator {
        ...DelegatorFragment
      }

      unbondlock(lockId: $lockId) {
        id
        amount
        withdrawRound
        delegator
      }
    }
  }
`

export const connectAccountDelegatorUnbondLockQuery = graphql(
  AccountDelegatorUnbondLockQuery,
  {
    props: ({ data: { account, ...queryProps }, ownProps }) => {
      const { delegator, unbondlock } = account || {}

      let result = {
        ...ownProps,
        delegator: {
          ...queryProps,
          data: mockDelegator(delegator),
        },
        unbondlock,
      }

      return result
    },
    options: ({ match, location }) => {
      // pollInterval: 60 * 1000,
      const {
        state: { accountId },
      } = location

      return {
        variables: {
          id: accountId,
          lockId: match.params.lockId,
        },
        // ssr: false,
        fetchPolicy: 'network-only',
      }
    },
  },
)

const AccountDelegatorQuery = gql`
  fragment DelegatorFragment on Delegator {
    id
    allowance
    status
    delegateAddress
    bondedAmount
    fees
    delegatedAmount
    lastClaimRound
    pendingFees
    pendingStake
    startRound
  }

  query AccountDelegatorQuery($id: String!) {
    account(id: $id) {
      id
      delegator {
        ...DelegatorFragment
      }

      unbondlocks {
        id
        amount
        withdrawRound
        delegator
      }
    }
  }
`

export const connectAccountDelegatorQuery = graphql(AccountDelegatorQuery, {
  props: ({ data, ownProps }) => {
    const { account, ...queryProps } = data
    const { delegator, unbondlocks } = account || {}

    let result = {
      ...ownProps,
      delegator: {
        ...queryProps,
        data: mockDelegator(delegator),
      },
      unbondlocks,
    }

    return result
  },
  options: ({ match }) => ({
    pollInterval: 5000,
    variables: {
      id: match.params.accountId,
    },
    // ssr: false,
    fetchPolicy: 'network-only',
  }),
})
