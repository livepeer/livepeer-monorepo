import * as React from 'react'
import { ApolloProvider } from 'react-apollo'
import { Provider as ReduxProvider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Provider as UnstatedProvider, Container } from 'unstated'

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

class TransactionStatus {
  /** info about the contract and method */
  abi: Object
  /** is the transaction currently being created */
  active: boolean
  /** transaction receipt is available */
  done: boolean
  /** any errors that result from submitting the transaction */
  error: Error | void
  /** hash of the actual transaction object */
  hash: string | void
  /** identifier for this transaction */
  id: string
  /** any meta information related to the transaction */
  meta: any
  /** has the transaction been submitted */
  submitted: boolean
  /** type of TransactionStatus (could be useful for serialization) */
  type: string
  /** class constructor */
  constructor(props = {}) {
    const defaults = {
      abi: {},
      active: false,
      done: false,
      error: null,
      hash: '',
      id: '',
      meta: {},
      submitted: false,
      type: '',
    }
    Object.entries(defaults).forEach(([key, value]) => {
      this[key] = value
    })
    Object.entries(props).forEach(([key, value]) => {
      this[key] = value
    })
  }
  merge(obj: Object) {
    return new this.constructor({
      ...this,
      ...obj,
    })
  }
  set(key: string, value: any) {
    return new this.constructor({
      ...this,
      [key]: value,
    })
  }
  static create(type, props) {
    switch (type) {
      case 'BondStatus':
        return new BondStatus(props)
      case 'null':
        return new TransactionStatus(props)
      default:
        throw new Error(`'${type}' is not a valid type of TransactionStatus`)
    }
  }
}

class BondStatus extends TransactionStatus {
  static abi = {
    constant: false,
    inputs: [
      {
        name: '_amount',
        type: 'uint256',
      },
      {
        name: '_to',
        type: 'address',
      },
    ],
    name: 'bond',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  }
  abi = BondStatus.abi
  type = 'BondStatus'
}

// const a = new BondStatus({ id: 'foo' })
// const b = a.set('meta', { foo: 'bar' })

// console.log(a, b)

class ApproveStatus extends TransactionStatus {
  static abi = {
    constant: false,
    inputs: [
      {
        name: '_spender',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  }
  abi = ApproveStatus.abi
  type = 'ApproveStatus'
}

type TransactionsState = {
  [id: string]: TransactionStatus,
}

export class TransactionsContainer extends Container<TransactionsState> {
  state = {}
  commit = (nextStatus: TransactionStatus) => {
    const { type, id } = nextStatus
    console.log('commit', nextStatus)
    this.setState({
      [`${type}/${id}`]: nextStatus,
    })
  }
  delete = (nextStatus: TransactionStatus) => {
    const { type, id } = nextStatus
    delete this.state[`${type}/${id}`]
    this.setState(this.state)
  }
  empty = TransactionStatus.create
  find = f => Object.values(this.state).find(f)
  findWhere = (obj: Object) => {
    const keys = Object.keys(obj)
    const txs = Object.values(this.state)
    for (const tx of txs) {
      const found = keys.every(k => {
        return JSON.stringify(obj[k]) === JSON.stringify(tx[k])
      })
      if (found) return tx
    }
  }
  activate = (query: Object): void => {
    const tx =
      this.findWhere(query) || TransactionStatus.create(query.type, query)
    this.commit(tx.merge({ active: true }))
  }
  deactivate = (query: Object): void => {
    const tx = this.findWhere(query)
    if (!tx) return
    this.commit(tx.merge({ active: false }))
  }
}

const transactions = new TransactionsContainer()

const Root = ({ client, history, store, children }) => (
  <ApolloProvider client={client}>
    <ReduxProvider store={store}>
      <UnstatedProvider inject={[transactions]}>
        <ConnectedRouter history={history}>{children}</ConnectedRouter>
      </UnstatedProvider>
    </ReduxProvider>
  </ApolloProvider>
)

export default Root
