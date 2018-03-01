import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Provider as ReduxProvider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Provider, Container } from 'unstated'

type TxReceipt = {
  blockHash: string,
  blockNumber: string,
  contractAddress: string | void,
  cumulativeGasUsed: string,
  from: string,
  gasUsed: string,
  logs: string[],
  logsBloom: string,
  status: string,
  to: string,
  transactionHash: string,
  transactionIndex: string,
}

type TxObject = {
  blockHash: string,
  blockNumber: string,
  from: string,
  gas: string,
  gasPrice: string,
  hash: string,
  input: string,
  nonce: string,
  to: string,
  transactionIndex: string,
  value: string,
  v: string,
  r: string,
  s: string,
}

type TransactionStatus = {
  done: boolean,
  id: string,
  pending: boolean,
  /** if void, not submitted */
  tx: TxObject | void,
  type: string,
  /** if void, not done */
  receipt: TxReceipt | void,
  error: Error | void,
  input: any,
  meta: any,
}

type TransactionsState = {
  [id: string]: TransactionStatus,
}

export class TransactionsContainer extends Container<TransactionsState> {
  state = {}
  find = f => Object.values(this.state).find(f)
  get = (type: string, key: string) => {
    const id = `${type}/${key}`
    return this.state[id]
  }
  set = (type: string, key: string, status: TransactionStatus) => {
    const id = `${type}/${key}`
    this.setState({
      [id]: {
        active: false,
        done: false,
        pending: false,
        tx: null,
        receipt: null,
        error: null,
        input: {},
        meta: {},
        ...status,
        key,
        type,
      },
    })
  }
  activate = (type: string, key: string, status?: Object) => {
    const id = `${type}/${key}`
    this.setState({
      [id]: {
        done: false,
        pending: false,
        tx: null,
        receipt: null,
        error: null,
        input: {},
        meta: {},
        ...this.state[id],
        ...status,
        active: true,
        key: `${key}`,
        type,
      },
    })
  }
  deactivate = (type: string, key: string, status?: Object) => {
    const id = `${type}/${key}`
    if (!this.state[id]) return
    this.setState({
      [id]: {
        done: false,
        pending: false,
        tx: null,
        receipt: null,
        error: null,
        input: {},
        meta: {},
        ...this.state[id],
        ...status,
        active: false,
        key: `${key}`,
        type,
      },
    })
  }
  update = (
    type: string,
    key: string,
    reduce: TransactionsStatus => TransactionsStatus,
  ) => {
    const id = `${type}/${key}`
    this.setState({
      [id]: reduce(this.state[id]),
    })
  }
}

const transactions = new TransactionsContainer()

const Root = ({ client, history, store, children }) => (
  <ApolloProvider client={client}>
    <ReduxProvider store={store}>
      <Provider inject={[transactions]}>
        <ConnectedRouter history={history}>{children}</ConnectedRouter>
      </Provider>
    </ReduxProvider>
  </ApolloProvider>
)

export default Root
