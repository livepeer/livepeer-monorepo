import {
  publish,
  TransactionConfirmed,
  TransactionSubmitted,
} from './Subscription'

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
      return await ctx.livepeer.rpc.approveTokenBondAmount(amount, {
        gas: 60000,
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
  return await ctx.livepeer.rpc.bondApprovedTokenAmount(to, amount, {
    gas: 450000,
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
  const txHash = await ctx.livepeer.rpc.claimEarnings(endRound)
  console.log(txHash)
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
    gas: '',
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
 * Submits an unbond transaction
 * @param {MutationObj} obj
 * @return {Promise<TxReceipt>}
 */
export async function unbond(
  obj: MutationObj,
  args,
  ctx: GQLContext,
): Promise<TxReceipt> {
  return await ctx.livepeer.rpc.unbond()
}
