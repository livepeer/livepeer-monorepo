// @flow
import { Container } from 'unstated'

export class TransactionStatus {
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
  constructor(props: Object = {}) {
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
    Object.entries(defaults).forEach(
      ([
        key: $Keys<TransactionStatus>,
        value: $Values<TransactionStatus>,
      ]): void => {
        // @flow-ignore
        this[key] = value
      },
    )
    Object.entries(props).forEach(
      ([
        key: $Keys<TransactionStatus>,
        value: $Values<TransactionStatus>,
      ]): void => {
        // @flow-ignore
        this[key] = value
      },
    )
  }
  merge(props: Object): TransactionStatus {
    return new this.constructor({
      ...this,
      ...props,
    })
  }
  static create(type: string, props: Object): TransactionStatus {
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

export class BondStatus extends TransactionStatus {
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

export class ApproveStatus extends TransactionStatus {
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

export type TransactionStatusMap = {
  [id: string]: TransactionStatus,
}

export class TransactionStatusContainer extends Container<
  TransactionStatusMap,
> {
  state: TransactionStatusMap = {}
  commit = (status: TransactionStatus) => {
    const { type, id } = status
    // console.log('commit', status)
    this.setState({
      [`${type}/${id}`]: status,
    })
  }
  delete = (status: TransactionStatus) => {
    const { type, id } = status
    delete this.state[`${type}/${id}`]
    this.setState(this.state)
  }
  empty = TransactionStatus.create
  findWhere = (obj: Object) => {
    const keys = Object.keys(obj)
    // @flow-ignore
    const statuses: TransactionStatus[] = Object.values(this.state)
    for (const status of statuses) {
      const found = keys.every(k => {
        // @flow-ignore
        return JSON.stringify(obj[k]) === JSON.stringify(status[k])
      })
      if (found) return status
    }
  }
  activate = (query: Object): void => {
    const status =
      this.findWhere(query) || TransactionStatus.create(query.type, query)
    this.commit(status.merge({ active: true }))
  }
  deactivate = (query: Object): void => {
    const status = this.findWhere(query)
    if (!status) return
    this.commit(status.merge({ active: false }))
  }
}
