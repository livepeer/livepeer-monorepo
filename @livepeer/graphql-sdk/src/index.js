import {
  graphql,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'
import Url from 'url'
import fetch from 'node-fetch'

export const introspectionQueryResultData = {
  __schema: {
    types: [
      {
        kind: 'INTERFACE',
        name: 'Job',
        possibleTypes: [
          {
            name: 'VideoJob',
          },
          {
            name: 'TestJob',
          },
        ],
      },
    ],
  },
}

const DEFAULT_STREAM_ROOT = 'http://streams.livepeer.org'

export default function createSchema(
  { livepeer, streamRoot = 'http://www.streambox.fr/playlists/x36xhzz/' } = {},
) {
  const resolvers = createResolvers({
    livepeer,
  })
  const { constants, rpc, utils } = livepeer
  /**
   * This implements the following type system shorthand:
   *   type VideoProfile {
   *     name: String!
   *     bitrate: String!
   *     framerate: Int!
   *     resolution: String!
   *   }
   */
  const VideoProfile = new GraphQLObjectType({
    name: 'VideoProfile',
    description: 'A video transcoding profile',
    fields: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The video profile id',
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The video profile name',
      },
      bitrate: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The video profile bitrate',
      },
      framerate: {
        type: new GraphQLNonNull(GraphQLInt),
        description: 'The video profile framerate',
      },
      resolution: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The video profile resolution',
      },
    },
  })
  /**
   * This implements the following type system shorthand:
   *   interface Job {
   *     id: Int!
   *     broadcaster: String!
   *     profiles: [VideoProfile]
   *     stream: String
   *     type: String!
   *   }
   */
  const Job = new GraphQLInterfaceType({
    name: 'Job',
    description:
      'A video broadcasting job that has been issued on the protocol',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        description: 'The id of the job',
      },
      broadcaster: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The ETH address of the job broadcaster',
      },
      profiles: {
        type: new GraphQLNonNull(new GraphQLList(VideoProfile)),
        description: 'Which video profiles are associated with this job',
      },
      stream: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The stream id of the job',
      },
      type: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The type of job',
      },
    }),
    resolveType: resolvers.Job.type,
  })
  /**
   * This implements the following type system shorthand:
   *   type TestJob : Job {
   *     id: Int!
   *     broadcaster: String!
   *     profiles: [VideoProfile]
   *     stream: String
   *     type: String!
   *   }
   */
  const TestJob = new GraphQLObjectType({
    name: 'TestJob',
    description: 'A video broadcasting job without any transcoding profiles',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        description: 'The id of the job',
      },
      broadcaster: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The ETH address of the job broadcaster',
      },
      profiles: {
        type: new GraphQLNonNull(new GraphQLList(VideoProfile)),
        description: 'Which video profiles are associated with this job',
      },
      stream: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The stream id of the job',
      },
      type: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The type of job. Always "TestJob"',
      },
    }),
    interfaces: [Job],
  })
  /**
   * This implements the following type system shorthand:
   *   type VideoJob : Job {
   *     id: Int!
   *     broadcaster: String!
   *     profiles: [VideoProfile]
   *     stream: String
   *     type: String!
   *     # custom fields
   *     live: Boolean!
   *     url: String!
   *   }
   */
  const VideoJob = new GraphQLObjectType({
    name: 'VideoJob',
    description: 'A video broadcasting job',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        description: 'The id of the job',
      },
      broadcaster: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The ETH address of the job broadcaster',
      },
      profiles: {
        type: new GraphQLNonNull(new GraphQLList(VideoProfile)),
        description: 'Which video profiles are associated with this job',
      },
      stream: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The stream id of the job',
      },
      type: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The type of job. Always "VideoJob"',
      },
      // custom fields
      live: {
        type: new GraphQLNonNull(GraphQLBoolean),
        description: 'Whether the job is currently available to stream',
        args: {
          streamRootUrl: {
            description: 'The root url of the job .m3u8 stream',
            type: GraphQLString,
            defaultValue: DEFAULT_STREAM_ROOT,
          },
        },
        resolve: resolvers.VideoJob.fields.live,
      },
      url: {
        type: new GraphQLNonNull(GraphQLString),
        description:
          'The url the transcoded .m3u8 stream can be requested from',
        args: {
          streamRootUrl: {
            description: 'The root url of the job .m3u8 stream',
            type: GraphQLString,
            defaultValue: DEFAULT_STREAM_ROOT,
          },
        },
        resolve: resolvers.VideoJob.fields.url,
      },
    }),
    interfaces: [Job],
  })
  /**
   * This is the type that will be the root of our query, and the
   * entry point into our schema.
   *
   * This implements the following type system shorthand:
   *   type Query {
   *     job(id: Int!): Job
   *     # jobs(live: Boolean, to: Int, from: Int, blocksAgo: Int, broadcaster: String): [Job]!
   *   }
   */
  const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      job: {
        type: Job,
        args: {
          id: {
            description: 'The id of the job',
            type: new GraphQLNonNull(GraphQLInt),
          },
        },
        resolve: resolvers.Query.fields.job,
      },
      jobs: {
        type: new GraphQLNonNull(new GraphQLList(Job)),
        args: {
          dead: {
            description:
              'Whether to include jobs that are not considered "live"',
            type: GraphQLBoolean,
            defaultValue: false,
          },
          streamRootUrl: {
            description: 'The root url for hosted .m3u8 streams',
            type: GraphQLString,
            defaultValue: DEFAULT_STREAM_ROOT,
          },
          broadcaster: {
            description: 'The stream broadcaster ETH address',
            type: GraphQLString,
          },
          broadcasterWhereJobId: {
            description:
              'Looks up the broadcaster of the given job and finds all jobs where the broadcaster address matches',
            type: GraphQLInt,
          },
        },
        resolve: resolvers.Query.fields.jobs,
      },
    }),
  })
  /**
   * Our Schema :)
   */
  return new GraphQLSchema({
    query: Query,
    types: [VideoJob, TestJob, VideoProfile],
  })
}

