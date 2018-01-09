import {
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import Job from '../Job'
import * as resolvers from './resolvers'

/**
 * This implements the following type system shorthand:
 *   interface Broadcaster {
 *     id: String!
 *     deposit: String!
 *     withdrawBlock: String!
 *     jobs: [Job!]!
 *   }
 */
export default new GraphQLInterfaceType({
  name: 'Broadcaster',
  description: 'Someone who creates jobs on the protocol',
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
