import {
  broadcaster as resolveBroadcaster,
  delegator as resolveDelegator,
  transcoder as resolveTranscoder,
  unbondlocks as resolveUnbondLocks,
  unbondlock as resolveUnbondLock,
} from './Query'

/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
}

type AccountObj = {
  id: string,
  ensName?: string,
}

/** Resolvers */

/**
 * Gets the id for an Account
 * @param {Object} obj
 * @param {string} obj.id - The id of the broadcaster
 * @return {string}
 */
export async function id(obj: AccountObj, args, ctx): string {
  return obj.id
}

/**
 * Gets the ENS name for an Account
 * @param {string} obj.ensName - The ENS name
 */
export async function ensName(obj: AccountObj, args, ctx): string {
  const { id, ensName } = obj
  return ensName || (await ctx.livepeer.rpc.getENSName(id))
}

/**
 * Gets the ETH balance for an Account
 * @param {Object} obj
 * @param {string} obj.ethBalance - The ethBalance of the broadcaster
 * @return {string}
 */
export async function ethBalance(obj: AccountObj, args, ctx): string {
  const { id } = obj
  return await ctx.livepeer.rpc.getEthBalance(id)
}

/**
 * Gets the LPT balance for an Account
 * @param {Object} obj
 * @param {string} obj.tokenBalance - The tokenBalance of the broadcaster
 * @return {string}
 */
export async function tokenBalance(obj: AccountObj, args, ctx): string {
  const { id } = obj
  return await ctx.livepeer.rpc.getTokenBalance(id)
}

/**
 * Gets Broadcaster for a Account
 * @param {Object} obj
 * @param {string} obj.id - The id of the broadcaster
 * @param {Object} args
 * @param {Object} ctx
 * @return {Broadcaster}
 */
export function broadcaster(
  obj: AccountObj,
  args: AccountBroadcasterArgs,
  ctx: GQLContext,
): Broadcaster {
  return resolveBroadcaster({}, { id: obj.id }, ctx)
}

/**
 * Gets Delegator for a Account
 * @param {Object} obj
 * @param {string} obj.id - The id of the delegator
 * @param {Object} args
 * @param {Object} ctx
 * @return {Delegator}
 */
export function delegator(
  obj: AccountObj,
  args: AccountDelegatorArgs,
  ctx: GQLContext,
): Delegator {
  return resolveDelegator({}, { id: obj.id }, ctx)
}

/**
 * Gets Transcoder for a Account
 * @param {Object} obj
 * @param {string} obj.id - The id of the transcoder
 * @param {Object} args
 * @param {Object} ctx
 * @return {Transcoder}
 */
export function transcoder(
  obj: AccountObj,
  args: AccountTranscoderArgs,
  ctx: GQLContext,
): Transcoder {
  return resolveTranscoder({}, { id: obj.id }, ctx)
}

/**
 * Gets unbonding locks by ETH address
 * @param {QueryObj} obj
 * @param {QueryUnbondingLockArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {Array<UnbondingLock>}
 */
export async function unbondlocks(
  obj: AccountObj,
  args: QueryUnbondingLockArgs,
  ctx: GQLContext,
): Array<UnbondingLock> {
  return resolveUnbondLocks({}, { id: obj.id }, ctx)
}

/**
 * Gets unbonding lock by ETH address and Id
 * @param {QueryObj} obj
 * @param {QueryUnbondingLockArgs} args
 * @param {string} args.id - ETH address
 * @param {GQLContext} ctx
 * @return {UnbondingLock}
 */
export async function unbondlock(
  obj: AccountObj,
  args: QueryUnbondingLockArgs,
  ctx: GQLContext,
): UnbondingLock {
  const { id } = obj
  const { lockId } = args
  return resolveUnbondLock({}, { id, lockId }, ctx)
}
