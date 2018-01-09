import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql'
import Job from '../Job'
import JobProfileType from '../JobProfileType'
import * as resolvers from '../Job/resolvers'

/**
 * This implements the following type system shorthand:
 *   type JobType implements Job {
 *     id: String!
 *     broadcaster: String!
 *     profiles: [JobProfileType]!
 *     streamId: String!
 *   }
 */
export default new GraphQLObjectType({
  interfaces: [Job],
  name: 'JobType',
  description: 'A video broadcasting job that has been issued on the protocol',
  isTypeOf: (/* value, info */) => true,
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
