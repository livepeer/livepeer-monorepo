/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
}

type JobObj = {
  id: string,
}

/** Resolvers */

/**
 * Gets the id for a Job
 * @param {Object} obj
 * @param {string} obj.id - The id of the Job
 * @return {string}
 */
export function id(obj: JobObj): string {
  return obj.id
}

/**
 * Gets the broadcaster for a Job
 * @param {Object} obj
 * @param {string} obj.broadcaster - The broadcaster of the broadcaster
 * @return {string}
 */
export function broadcaster(obj: JobObj): string {
  return obj.broadcaster
}

/**
 * Gets the ENS name for a Job's broadcaster
 * @param {Object} obj
 * @param {string} obj.id - The id of the broadcaster
 */
export async function broadcasterENSName(
  obj: BroadcasterObj,
  args,
  ctx,
): string {
  const { broadcaster } = obj
  return await ctx.livepeer.rpc.getENSName(broadcaster)
}

/**
 * Gets the profiles for a Job
 * @param {Object} obj
 * @param {string} obj.profiles - The profiles of the profiles
 * @return {string}
 */
export function profiles(obj: JobObj): string {
  return obj.profiles
}

/**
 * Gets the streamId for a Job
 * @param {Object} obj
 * @param {string} obj.streamId - The streamId of the streamId
 * @return {string}
 */
export function streamId(obj: JobObj): string {
  return obj.streamId
}
