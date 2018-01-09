import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import Broadcaster from '../Broadcaster'
import Job from '../Job'
import * as resolvers from '../Broadcaster/resolvers'

/**
 * This implements the following type system shorthand:
 *   type BroadcasterType implements Broadcaster {
 *     id: String!
 *     deposit: String!
 *     withdrawBlock: String!
 *     jobs: [Job!]!
 *   }
 */
export default new GraphQLObjectType({
  interfaces: [Broadcaster],
  name: 'BroadcasterType',
  description: 'Someone who creates jobs on the protocol',
  isTypeOf: (/* value, info */) => true,
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The ETH address of the broadcaster',
      resolve: resolvers.id,
    },
    deposit: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The amount of LPT the broadcaster has deposited',
      resolve: resolvers.deposit,
    },
    withdrawBlock: {
      type: new GraphQLNonNull(GraphQLString),
      description:
        'The earliest block at which the broadcaster may withdraw deposited LPT',
      resolve: resolvers.withdrawBlock,
    },
    jobs: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Job))),
      description: 'Jobs associated with this broadcaster',
      resolve: resolvers.jobs,
      args: {
        limit: {
          type: GraphQLInt,
          description: 'Maximum number of jobs to return',
          defaultValue: 100,
        },
        skip: {
          type: GraphQLInt,
          description: 'Number of jobs to skip',
          defaultValue: 0,
        },
      },
    },
  }),
})
