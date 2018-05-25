/** Typedefs */

type GQLContext = {
  livepeer: Object,
}

type JobProfileObj = {
  id: string,
}

/** Resolvers */

/**
 * Gets the id for a JobProfile
 * @param {Object} obj
 * @param {string} obj.id - The id of the broadcaster
 * @return {string}
 */
export function id(obj: JobProfileObj): string {
  return obj.id
}

/**
 * Gets the name for a JobProfile
 * @param {Object} obj
 * @param {string} obj.name - The name of the broadcaster
 * @return {string}
 */
export function name(obj: JobProfileObj): string {
  return obj.name
}

/**
 * Gets the bitrate for a JobProfile
 * @param {Object} obj
 * @param {string} obj.bitrate - The bitrate of the broadcaster
 * @return {string}
 */
export function bitrate(obj: JobProfileObj): string {
  return obj.bitrate
}

/**
 * Gets the framerate for a JobProfile
 * @param {Object} obj
 * @param {string} obj.framerate - The framerate of the broadcaster
 * @return {string}
 */
export function framerate(obj: JobProfileObj): string {
  return obj.framerate
}

/**
 * Gets the resolution for a JobProfile
 * @param {Object} obj
 * @param {string} obj.resolution - The resolution of the broadcaster
 * @return {string}
 */
export function resolution(obj: JobProfileObj): string {
  return obj.resolution
}
