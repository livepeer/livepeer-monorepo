/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
}

type JobObj = {
  id: string,
}

/** Resolvers */

// /**
//  * Resolves types for the Job interface
//  * @param {Object} obj
//  * @param {string} obj.type - The type of the Job
//  */
// export function __resolveType(obj: JobObj): Boolean {
//   return obj.type || 'JobType'
// }

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
