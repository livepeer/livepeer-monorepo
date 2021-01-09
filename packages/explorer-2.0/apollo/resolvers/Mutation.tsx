import { EarningsTree } from '../../lib/earningsTree'
import { utils } from 'ethers'
let earningsSnapshot

if (process.env.NEXT_PUBLIC_NETWORK == 'mainnet') {
  earningsSnapshot = require('../../data/earningsTree')
} else if (process.env.NEXT_PUBLIC_NETWORK == 'rinkeby') {
  earningsSnapshot = require('../../data/earningsTree_rinkeby')
} else {
  earningsSnapshot = ''
}

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

async function encodeClaimSnapshotAndStakingAction(_args, stakingAction, _ctx) {
  const { lastClaimRound, delegator } = _args
  if (!lastClaimRound || lastClaimRound == 0) {
    return null
  }

  const LIP52Round = (await _ctx.livepeer.rpc.getLipUpgradeRound(52)).toNumber()
  if (lastClaimRound > LIP52Round) {
    return null
  }

  // get pendingStake and pendingFees for delegator
  const [pendingStake, pendingFees] = await Promise.all([
    _ctx.livepeer.rpc.getPendingStake(delegator, LIP52Round),
    _ctx.livepeer.rpc.getPendingFees(delegator, LIP52Round),
  ])

  // generate the merkle tree from JSON
  const tree = EarningsTree.fromJSON(earningsSnapshot)
  // generate the proof
  const leaf = utils.defaultAbiCoder.encode(
    ['address', 'uint256', 'uint256'],
    [delegator, pendingStake, pendingFees],
  )

  const proof = tree.getHexProof(leaf)

  if (
    !(await _ctx.livepeer.rpc.verifySnapshot(
      utils.keccak256(utils.toUtf8Bytes('LIP-52')),
      proof,
      utils.keccak256(leaf),
    ))
  )
    return null

  return _ctx.livepeer.rpc.getCalldata(
    'BondingManager',
    'claimSnapshotEarnings',
    [pendingStake, pendingFees, proof, stakingAction],
  )
}

/**
 * Submits a bond transaction for a previously approved amount
 * @param obj
 * @param {string} to - The ETH address of the delegate to bond to
 * @param {string} amount - The approval amount
 * @return {Promise}
 */
export async function bond(_obj, _args, _ctx) {
  const {
    amount,
    to,
    oldDelegateNewPosPrev,
    oldDelegateNewPosNext,
    currDelegateNewPosPrev,
    currDelegateNewPosNext,
  } = _args

  let data = _ctx.livepeer.rpc.getCalldata('BondingManager', 'bond', [
    amount,
    to,
  ])

  const claimData = await encodeClaimSnapshotAndStakingAction(_args, data, _ctx)
  data = claimData ? claimData : data

  const gas = await _ctx.livepeer.rpc.estimateGasRaw({
    ..._ctx.livepeer.config.defaultTx,
    to: _ctx.livepeer.config.contracts['BondingManager'].address,
    data,
  })

  const txHash = await _ctx.livepeer.rpc.sendTransaction({
    ..._ctx.livepeer.config.defaultTx,
    to: _ctx.livepeer.config.contracts['BondingManager'].address,
    data,
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
 * Submits an unbond transaction
 * @param obj
 * @return {Promise}
 */
export async function unbond(_obj, _args, _ctx) {
  const { amount, newPosPrev, newPosNext } = _args

  let data = _ctx.livepeer.rpc.getCalldata('BondingManager', 'unbond', [amount])

  const claimData = await encodeClaimSnapshotAndStakingAction(_args, data, _ctx)
  data = claimData ? claimData : data

  const gas = await _ctx.livepeer.rpc.estimateGasRaw({
    ..._ctx.livepeer.config.defaultTx,
    to: _ctx.livepeer.config.contracts['BondingManager'].address,
    data,
  })

  const txHash = await _ctx.livepeer.rpc.sendTransaction({
    ..._ctx.livepeer.config.defaultTx,
    to: _ctx.livepeer.config.contracts['BondingManager'].address,
    data,
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
  const { unbondingLockId, newPosPrev, newPosNext } = _args

  let data = _ctx.livepeer.rpc.getCalldata('BondingManager', 'rebond', [
    unbondingLockId,
  ])

  const claimData = await encodeClaimSnapshotAndStakingAction(_args, data, _ctx)
  data = claimData ? claimData : data

  const gas = await _ctx.livepeer.rpc.estimateGasRaw({
    ..._ctx.livepeer.config.defaultTx,
    to: _ctx.livepeer.config.contracts['BondingManager'].address,
    data,
  })

  const txHash = await _ctx.livepeer.rpc.sendTransaction({
    ..._ctx.livepeer.config.defaultTx,
    to: _ctx.livepeer.config.contracts['BondingManager'].address,
    data,
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
  let data = _ctx.livepeer.rpc.getCalldata('BondingManager', 'withdrawFees', [])

  const claimData = await encodeClaimSnapshotAndStakingAction(_args, data, _ctx)
  data = claimData ? claimData : data

  const gas = await _ctx.livepeer.rpc.estimateGasRaw({
    ..._ctx.livepeer.config.defaultTx,
    to: _ctx.livepeer.config.contracts['BondingManager'].address,
    data,
  })

  const txHash = await _ctx.livepeer.rpc.sendTransaction({
    ..._ctx.livepeer.config.defaultTx,
    to: _ctx.livepeer.config.contracts['BondingManager'].address,
    data,
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
  const { delegate, unbondingLockId, newPosPrev, newPosNext } = _args

  let data = _ctx.livepeer.rpc.getCalldata(
    'BondingManager',
    'rebondFromUnbondedWithHint',
    [delegate, unbondingLockId, newPosPrev, newPosNext],
  )

  const claimData = await encodeClaimSnapshotAndStakingAction(_args, data, _ctx)
  data = claimData ? claimData : data

  const gas = await _ctx.livepeer.rpc.estimateGasRaw({
    ..._ctx.livepeer.config.defaultTx,
    to: _ctx.livepeer.config.contracts['BondingManager'].address,
    data,
  })

  const txHash = await _ctx.livepeer.rpc.sendTransaction({
    ..._ctx.livepeer.config.defaultTx,
    to: _ctx.livepeer.config.contracts['BondingManager'].address,
    data,
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
  const Utils = require('web3-utils')
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
  const gas = await _ctx.livepeer.rpc.estimateGas('Poll', 'vote', [choiceId])
  const txHash = await _ctx.livepeer.rpc.vote(pollAddress, choiceId, {
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
 * Update's a user's 3box space
 * @param obj
 * @return {Promise}
 */
export async function updateProfile(_obj, _args, _ctx) {
  const address = _ctx.address.toLowerCase()
  const box = _ctx.box
  const space = await box.openSpace('livepeer')

  if (_args.proof) {
    await box.linkAddress({
      proof: _args.proof,
    })
  }

  const allowed = ['name', 'website', 'description', 'image', 'defaultProfile']
  const filtered = Object.keys(_args)
    .filter((key) => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = _args[key]
      return obj
    }, {})

  await space.public.setMultiple(Object.keys(filtered), Object.values(filtered))

  return {
    id: address,
    ...filtered,
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
  await box.removeAddressLink(address)
}
