import {
  broadcaster as resolveBroadcaster,
  delegator as resolveDelegator,
  transcoder as resolveTranscoder,
} from '../Query/resolvers'

/** Typedefs */

type GQLContext = {
  livepeer: Object,
  resolvers: {
    // ...
  },
}

type AccountObj = {
  id: string,
}

/** Resolvers */

/**
 * Gets the id for an Account
 * @param {Object} obj
 * @param {string} obj.id - The id of the broadcaster
 * @return {string}
 */
export function id(obj: AccountObj): string {
  return obj.id
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
