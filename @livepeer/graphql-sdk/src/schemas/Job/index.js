import {
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'
import JobProfileType from '../JobProfileType'
import * as resolvers from './resolvers'

/**
 * This implements the following type system shorthand:
 *   interface Job {
 *     id: String!
 *     broadcaster: String!
 *     profiles: [JobProfileType!]!
 *     streamId: String!
 *   }
 */
export default new GraphQLInterfaceType({
  name: 'Job',
  description: 'A video broadcasting job that has been issued on the protocol',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The id of the job',
      resolve: resolvers.id,
    },
    broadcaster: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The ETH address of the job broadcaster',
      resolve: resolvers.broadcaster,
    },
    profiles: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(JobProfileType)),
      ),
      description: 'Which video profiles are associated with this job',
      resolve: resolvers.profiles,
    },
    streamId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The stream id of the job',
      resolve: resolvers.streamId,
    },
  }),
})
