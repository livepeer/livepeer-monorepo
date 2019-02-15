import {
  publish,
  TransactionConfirmed,
  TransactionSubmitted,
} from './Subscription'

const BN = require('bn.js')
/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
}

type MutationObj = {}

/** Resolvers */

/**
 * Approve an amount for an ERC20 token transfer
 * @param {MutationObj} obj
 * @param {string} type - The approval type
 * @param {string} amount - The approval amount
 * @return {Promise<TxReceipt>}
 */
export async function approve(
  obj: MutationObj,
  args: { type: string, amount: string },
  ctx: GQLContext,
): Promise<TxReceipt> {
  const { type, amount } = args
  switch (type) {
    case 'bond':
      const gas = await ctx.livepeer.rpc.estimateGas(
        'LivepeerToken',
        'approve',
        [ctx.livepeer.config.contracts.BondingManager.address, amount],
      )
      return await ctx.livepeer.rpc.approveTokenBondAmount(amount, {
        gas: gas,
      })
      break
    default:
      throw new Error(`Approval type "${type}" is not supported.`)
  }
}

/**
 * Submits a bond transaction for a previously approved amount
 * @param {MutationObj} obj
 * @param {string} to - The ETH address of the delegate to bond to
 * @param {string} amount - The approval amount
 * @return {Promise<TxReceipt>}
 */
export async function bond(
  obj: MutationObj,
  args: { to: string, amount: string },
  ctx: GQLContext,
): Promise<TxReceipt> {
  const { to, amount } = args
  const gas = await ctx.livepeer.rpc.estimateGas('BondingManager', 'bond', [
    amount,
    to,
  ])
  return await ctx.livepeer.rpc.bondApprovedTokenAmount(to, amount, {
    gas: gas,
  })
}

/**
 * Submits a claimEarnings transaction
 * @param {MutationObj} obj
 * @param {string} endRound - The round to claim earnings until
 * @return {Promise<TxReceipt>}
 */
export async function claimEarnings(
  obj: MutationObj,
  args: { endRound: string },
  ctx: GQLContext,
): Promise<TxReceipt> {
  const { utils, config } = ctx.livepeer
  const { eth } = config
  const { endRound } = args
  const gas = await ctx.livepeer.rpc.estimateGas(
    'BondingManager',
    'claimEarnings',
    [endRound],
  )
  const txHash = await ctx.livepeer.rpc.claimEarnings(endRound, {
    gas: gas,
  })
  const mockTx = {
    blockNumber: '',
    blockHash: '',
    transactionIndex: '',
    from: ctx.account,
    to: '',
    value: '',
    isError: '0x0',
    status: '',
    input: '',
    contractAddress: '',
    cumulativeGasUsed: '',
    confirmations: '0',
    contract: 'BondingManager',
    gas: gas,
    gasUsed: '',
    gasPrice: '',
    id: txHash,
    method: 'claimEarnings',
    nonce: '',
    params: { _endRound: endRound },
    status: 'pending',
    timeStamp: `${Math.floor(Date.now() / 1000)}`,
  }
  publish(TransactionSubmitted, mockTx)
  const receipt = await utils.getTxReceipt(txHash, eth)
  publish(TransactionConfirmed, {
    ...mockTx,
    blockHash: receipt.blockHash,
    blockNumber: receipt.blockNumber.toString(10),
    cumulativeGasUsed: receipt.cumulativeGasUsed.toString(10),
    gasUsed: receipt.gasUsed.toString(10),
    to: receipt.to,
    transactionIndex: receipt.transactionIndex.toString(10),
    status: receipt.status.substr(2),
    confirmations: '1',
  })
}

/**
 * Send a transaction object
 * @param {MutationObj} obj
 * @return {Promise<TxReceipt>}
 */
export async function sendTransaction(
  obj: MutationObj,
  args,
  ctx: GQLContext,
): Promise<TxReceipt> {
  const { utils, config } = ctx.livepeer
  const { eth, defaultTx } = config
  return await utils.getTxReceipt(
    await eth.sendTransaction({
      ...defaultTx,
      ...args.options,
    }),
    eth,
  )
}

/**
 * Submits an unbond transaction
 * @param {MutationObj} obj
 * @return {Promise<TxReceipt>}
 */
export async function unbond(
  obj: MutationObj,
  args,
  ctx: GQLContext,
): Promise<TxReceipt> {

  const { amount } = args
  const gas = await ctx.livepeer.rpc.estimateGas('BondingManager', 'unbond', [
    amount,
  ])

  return await ctx.livepeer.rpc.unbond(amount, {
    ...ctx.livepeer.config.defaultTx,
    gas: gas,
  })
}

/**
 * Submits a rebond transaction
 * @param {MutationObj} obj
 * @return {Promise<TxReceipt>}
 */
export async function rebond(
  obj: MutationObj,
  args,
  ctx: GQLContext,
): Promise<TxReceipt> {
  const { unbondingLockId } = args

  const gas = await ctx.livepeer.rpc.estimateGas('BondingManager', 'rebond', [
    unbondingLockId,
  ])

  return await ctx.livepeer.rpc.rebond(unbondingLockId, {
    ...ctx.livepeer.config.defaultTx,
    gas: gas,
  })
}

/**
 * Submits a rebondFromUnbonded transaction
 * @param {MutationObj} obj
 * @return {Promise<TxReceipt>}
 */
export async function rebondFromUnbonded(
  obj: MutationObj,
  args,
  ctx: GQLContext,
): Promise<TxReceipt> {
  const { delegate, unbondingLockId } = args

  const gas = await ctx.livepeer.rpc.estimateGas(
    'BondingManager',
    'rebondFromUnbonded',
    [delegate, unbondingLockId],
  )

  return await ctx.livepeer.rpc.rebondFromUnbonded(delegate, unbondingLockId, {
    gas: gas,
  })
}
