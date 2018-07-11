import { jobs as resolveJobs } from './Query'

/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
}

type BroadcasterObj = {
  id: string,
}

type BroadcasterJobsArgs = {
  skip?: number,
  limit?: number,
}

/** Resolvers */

/**
 * Gets the id for a Broadcaster
 * @param {Object} obj
 * @param {string} obj.id - The id of the broadcaster
 * @return {string}
 */
export function id(obj: BroadcasterObj): string {
  return obj.id
}

/**
 * Gets the ENS name for a Broadcaster
 * @param {Object} obj
 * @param {string} obj.id - The id of the broadcaster
 */
export async function ensName(obj: BroadcasterObj, args, ctx): string {
  const { id } = obj
  return await ctx.livepeer.rpc.getENSName(id)
}

/**
 * Gets the deposit for a Broadcaster
 * @param {Object} obj
 * @param {string} obj.deposit - The deposit of the broadcaster
 * @return {string}
 */
export function deposit(obj: BroadcasterObj): string {
  return obj.deposit
}

/**
 * Gets the withdrawBlock for a Broadcaster
 * @param {Object} obj
 * @param {string} obj.withdrawBlock - The withdrawBlock of the broadcaster
 * @return {string}
 */
export function withdrawBlock(obj: BroadcasterObj): string {
  return obj.withdrawBlock
}

/**
 * Gets Jobs for a Broadcaster
 * @param {Object} obj
 * @param {string} obj.id - The id of the broadcaster
 * @param {Object} args
 * @param {number} [args.skip=0] - The number of Jobs to skip
 * @param {number} [args.limit=100] - The max number onf Jobs to return
 * @param {Object} ctx
 * @return {Array<Job>}
 */
export function jobs(
  obj: BroadcasterObj,
  args: BroadcasterJobsArgs,
  ctx: GQLContext,
): Array<Job> {
  const { id } = obj
  const nextArgs = {
    ...args,
    broadcaster: id,
  }
  return resolveJobs({}, nextArgs, ctx)
}
