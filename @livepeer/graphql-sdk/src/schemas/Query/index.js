import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import Account from '../Account'
import Broadcaster from '../Broadcaster'
import Delegator from '../Delegator'
import Transcoder from '../Transcoder'
import Job from '../Job'
import * as resolvers from './resolvers'

/**
 * This implements the following type system shorthand:
 *   type Query {
 *     account(id: String!): Account
 *     broadcaster(id: String!): Broadcaster
 *     delegator(id: String!): Delegator
 *     job(id: String!): Job
 *     jobs(broadcaster: String, skip: Int, limit: Int): [Job]!
 *     transcoder(id: String!): Transcoder
 *   }
 */
export default new GraphQLObjectType({
  name: 'Query',
  description:
    'Represents all possible entry points into the Livepeer GraphQL API',
  fields: () => ({
    account: {
      type: Account,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The ETH address of the Account',
        },
      },
      resolve: resolvers.account,
    },
    // @TODO - accounts(...)
    // accounts: {
    //   type: new GraphQLNonNull(new GraphQLList(Account)),
    //   args: {}
    //   resolve: resolvers.accounts
    // },
    broadcaster: {
      type: Broadcaster,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The ETH address of the Broadcaster',
        },
      },
      resolve: resolvers.broadcaster,
    },
    // @TODO - broadcasters(...)
    // broadcasters: {
    //   type: new GraphQLNonNull(new GraphQLList(Broadcaster)),
    //   args: {}
    //   resolve: resolvers.broadcasters
    // },
    delegator: {
      type: Delegator,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The ETH address of the Delegator',
        },
      },
      resolve: resolvers.delegator,
    },
    // @TODO - delegators(...)
    // delegators: {
    //   type: new GraphQLNonNull(new GraphQLList(Delegator)),
    //   args: {}
    //   resolve: resolvers.delegators
    // },
    job: {
      type: Job,
      args: {
        id: {
          description: 'The id of the Job',
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: resolvers.job,
    },
    jobs: {
      type: new GraphQLNonNull(new GraphQLList(Job)),
      args: {
        broadcaster: {
          type: GraphQLString,
          description: 'The stream broadcaster ETH address',
        },
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
      resolve: resolvers.jobs,
    },
    transcoder: {
      type: Transcoder,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'The ETH address of the Transcoder',
        },
      },
      resolve: resolvers.transcoder,
    },
    // @TODO - transcoders(...)
    // transcoders: {
    //   type: new GraphQLNonNull(new GraphQLList(Transcoder)),
    //   args: {}
    //   resolve: resolvers.transcoders
    // },
  }),
})
