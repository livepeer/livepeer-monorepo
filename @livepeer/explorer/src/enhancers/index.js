// @flow
import * as React from 'react'
export { default as withTransactionHandlers } from './withTransactionHandlers'

type nestFunc = (
  parent: React.ComponentType<any>,
  child: React.ComponentType<any>,
  ...children: React.ComponentType<any>[]
) => React.ComponentType<any>
/** Creates a component which nests given components from right to left */
export const nest: nestFunc = (A, B, ...rest) => {
  const C = props => (
    <A {...props}>
      <B />
    </A>
  )
  return rest.length ? nest(C, ...rest) : C
}

type condFunc = <C>(
  component: React.ComponentType<any>,
) => React.ComponentType<C | void>
/** Enhances a component by allowing it to conditionally render itself via `test` prop */
export const cond: condFunc = (() => {
  type CondProps = {
    test: (props: { [string]: any }) => boolean,
    children: React.Element<any>,
  }
  /** Conditionally renders children if `test` prop is truthy */
  const Cond: CondProps => React.Node = ({ test, children, ...props }) =>
    !test ? null : React.cloneElement(children, props)
  return child => nest(Cond, child)
})()
