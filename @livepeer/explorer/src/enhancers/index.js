// @flow
import * as React from 'react'
import { matchPath } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { mapProps } from 'recompose'
import { Subscribe } from 'unstated'
import { TransactionStatusContainer } from '../containers'
import { mockRound } from '../utils'

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
 * Subscribes a component to the TransactionContainer's state
 */
export const connectTransactions = (Consumer: React.ComponentType<any>) => {
  return (
    props: React.ElementProps<typeof Consumer>,
  ): React.Element<typeof Consumer> => (
    <Subscribe to={[TransactionStatusContainer]}>
      {(transactions: TransactionStatusContainer) => (
        <Consumer {...props} transactions={transactions} />
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
      bondToken(to: $to, amount: $amount)
    }
  `,
  {
    name: 'bond',
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
    pollInterval: 30 * 1000,
    variables: {},
  }),
})