const transformJob = ({
  jobId,
  streamId,
  transcodingOptions,
  broadcaster,
}) => {
  return {
    type: transcodingOptions.length ? 'VideoJob' : 'TestJob',
    id: jobId,
    broadcaster,
    profiles: transcodingOptions.map(({ hash, ...profile }) => ({
      id: hash,
      ...profile,
    })),
    stream: streamId,
  }
}
const throwAfter = (p, ms) =>
  new Promise((res, rej) => {
    let ok = false
    let failed = false
    setTimeout(() => {
      if (ok) return
      failed = true
      rej(new Error('Took too long'))
    }, ms)
    p.then(x => {
      if (failed) return
      ok = true
      res(x)
    })
  })
export const createResolvers = ({ livepeer }) => {
  const DEAD_JOBS = new Set()
  const resolvers = {
    Query: {
      fields: {
        job: async (job, { id }) => {
          return transformJob(await livepeer.rpc.getJob(id))
        },
        jobs: async (
          obj,
          { dead, streamRootUrl, broadcasterWhereJobId, ...filters },
        ) => {
          try {
            const results = broadcasterWhereJobId
              ? // get broadcaster address from job and filter by it
                await livepeer.rpc.getJobs({
                  broadcaster: (await livepeer.rpc.getJob(
                    broadcasterWhereJobId,
                  )).broadcaster,
                  ...filters,
                })
              : // get jobs with passed filters directly
                await livepeer.rpc.getJobs(filters)
            const jobs = await Promise.all(
              results.map(transformJob).map(async job => {
                const isTest = job.type === 'TestJob'
                return {
                  ...job,
                  live: isTest
                    ? false
                    : await resolvers.VideoJob.fields.live(job, {
                        streamRootUrl,
                      }),
                  url: await resolvers.VideoJob.fields.url(job, {
                    streamRootUrl,
                  }),
                }
              }),
            )
            return dead ? jobs : jobs.filter(x => x.live === true)
          } catch (err) {
            console.log('FAIL', err)
            return []
          }
        },
      },
    },
    Job: {
      type: x => x.type,
    },
    VideoJob: {
      fields: {
        live: async ({ id, live, stream, url }, { streamRootUrl }) => {
          if ('boolean' === typeof live) return live // already defined
          try {
            // If a job was previously found to be dead, it won't go live again
            // @TODO: double-check that this logic makes sense
            if (DEAD_JOBS.has(id)) return false
            // Otherwise, we have to request the stream and wait for fail/success
            const videoUrl = resolvers.VideoJob.fields.url(
              { stream, url },
              { streamRootUrl },
            )
            const res = await throwAfter(fetch(videoUrl, { timeout: 3000 }), 3000)
            return res.status === 200
          } catch (err) {
            console.log('ERROR', err)
            DEAD_JOBS.add(id) // cache dead job ids
            return false
          }
        },
        url: ({ stream, url }, { streamRootUrl }) => {
          if ('string' === typeof url) return url // already defined
          return Url.resolve(streamRootUrl || '', `${stream}.m3u8`)
        },
      },
    },
  }
  return resolvers
}
