import { MAX_EARNINGS_CLAIMS_ROUNDS } from '../../lib/utils'
import LivepeerSDK from '@adamsoffer/livepeer-sdk'

/**
 * Approve an amount for an ERC20 token transfer
 * @param obj
 * @param {string} type - The approval type
 * @param {string} amount - The approval amount
 * @return {Promise}
 */
export async function approve(_obj, _args, _ctx) {
  const sdk = await LivepeerSDK({
    account: _ctx.account,
    gas: 2.1 * 1000000,
    provider: _ctx.provider,
  })

  const { type, amount } = _args

  switch (type) {
    case 'bond':
      const gas = await sdk.rpc.estimateGas('LivepeerToken', 'approve', [
        sdk.config.contracts.BondingManager.address,
        amount,
      ])
      return await sdk.rpc.approveTokenBondAmount(amount, {
        gas,
        returnTxHash: true,
      })
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
export async function bond(_obj, _args, _ctx) {
  const { to, amount } = _args
  const sdk = await LivepeerSDK({
    account: _ctx.account,
    gas: null,
    provider: _ctx.provider,
  })

  const gas = await sdk.rpc.estimateGas('BondingManager', 'bond', [amount, to])

  return await sdk.rpc.bondApprovedTokenAmount(to, amount, {
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
export async function batchClaimEarnings(_obj, _args, _ctx) {
  const { lastClaimRound, endRound } = _args
  const sdk = await LivepeerSDK({
    account: _ctx.account,
    gas: 2.1 * 1000000,
    provider: _ctx.provider,
  })
  const { abi, address } = sdk.config.contracts.BondingManager
  const bondingManager = new _ctx.web3.eth.Contract(abi, address)
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
    let batch = new _ctx.web3.BatchRequest()
    let promises = calls.map(call => {
      return new Promise((res, rej) => {
        let req = call.request({ from: _ctx.account }, (err, txHash) => {
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
export async function unbond(_obj, _args, _ctx) {
  const sdk = await LivepeerSDK({
    account: _ctx.account,
    gas: null,
    provider: _ctx.provider,
  })
  const { amount } = _args

  const gas = await sdk.rpc.estimateGas('BondingManager', 'unbond', [amount])

  return await sdk.rpc.unbond(amount, {
    ...sdk.config.defaultTx,
    gas,
    returnTxHash: true,
  })
}

/**
 * Submits a rebond transaction
 * @param obj
 * @return {Promise}
 */
export async function rebond(_obj, _args, _ctx) {
  const sdk = await LivepeerSDK({
    account: _ctx.account,
    gas: null,
    provider: _ctx.provider,
  })
  const { unbondingLockId } = _args

  const gas = await sdk.rpc.estimateGas('BondingManager', 'rebond', [
    unbondingLockId,
  ])

  return await sdk.rpc.rebond(unbondingLockId, {
    ...sdk.config.defaultTx,
    gas: gas,
    returnTxHash: true,
  })
}

/**
 * Submits a withdrawStake transaction
 * @param obj
 * @return {Promise}
 */
export async function withdrawStake(_obj, _args, _ctx) {
  const sdk = await LivepeerSDK({
    account: _ctx.account,
    gas: null,
    provider: _ctx.provider,
  })
  const { unbondingLockId } = _args

  const gas = await sdk.rpc.estimateGas('BondingManager', 'withdrawStake', [
    unbondingLockId,
  ])

  return await sdk.rpc.withdrawStake(unbondingLockId, {
    ...sdk.config.defaultTx,
    gas: gas,
    returnTxHash: true,
  })
}

/**
 * Submits a rebondFromUnbonded transaction
 * @param obj
 * @return {Promise}
 */
export async function rebondFromUnbonded(_obj, _args, _ctx) {
  const sdk = await LivepeerSDK({
    account: _ctx.account,
    gas: null,
    provider: _ctx.provider,
  })
  const { delegate, unbondingLockId } = _args

  const gas = await sdk.rpc.estimateGas(
    'BondingManager',
    'rebondFromUnbonded',
    [delegate, unbondingLockId],
  )

  return await sdk.rpc.rebondFromUnbonded(delegate, unbondingLockId, {
    gas: gas,
    returnTxHash: true,
  })
}

/**
 * Submits a round initialization transaction
 * @param obj
 * @return {Promise}
 */
export async function initializeRound(_obj, _args, _ctx) {
  const sdk = await LivepeerSDK({
    account: _ctx.account,
    gas: null,
    provider: _ctx.provider,
  })
  const gas = await sdk.rpc.estimateGas('RoundsManager', 'initializeRound', [])
  return await sdk.rpc.initializeRound({
    gas,
    returnTxHash: true,
  })
}

/**
 * Update's a user's 3box space
 * @param obj
 * @return {Promise}
 */
export async function updateProfile(_obj, _args, _ctx) {
  const address = _ctx.address.toLowerCase()
  const box = _ctx.box

  try {
    const space = await box.openSpace('livepeer')

    if (_args.proof) {
      await box.linkAddress({
        proof: _args.proof,
      })
    }

    const allowed = [
      'name',
      'website',
      'description',
      'image',
      'defaultProfile',
    ]
    const filtered = Object.keys(_args)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = _args[key]
        return obj
      }, {})

    if (_args.defaultProfile === '3box') {
      return
    }

    await space.public.setMultiple(
      Object.keys(filtered),
      Object.values(filtered),
    )

    return {
      id: address,
      ...filtered,
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * Unlink an external account from a user's 3box
 * @param obj
 * @return {Promise}
 */
export async function removeAddressLink(_obj, _args, _ctx) {
  const address = _args.address.toLowerCase()
  const box = _ctx.box
  try {
    await box.removeAddressLink(address)
  } catch (e) {
    console.error(e)
  }
}
