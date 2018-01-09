import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import * as resolvers from './resolvers'

/**
 * This implements the following type system shorthand:
 *   type JobProfileType {
 *     name: String!
 *     bitrate: String!
 *     framerate: Int!
 *     resolution: String!
 *   }
 */
export default new GraphQLObjectType({
  name: 'JobProfileType',
  description: 'A job transcoding profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The job profile id',
      resolve: resolvers.id,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The job profile name',
      resolve: resolvers.name,
    },
    bitrate: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The job profile bitrate',
      resolve: resolvers.bitrate,
    },
    framerate: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The job profile framerate',
      resolve: resolvers.framerate,
    },
    resolution: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The job profile resolution',
      resolve: resolvers.resolution,
    },
  }),
})
