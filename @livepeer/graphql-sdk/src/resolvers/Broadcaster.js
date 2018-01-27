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

// /**
//  * Resolves types for the Broadcaster interface
//  * @param {Object} obj
//  * @param {string} obj.type - The type of the Broadcaster
//  */
// export function __resolveType(obj: BroadcasterObj): Boolean {
//   return obj.type || 'BroadcasterType'
// }

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
