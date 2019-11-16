import { MAX_EARNINGS_CLAIMS_ROUNDS } from '../../lib/utils'

/**
 * Approve an amount for an ERC20 token transfer
 * @param obj
 * @param {string} type - The approval type
 * @param {string} amount - The approval amount
 * @return {Promise}
 */
export async function approve(
  obj,
  args: { type: string; amount: string },
  ctx,
) {
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
        returnTxHash: ctx.returnTxHash ? ctx.returnTxHash : false,
      })
      break
    default:
      throw new Error(`Approval type "${type}" is not supported.`)
  }
}

/**
 * Submits a bond transaction for a previously approved amount
 * @param obj
 * @param {string} to - The ETH address of the delegate to bond to
 * @param {string} amount - The approval amount
 * @return {Promise}
 */
export async function bond(obj, args: { to: string; amount: string }, ctx) {
  const { to, amount } = args
  const gas = await ctx.livepeer.rpc.estimateGas('BondingManager', 'bond', [
    amount,
    to,
  ])

  return await ctx.livepeer.rpc.bondApprovedTokenAmount(to, amount, {
    gas: gas,
    returnTxHash: true,
  })
}

/**
 * Batch submits claimEarnings transactions
 * @param obj
 * @param {string} lastClaimRound - The delegator's last claim round
 * @param {string} endRound - The round to claim earnings until
 * @return {Promise}
 */
export async function batchClaimEarnings(obj, args, ctx) {
  const { lastClaimRound, endRound } = args
  const { abi, address } = ctx.livepeer.config.contracts.BondingManager
  const bondingManager = new ctx.web3.eth.Contract(abi, address)
  const totalRoundsToClaim = parseInt(endRound) - parseInt(lastClaimRound)
  const quotient = Math.floor(totalRoundsToClaim / MAX_EARNINGS_CLAIMS_ROUNDS)
  const remainder = totalRoundsToClaim % MAX_EARNINGS_CLAIMS_ROUNDS
  const calls = []

  for (let i = 1; i <= quotient; i++) {
    calls.push(
      bondingManager.methods.claimEarnings(
        (parseInt(lastClaimRound) + i * MAX_EARNINGS_CLAIMS_ROUNDS).toString(),
      ).send,
    )
  }

  if (remainder) {
    calls.push(bondingManager.methods.claimEarnings(endRound).send)
  }

  function makeBatchRequest(calls) {
    let batch = new ctx.web3.BatchRequest()
    let promises = calls.map(call => {
      return new Promise((res, rej) => {
        let req = call.request({ from: ctx.account }, (err, txHash) => {
          if (err) {
            rej(err)
          }
          res(txHash)
        })
        batch.add(req)
      })
    })
    batch.execute()
    return Promise.all(promises)
  }

  const txns = await makeBatchRequest(calls)
  const lastTransactionInBatch = txns[calls.length - 1]
  return lastTransactionInBatch
}

/**
 * Submits an unbond transaction
 * @param obj
 * @return {Promise}
 */
export async function unbond(obj, args, ctx) {
  const { amount } = args

  return await ctx.livepeer.rpc.unbond(amount, {
    ...ctx.livepeer.config.defaultTx,
    returnTxHash: ctx.returnTxHash ? ctx.returnTxHash : false,
  })
}

/**
 * Submits a rebond transaction
 * @param obj
 * @return {Promise}
 */
export async function rebond(obj, args, ctx) {
  const { unbondingLockId } = args

  const gas = await ctx.livepeer.rpc.estimateGas('BondingManager', 'rebond', [
    unbondingLockId,
  ])

  return await ctx.livepeer.rpc.rebond(unbondingLockId, {
    ...ctx.livepeer.config.defaultTx,
    gas: gas,
    returnTxHash: ctx.returnTxHash ? ctx.returnTxHash : false,
  })
}

/**
 * Submits a withdrawStake transaction
 * @param obj
 * @return {Promise}
 */
export async function withdrawStake(obj, args, ctx) {
  const { unbondingLockId } = args

  const gas = await ctx.livepeer.rpc.estimateGas(
    'BondingManager',
    'withdrawStake',
    [unbondingLockId],
  )

  return await ctx.livepeer.rpc.withdrawStake(unbondingLockId, {
    ...ctx.livepeer.config.defaultTx,
    gas: gas,
    returnTxHash: ctx.returnTxHash ? ctx.returnTxHash : false,
  })
}

/**
 * Submits a rebondFromUnbonded transaction
 * @param obj
 * @return {Promise}
 */
export async function rebondFromUnbonded(obj, args, ctx) {
  const { delegate, unbondingLockId } = args

  const gas = await ctx.livepeer.rpc.estimateGas(
    'BondingManager',
    'rebondFromUnbonded',
    [delegate, unbondingLockId],
  )

  return await ctx.livepeer.rpc.rebondFromUnbonded(delegate, unbondingLockId, {
    gas: gas,
    returnTxHash: ctx.returnTxHash ? ctx.returnTxHash : false,
  })
}

/**
 * Submits a round initialization transaction
 * @param obj
 * @return {Promise}
 */
export async function initializeRound(obj, args, ctx) {
  const gas = await ctx.livepeer.rpc.estimateGas(
    'RoundsManager',
    'initializeRound',
    [],
  )
  return await ctx.livepeer.rpc.initializeRound({
    gas,
    returnTxHash: ctx.returnTxHash ? ctx.returnTxHash : false,
  })
}
