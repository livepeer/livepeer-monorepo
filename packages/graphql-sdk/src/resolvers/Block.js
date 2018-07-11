/** Typedefs */

type GQLContext = {
  livepeer: Object,
  account?: string,
}

type BlockObj = {}

/** Resolvers */

/**
 * Gets the id for a Block
 * @param {Object} obj
 * @param {string} obj.id - The block number
 * @return {string}
 */
export function id(obj: BlockObj): string {
  return obj.id
}
