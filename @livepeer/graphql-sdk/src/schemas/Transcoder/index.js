import {
  GraphQLBoolean,
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import TranscoderStatus from '../TranscoderStatus'
import * as resolvers from './resolvers'

/**
 * This implements the following type system shorthand:
 *   interface Transcoder {
 *     id: String!
 *     active: Boolean!
 *     status: TranscoderStatus!
 *     lastRewardRound: String!
 *     blockRewardCut: String!
 *     feeShare: String!
 *     pricePerSegment: String!
 *     pendingBlockRewardCut: String!
 *     pendingFeeShare: String!
 *     pendingPricePerSegment: String!
 *     # tokenPoolsPerRound: [TokenPool]
 *   }
 */
export default new GraphQLInterfaceType({
  name: 'Transcoder',
  description:
    'Someone who transcodes Jobs submitted by Broadcasters into various VideoProfiles',
  // resolveType: resolvers.type,
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The Transcoder id',
      resolve: resolvers.id,
    },
    status: {
      type: new GraphQLNonNull(TranscoderStatus),
      description: '...',
      resolve: resolvers.status,
    },
    active: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: '...',
      resolve: resolvers.active,
    },
    lastRewardRound: {
      type: new GraphQLNonNull(GraphQLString),
      description: '...',
      resolve: resolvers.lastRewardRound,
    },
    blockRewardCut: {
      type: new GraphQLNonNull(GraphQLString),
      description: '...',
      resolve: resolvers.blockRewardCut,
    },
    feeShare: {
      type: new GraphQLNonNull(GraphQLString),
      description: '...',
      resolve: resolvers.feeShare,
    },
    pricePerSegment: {
      type: new GraphQLNonNull(GraphQLString),
      description: '...',
      resolve: resolvers.pricePerSegment,
    },
    pendingBlockRewardCut: {
      type: new GraphQLNonNull(GraphQLString),
      description: '...',
      resolve: resolvers.pendingBlockRewardCut,
    },
    pendingFeeShare: {
      type: new GraphQLNonNull(GraphQLString),
      description: '...',
      resolve: resolvers.pendingFeeShare,
    },
    pendingPricePerSegment: {
      type: new GraphQLNonNull(GraphQLString),
      description: '...',
      resolve: resolvers.pendingPricePerSegment,
    },
  }),
})
