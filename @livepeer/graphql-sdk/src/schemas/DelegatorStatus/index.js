import { GraphQLEnumType } from 'graphql'
import { DELEGATOR_STATUS } from '@livepeer/sdk'

/**
 * This implements the following type system shorthand:
 *   type DelegatorStatus {
 *     values: {
 *       Pending
 *       Bonded
 *       Unbonding
 *       Unbonded
 *     }
 *   }
 */
export default new GraphQLEnumType({
  name: 'DelegatorStatus',
  description: 'Potential Delegator statuses',
  values: DELEGATOR_STATUS.reduce(
    (acc, value) => ({
      ...acc,
      [value]: { value },
    }),
    {},
  ),
})
