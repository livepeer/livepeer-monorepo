import { GraphQLEnumType } from 'graphql'
import { TRANSCODER_STATUS } from '@livepeer/sdk'

/**
 * This implements the following type system shorthand:
 *   type TranscoderStatus {
 *     id: String!
 *     values: {
 *       NotRegistered
 *       Registered
 *       Resigned
 *     }
 *   }
 */
const TranscoderStatus = new GraphQLEnumType({
  name: 'TranscoderStatus',
  description: 'Potential Transcoder statuses',
  values: TRANSCODER_STATUS.reduce(
    (acc, value) => ({
      ...acc,
      [value]: { value },
    }),
    {},
  ),
})

export default TranscoderStatus