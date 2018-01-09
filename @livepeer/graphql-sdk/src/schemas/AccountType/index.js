import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql'
import Account from '../Account'
import Broadcaster from '../Broadcaster'
import Delegator from '../Delegator'
import Transcoder from '../Transcoder'
import * as resolvers from '../Account/resolvers'

/**
 * This implements the following type system shorthand:
 *   type AccountType implements Account {
 *     id: string!
 *     ethBalance: String!
 *     tokenBalance: String!
 *     broadcaster: Broadcaster!
 *     delegator: Delegator!
 *     transcoder: Transcoder!
 *   }
 */
export default new GraphQLObjectType({
  interfaces: [Account],
  name: 'AccountType',
  description: 'A Livepeer Account',
  isTypeOf: (/* value, info */) => true,
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The Account id (ETH account address)',
      resolve: resolvers.id,
    },
    ethBalance: {
      type: new GraphQLNonNull(GraphQLString),
      description: '...',
      resolve: resolvers.ethBalance,
    },
    tokenBalance: {
      type: new GraphQLNonNull(GraphQLString),
      description: '...',
      resolve: resolvers.tokenBalance,
    },
    broadcaster: {
      type: new GraphQLNonNull(Broadcaster),
      description: '...',
      resolve: resolvers.broadcaster,
    },
    delegator: {
      type: new GraphQLNonNull(Delegator),
      description: '...',
      resolve: resolvers.delegator,
    },
    transcoder: {
      type: new GraphQLNonNull(Transcoder),
      description: '...',
      resolve: resolvers.transcoder,
    },
  }),
})
