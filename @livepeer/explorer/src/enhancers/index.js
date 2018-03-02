// @flow
import * as React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { mapProps } from 'recompose'
import { Subscribe } from 'unstated'
import { TransactionsContainer } from '../containers/Root'
import { sleep } from '../utils'

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
 * Subscribes a component to the TransactionContainer's state
 */
export const connectTransactions = (Consumer: React.ComponentType<any>) => {
  return (
    props: React.ElementProps<typeof Consumer>,
  ): React.Element<typeof Consumer> => (
    <Subscribe to={[TransactionsContainer]}>
      {(transactions: TransactionsContainer) => (
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
    mutation bondToken($to: String!, $amount: String!) {
      bond(to: $to, amount: $amount)
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

export const withBindToStatus = mapProps(props => ({
  ...props,
  bindToStatus: (submit, query) => async (...args) => {
    try {
      const { transactions: tx } = props
      let status = tx.findWhere(query)
      // 1. Submit transaction (signals loading state)
      status = status.merge({ submitted: true })
      tx.commit(status)
      const { transaction } = await submit(...args)
      // 2. Update transaction hash (signals transaction is pending)
      status = status.merge({
        hash: transaction.hash,
      })
      tx.commit(status)
      // 3. Update transaction completion
      // TODO: subscribe to transactions and update this status elsewhere. (Errors as well)
      status = status.merge({ done: true })
      tx.commit(status)
    } catch (error) {
      const { transactions: tx } = props
      let status = tx.findWhere({
        id: query.id,
        type: query.type,
      })
      if (error.graphQLErrors) {
        const [gqlError] = error.graphQLErrors
        try {
          // try to parse the error message
          const rpcErr = JSON.parse(
            `{"code":${gqlError.message.split('"code":')[1]}`,
          )
          console.log(rpcErr)
          const nextError = new Error(rpcErr.message)
          // use a custom error with the rpc error message
          status = status.merge({ done: true, error: nextError })
          tx.commit(status)
        } catch (err) {
          // if the message can't be parsed, just use the gql error
          status = status.merge({ done: true, error: gqlError })
          tx.commit(status)
        }
      } else {
        // if something else went wrong, use the original error
        status = status.merge({ done: true, error })
        tx.commit(status)
      }
    }
  },
}))
