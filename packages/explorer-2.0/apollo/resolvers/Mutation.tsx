import { MAX_BATCH_CLAIM_ROUNDS } from '../../lib/utils'
import Utils from 'web3-utils'

/**
 * Approve an amount for an ERC20 token transfer
 * @param obj
 * @param {string} type - The approval type
 * @param {string} amount - The approval amount
 * @return {Promise}
 */
export async function approve(_obj, _args, _ctx) {
  const { type, amount } = _args
  let gas
  let txHash

  switch (type) {
    case 'bond':
      gas = await _ctx.livepeer.rpc.estimateGas('LivepeerToken', 'approve', [
        _ctx.livepeer.config.contracts.BondingManager.address,
        amount,
      ])
      txHash = await _ctx.livepeer.rpc.approveTokenBondAmount(amount, {
        gas,
        returnTxHash: true,
      })
      return {
        gas,
        txHash,
        inputData: {
          ..._args,
        },
      }
    case 'createPoll':
      gas = await _ctx.livepeer.rpc.estimateGas('LivepeerToken', 'approve', [
        _ctx.livepeer.config.contracts.PollCreator.address,
        amount,
      ])

      txHash = await _ctx.livepeer.rpc.approveTokenPollCreationCost(amount, {
        gas,
        returnTxHash: true,
      })
      return {
        gas,
        txHash,
        inputData: {
          ..._args,
        },
      }
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
  const gas = await _ctx.livepeer.rpc.estimateGas('BondingManager', 'bond', [
    amount,
    to,
  ])
  const txHash = await _ctx.livepeer.rpc.bondApprovedTokenAmount(to, amount, {
    gas: gas,
    returnTxHash: true,
  })

  return {
    gas,
    txHash,
    inputData: {
      ..._args,
    },
  }
}

/**
 * Batch submits claimEarnings transactions
 * @param obj
 * @param {string} lastClaimRound - The delegator's last claim round
 * @param {string} endRound - The round to claim earnings until
 * @return {Promise}
 * https://github.com/ethereum/web3.js/issues/1446
 */
export async function batchClaimEarnings(_obj, _args, _ctx) {
  const Web3 = require('web3') // use web3 lib for batching transactions
  const web3 = new Web3(_ctx.library._web3Provider)
  const { lastClaimRound, endRound: lastEndRound } = _args
  const { abi, address } = _ctx.livepeer.config.contracts.BondingManager
  const bondingManager = new web3.eth.Contract(abi, address)
  const totalRoundsToClaim = parseInt(lastEndRound) - parseInt(lastClaimRound)
  const quotient = Math.floor(totalRoundsToClaim / MAX_BATCH_CLAIM_ROUNDS)
  const remainder = totalRoundsToClaim % MAX_BATCH_CLAIM_ROUNDS
  const calls = []

  let batch = new web3.BatchRequest()
  let totalGas = 0
  let maxBatchGas = parseInt(
    await _ctx.livepeer.rpc.estimateGas('BondingManager', 'claimEarnings', [
      (parseInt(lastClaimRound) + MAX_BATCH_CLAIM_ROUNDS).toString(),
    ]),
  )

  function addCall(endRound, gas) {
    calls.push(
      new Promise((res, rej) => {
        batch.add(
          bondingManager.methods.claimEarnings(endRound).send.request(
            {
              from: _ctx.account,
              gas: parseInt(gas, 10), // truncate in case 'gas' is a float
            },
            (err, txHash) => {
              if (err) rej(err)
              else res(txHash)
            },
          ),
        )
      }),
    )
  }

  for (let i = 1; i <= quotient; i++) {
    let end = (parseInt(lastClaimRound) + i * MAX_BATCH_CLAIM_ROUNDS).toString()
    totalGas = totalGas + maxBatchGas * 1.05
    addCall(end, maxBatchGas * 1.05)
  }

  if (remainder) {
    totalGas =
      totalGas + (maxBatchGas / MAX_BATCH_CLAIM_ROUNDS) * remainder * 1.05
    addCall(
      lastEndRound,
      (maxBatchGas / MAX_BATCH_CLAIM_ROUNDS) * remainder * 1.05,
    )
  }

  batch.execute()

  // return txhash of last transaction in the batch
  const txHash = (await Promise.all(calls)).pop()

  return {
    gas: totalGas,
    txHash,
    inputData: {
      ..._args,
      totalRoundsToClaim,
    },
  }
}

/**
 * Submits an unbond transaction
 * @param obj
 * @return {Promise}
 */
export async function unbond(_obj, _args, _ctx) {
  const { amount } = _args
  const gas = await _ctx.livepeer.rpc.estimateGas('BondingManager', 'unbond', [
    amount,
  ])

  const txHash = await _ctx.livepeer.rpc.unbond(amount, {
    ..._ctx.livepeer.config.defaultTx,
    gas,
    returnTxHash: true,
  })

  return {
    gas,
    txHash,
    inputData: {
      ..._args,
    },
  }
}

/**
 * Submits a rebond transaction
 * @param obj
 * @return {Promise}
 */
export async function rebond(_obj, _args, _ctx) {
  const { unbondingLockId } = _args
  const gas = await _ctx.livepeer.rpc.estimateGas('BondingManager', 'rebond', [
    unbondingLockId,
  ])

  const txHash = await _ctx.livepeer.rpc.rebond(unbondingLockId, {
    ..._ctx.livepeer.config.defaultTx,
    gas: gas,
    returnTxHash: true,
  })

  return {
    gas,
    txHash,
    inputData: {
      ..._args,
    },
  }
}

/**
 * Submits a withdrawStake transaction
 * @param obj
 * @return {Promise}
 */
export async function withdrawStake(_obj, _args, _ctx) {
  const { unbondingLockId } = _args

  const gas = await _ctx.livepeer.rpc.estimateGas(
    'BondingManager',
    'withdrawStake',
    [unbondingLockId],
  )

  const txHash = await _ctx.livepeer.rpc.withdrawStake(unbondingLockId, {
    ..._ctx.livepeer.config.defaultTx,
    gas: gas,
    returnTxHash: true,
  })

  return {
    gas,
    txHash,
    inputData: {
      ..._args,
    },
  }
}

/**
 * Submits a withdrawFees transaction
 * @param obj
 * @return {Promise}
 */
export async function withdrawFees(_obj, _args, _ctx) {
  const gas = await _ctx.livepeer.rpc.estimateGas(
    'BondingManager',
    'withdrawFees',
    [],
  )

  const txHash = await _ctx.livepeer.rpc.withdrawFees({
    ..._ctx.livepeer.config.defaultTx,
    gas: gas,
    returnTxHash: true,
  })

  return {
    gas,
    txHash,
    inputData: {
      ..._args,
    },
  }
}

/**
 * Submits a rebondFromUnbonded transaction
 * @param obj
 * @return {Promise}
 */
export async function rebondFromUnbonded(_obj, _args, _ctx) {
  const { delegate, unbondingLockId } = _args

  const gas = await _ctx.livepeer.rpc.estimateGas(
    'BondingManager',
    'rebondFromUnbonded',
    [delegate, unbondingLockId],
  )

  const txHash = await _ctx.livepeer.rpc.rebondFromUnbonded(
    delegate,
    unbondingLockId,
    {
      gas: gas,
      returnTxHash: true,
    },
  )

  return {
    gas,
    txHash,
    inputData: {
      ..._args,
    },
  }
}

/**
 * Submits a round initialization transaction
 * @param obj
 * @return {Promise}
 */
export async function initializeRound(_obj, _args, _ctx) {
  const gas = await _ctx.livepeer.rpc.estimateGas(
    'RoundsManager',
    'initializeRound',
    [],
  )
  const txHash = await _ctx.livepeer.rpc.initializeRound({
    gas,
    returnTxHash: true,
  })

  return {
    gas,
    txHash,
    inputData: {
      ..._args,
    },
  }
}

/**
 * Creates a poll
 * @param obj
 * @return {Promise}
 */
export async function createPoll(_obj, _args, _ctx) {
  const { proposal } = _args
  const gas = await _ctx.livepeer.rpc.estimateGas('PollCreator', 'createPoll', [
    Utils.fromAscii(proposal),
  ])

  const txHash = await _ctx.livepeer.rpc.createPoll(Utils.fromAscii(proposal), {
    ..._ctx.livepeer.config.defaultTx,
    gas,
    returnTxHash: true,
  })

  return {
    gas,
    txHash,
    inputData: {
      ..._args,
    },
  }
}

/**
 * Vote in a poll
 * @param obj
 * @return {Promise}
 */
export async function vote(_obj, _args, _ctx) {
  const { pollAddress, choiceId } = _args
  const gas = await _ctx.livepeer.rpc.estimateGas('Poll', 'vote', [
    pollAddress,
    choiceId,
  ])
  const txHash = await _ctx.livepeer.rpc.vote(pollAddress, choiceId, {
    ..._ctx.livepeer.config.defaultTx,
    returnTxHash: true,
  })

  return {
    gas,
    txHash,
    inputData: {
      ..._args,
    },
  }
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

    await space.public.setMultiple(
      Object.keys(filtered),
      Object.values(filtered),
    )

    return {
      id: address,
      ...filtered,
    }
  } catch (e) {
    // console.error(e)
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
    // console.error(e)
  }
}
