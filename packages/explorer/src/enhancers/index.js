// @flow
import * as React from 'react'
import { matchPath } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { mapProps } from 'recompose'
import { Subscribe } from 'unstated'
import { mockRound, mockProtocol } from '@livepeer/graphql-sdk'
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

export const connectUnbondMutation = graphql(
  gql`
    mutation unbond {
      unbond
    }
  `,
  {
    name: 'unbond',
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
    pollInterval: 10 * 1000,
    variables: {},
  }),
})

const ProtocolQuery = gql`
  fragment ProtocolFragment on Protocol {
    paused
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
