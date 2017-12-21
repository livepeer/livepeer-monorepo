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
        name: 'Broadcaster',
        possibleTypes: [
          {
            name: 'BasicBroadcaster',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Delegator',
        possibleTypes: [
          {
            name: 'BasicDelegator',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Transcoder',
        possibleTypes: [
          {
            name: 'BasicTranscoder',
          },
        ],
      },
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

export default function createSchema({
  livepeer,
  streamRoot = 'http://www.streambox.fr/playlists/x36xhzz/',
} = {}) {
  const resolvers = createResolvers({
    livepeer,
  })
  const { constants, rpc, utils } = livepeer

  /**
   * This implements the following type system shorthand:
   *   interface Broadcaster {
   *     id: String!
   *     type: String!
   *     deposit: String!
   *     withdrawBlock: String!
   *     jobs: [Job]
   *   }
   */
  const Broadcaster = new GraphQLInterfaceType({
    name: 'Broadcaster',
    description: 'Someone who creates jobs on the protocol',
    resolveType: resolvers.Broadcaster.type,
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The ETH address of the broadcaster',
      },
      type: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The type of Broadcaster',
      },
      deposit: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The amount of LPT the broadcaster has deposited',
      },
      withdrawBlock: {
        type: new GraphQLNonNull(GraphQLString),
        description:
          'The earliest block at which the broadcaster may withdraw deposited LPT',
      },
      jobs: {
        type: new GraphQLNonNull(new GraphQLList(Job)),
        description: 'Jobs associated with this broadcaster',
        args: {
          dead: {
            description:
              'Whether to include Jobs that are not considered "live"',
            type: GraphQLBoolean,
            defaultValue: false,
          },
          streamRootUrl: {
            description: 'The root url for hosted .m3u8 streams',
            type: GraphQLString,
            defaultValue: DEFAULT_STREAM_ROOT,
          },
        },
      },
    }),
  })

  /**
   * This implements the following type system shorthand:
   *   type BasicBroadcaster : Broadcaster {
   *     id: String!
   *     type: String!
   *     deposit: String!
   *     withdrawBlock: String!
   *     jobs: [Job]
   *   }
   */
  const BasicBroadcaster = new GraphQLObjectType({
    name: 'BasicBroadcaster',
    description: 'Someone who creates jobs on the protocol',
    interfaces: [Broadcaster],
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The ETH address of the broadcaster',
      },
      type: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The type of Delegator. Always "BasicBroadcaster"',
        resolve: () => 'BasicBroadcaster',
      },
      deposit: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The amount of LPT the broadcaster has deposited',
      },
      withdrawBlock: {
        type: new GraphQLNonNull(GraphQLString),
        description:
          'The earliest block at which the broadcaster may withdraw deposited LPT',
      },
      jobs: {
        type: new GraphQLNonNull(new GraphQLList(Job)),
        description: 'Jobs associated with this broadcaster',
        args: {
          dead: {
            description:
              'Whether to include Jobs that are not considered "live"',
            type: GraphQLBoolean,
            defaultValue: false,
          },
          streamRootUrl: {
            description: 'The root url for hosted .m3u8 streams',
            type: GraphQLString,
            defaultValue: DEFAULT_STREAM_ROOT,
          },
        },
        resolve: resolvers.Broadcaster.fields.jobs,
      },
    }),
  })

  /**
   * @todo
   * This implements the following type system shorthand:
   *   type ClaimStatus {
   *     id: String!
   *     values: {
   *       Pending
   *       Slashed
   *       Complete
   *     }
   *   }
   */
  // ...

  /**
   * @todo
   * This implements the following type system shorthand:
   *   interface Claim {
   *     id: Int!
   *   }
   */
  // ...

  /**
   * This implements the following type system shorthand:
   *   type DelegatorStatus {
   *     id: String!
   *     values: {
   *       Pending
   *       Bonded
   *       Unbonding
   *       Unbonded
   *     }
   *   }
   */
  const DelegatorStatus = new GraphQLEnumType({
    name: 'DelegatorStatus',
    description: 'Potential Delegator statuses',
    values: constants.DELEGATOR_STATUS.reduce(
      (acc, value) => ({
        ...acc,
        [value]: { value },
      }),
      {},
    ),
  })

  /**
   * This implements the following type system shorthand:
   *   interface Delegator {
   *     id: String!
   *     type: String!
   *     status: String!
   *     stake: String!
   *     bondedAmount: String!
   *     unbondedAmount: String!
   *     delegateAddress: String!
   *     delegatedAmount: String!
   *     lastClaimRound: String!
   *     startRound: String!
   *     withdrawRound: String!
   *     delegate: Account
   *   }
   */
  const Delegator = new GraphQLInterfaceType({
    name: 'Delegator',
    description:
      'A account who gains stake in the network by bonding LPT to another account',
    resolveType: resolvers.Delegator.type,
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The ETH address of the delgator',
      },
      type: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The type of Delegator',
      },
      status: {
        type: new GraphQLNonNull(DelegatorStatus),
        description: 'The status of the delegator',
      },
      stake: {
        type: new GraphQLNonNull(GraphQLString),
        description:
          'The bonded stake for a delegator (adds rewards from the rounds during which the delegator was bonded to a transcoder)',
      },
      bondedAmount: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The amount of LPT the delegator has bonded',
      },
      unbondedAmount: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The total amount of LPT that the delegator has claimed',
      },
      delegateAddress: {
        type: new GraphQLNonNull(GraphQLString),
        description:
          'The ETH address of the transcoder the delegator has bonded to',
      },
      delegatedAmount: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The total amount of tokens delegated to the delegator',
      },
      lastClaimRound: {
        type: new GraphQLNonNull(GraphQLString),
        description:
          'The last round that the delegator claimed reward and fee pool shares',
      },
      startRound: {
        type: new GraphQLNonNull(GraphQLString),
        description:
          'The round the delegator becomes bonded and delegated to its delegate',
      },
      withdrawRound: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The round the delegator can withdraw their stake',
      },
      delegate: {
        type: new GraphQLNonNull(Account),
        description: 'The account to which this delegator has bonded',
      },
    }),
  })

  /**
   * This implements the following type system shorthand:
   *   type BasicDelegator : Delegator {
   *     id: String!
   *     type: String!
   *     status: String!
   *     stake: String!
   *     bondedAmount: String!
   *     unbondedAmount: String!
   *     delegateAddress: String!
   *     delegatedAmount: String!
   *     lastClaimRound: String!
   *     startRound: String!
   *     withdrawRound: String!
   *     delegate: Delegator
   *   }
   */
  const BasicDelegator = new GraphQLObjectType({
    name: 'BasicDelegator',
    description:
      'A account who gains stake in the network by bonding LPT to another account',
    interfaces: [Delegator],
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The ETH address of the delgator',
      },
      type: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The type of Delegator. Always "BasicDelegator"',
        resolve: () => 'BasicDelegator',
      },
      status: {
        type: new GraphQLNonNull(DelegatorStatus),
        description: 'The status of the delegator',
      },
      stake: {
        type: new GraphQLNonNull(GraphQLString),
        description:
          'The bonded stake for a delegator (adds rewards from the rounds during which the delegator was bonded to a transcoder)',
      },
      bondedAmount: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The amount of LPT the delegator has bonded',
      },
      unbondedAmount: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The total amount of LPT that the delegator has claimed',
      },
      delegateAddress: {
        type: new GraphQLNonNull(GraphQLString),
        description:
          'The ETH address of the transcoder the delegator has bonded to',
      },
      delegatedAmount: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The total amount of tokens delegated to the delegator',
      },
      lastClaimRound: {
        type: new GraphQLNonNull(GraphQLString),
        description:
          'The last round that the delegator claimed reward and fee pool shares',
      },
      startRound: {
        type: new GraphQLNonNull(GraphQLString),
        description:
          'The round the delegator becomes bonded and delegated to its delegate',
      },
      withdrawRound: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The round the delegator can withdraw their stake',
      },
      delegate: {
        type: new GraphQLNonNull(Account),
        description: 'The account to which this delegator has bonded',
        resolve: resolvers.Delegator.fields.delegate,
      },
    }),
  })

  /**
   * @todo
   * This implements the following type system shorthand:
   *   interface RoundsInfo {
   *     id: String!
   *     currentRound: String!
   *     currentRoundInitialized: Boolean!
   *     currentRoundStartBlock: String!
   *     lastInitializedRound: String!
   *     roundLength: String!
   *   }
   */
  // const RoundsInfo = new GraphQLInterfaceType({
  //   name: 'RoundsInfo',
  //   description: '...',
  //   fields: () => ({
  //     // ...
  //   })
  // })

  /**
   * @todo
   * This implements the following type system shorthand:
   *   interface TokenPool {
   *     id: String! # addr + roundNumber ?
   *     rewardPool: String!
   *     feePool: String!
   *     totalStake: String!
   *     usedStake: String!
   *   }
   */
  // const TokenPool = new GraphQLInterfaceType({
  //   name: 'TokenPool',
  //   description: '...',
  //   fields: () => ({
  //     // ...
  //   })
  // })

  /**
   * This implements the following type system shorthand:
   *   type TranscoderStatus {
   *     id: String!
   *     values: {
   *       NotRegistered
   *       Registered
   *       Resigned
   *     }
   *   }
   */
  const TranscoderStatus = new GraphQLEnumType({
    name: 'TranscoderStatus',
    description: 'Potential Transcoder statuses',
    values: constants.TRANSCODER_STATUS.reduce(
      (acc, value) => ({
        ...acc,
        [value]: { value },
      }),
      {},
    ),
  })

  /**
   * @todo
   * This implements the following type system shorthand:
   *   interface Transcoder {
   *     id: String!
   *     type: String!
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
   *     # delegators: [Delegator]
   *   }
   */
  const Transcoder = new GraphQLInterfaceType({
    name: 'Transcoder',
    description:
      'Someone who transcodes Jobs submitted by Broadcasters into various VideoProfiles',
    resolveType: resolvers.Transcoder.type,
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The Transcoder id',
      },
      type: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
      active: {
        type: new GraphQLNonNull(GraphQLBoolean),
        description: '...',
      },
      status: {
        type: new GraphQLNonNull(TranscoderStatus),
        description: '...',
      },
      lastRewardRound: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
      blockRewardCut: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
      feeShare: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
      pricePerSegment: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
      pendingBlockRewardCut: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
      pendingFeeShare: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
      pendingPricePerSegment: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
    }),
  })

  /**
   * @todo
   * This implements the following type system shorthand:
   *   type BasicTranscoder : Transcoder {
   *     id: String!
   *     type: String!
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
   *     # delegators: [Delegator]
   *   }
   */
  const BasicTranscoder = new GraphQLObjectType({
    name: 'BasicTranscoder',
    description:
      'Someone who transcodes Jobs submitted by Broadcasters into various VideoProfiles',
    interfaces: [Transcoder],
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The Transcoder id',
      },
      type: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
        resolve: () => 'BasicTranscoder',
      },
      active: {
        type: new GraphQLNonNull(GraphQLBoolean),
        description: '...',
      },
      status: {
        type: new GraphQLNonNull(TranscoderStatus),
        description: '...',
      },
      lastRewardRound: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
      blockRewardCut: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
      feeShare: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
      pricePerSegment: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
      pendingBlockRewardCut: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
      pendingFeeShare: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
      pendingPricePerSegment: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
    }),
  })

  /**
   * @todo
   * This implements the following type system shorthand:
   *   interface Account {
   *     id: string!
   *     ethBalance: String!
   *     tokenBalance: String!
   *     broadcaster: Broadcaster!
   *     delegator: Delegator!
   *     transcoder: Transcoder!
   *   }
   */
  const Account = new GraphQLInterfaceType({
    name: 'Account',
    description: 'A Livepeer Account',
    resolveType: resolvers.Account.type,
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The Account id (ETH account address)',
      },
      type: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
      },
      ethBalance: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
        resolve: resolvers.Account.fields.ethBalance,
      },
      tokenBalance: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
        resolve: resolvers.Account.fields.tokenBalance,
      },
      broadcaster: {
        type: new GraphQLNonNull(Broadcaster),
        description: '...',
      },
      delegator: {
        type: new GraphQLNonNull(Delegator),
        description: '...',
      },
      transcoder: {
        type: new GraphQLNonNull(Transcoder),
        description: '...',
      },
    }),
  })

  /**
   * @todo
   * This implements the following type system shorthand:
   *   type BasicAccount : Account {
   *     id: string!
   *     ethBalance: String!
   *     tokenBalance: String!
   *     broadcaster: Broadcaster!
   *     delegator: Delegator!
   *     transcoder: Transcoder!
   *   }
   */
  const BasicAccount = new GraphQLObjectType({
    name: 'BasicAccount',
    description: 'A Livepeer Account',
    interfaces: [Account],
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The Account id (ETH account address)',
      },
      type: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
        resolve: () => 'BasicAccount',
      },
      ethBalance: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
        resolve: resolvers.Account.fields.ethBalance,
      },
      tokenBalance: {
        type: new GraphQLNonNull(GraphQLString),
        description: '...',
        resolve: resolvers.Account.fields.tokenBalance,
      },
      broadcaster: {
        type: new GraphQLNonNull(Broadcaster),
        description: '...',
        resolve: resolvers.Account.fields.broadcaster,
      },
      delegator: {
        type: new GraphQLNonNull(Delegator),
        description: '...',
        resolve: resolvers.Account.fields.delegator,
      },
      transcoder: {
        type: new GraphQLNonNull(Transcoder),
        description: '...',
        resolve: resolvers.Account.fields.transcoder,
      },
    }),
  })

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
    resolveType: resolvers.Job.type,
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
    interfaces: [Job],
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        description: 'The id of the job',
      },
      type: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The type of job. Always "TestJob"',
        resolve: () => 'TestJob',
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
    }),
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
    interfaces: [Job],
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLInt),
        description: 'The id of the job',
      },
      type: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'The type of job. Always "VideoJob"',
        resolve: () => 'VideoJob',
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
      // custom fields
      live: {
        type: new GraphQLNonNull(GraphQLBoolean),
        description: 'Whether the job is currently available to stream',
        resolve: resolvers.VideoJob.fields.live,
      },
      url: {
        type: new GraphQLNonNull(GraphQLString),
        description:
          'The url the transcoded .m3u8 stream can be requested from',
        resolve: resolvers.VideoJob.fields.url,
      },
    }),
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
      broadcaster: {
        type: Broadcaster,
        args: {
          id: {
            description: 'The ETH address of the Broadcaster',
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: resolvers.Query.fields.broadcaster,
      },
      // @TODO - broadcasters(...)
      delegator: {
        type: Delegator,
        args: {
          id: {
            description: 'The ETH address of the Delegator',
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: resolvers.Query.fields.delegator,
      },
      // @TODO - delegators(...)
      job: {
        type: Job,
        args: {
          id: {
            description: 'The id of the Job',
            type: new GraphQLNonNull(GraphQLInt),
          },
          streamRootUrl: {
            description: 'The root url for hosted .m3u8 streams',
            type: GraphQLString,
            defaultValue: DEFAULT_STREAM_ROOT,
          },
        },
        resolve: resolvers.Query.fields.job,
      },
      jobs: {
        type: new GraphQLNonNull(new GraphQLList(Job)),
        args: {
          dead: {
            description:
              'Whether to include Jobs that are not considered "live"',
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
      transcoder: {
        type: Transcoder,
        args: {
          id: {
            description: 'The ETH address of the Transcoder',
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: resolvers.Query.fields.transcoder,
      },
      // @TODO - transcoders(...)
      account: {
        type: Account,
        args: {
          id: {
            description: 'The ETH address of the Account',
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: resolvers.Query.fields.account,
      },
      // @TODO - accounts(...)
    }),
  })

  /**
   * Our Schema :)
   */
  return new GraphQLSchema({
    query: Query,
    types: [
      BasicBroadcaster,
      BasicDelegator,
      BasicTranscoder,
      BasicAccount,
      DelegatorStatus,
      VideoProfile,
      VideoJob,
      TestJob,
      TranscoderStatus,
    ],
  })
}

const transformJob = ({ jobId, streamId, transcodingOptions, broadcaster }) => {
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
        broadcaster: async (broadcaster, { id }) => {
          const { address, ...data } = await livepeer.rpc.getBroadcaster(id)
          return {
            ...broadcaster,
            ...data,
            id,
          }
        },
        delegator: async (delegator, { id }) => {
          const { address, ...data } = await livepeer.rpc.getDelegator(id)
          return {
            ...delegator,
            ...data,
            id,
          }
        },
        job: async (_, { id, dead, streamRootUrl }) => {
          const job = transformJob(await livepeer.rpc.getJob(id))
          const url = resolvers.VideoJob.fields.url(job, { streamRootUrl })
          const live = resolvers.VideoJob.fields.live(
            { ...job, url },
            { streamRootUrl },
          )
          return {
            ...job,
            live,
            url,
          }
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
        transcoder: async (transcoder, { id }) => {
          const { address, ...data } = await livepeer.rpc.getTranscoder(id)
          return {
            ...transcoder,
            ...data,
            id,
          }
        },
        account: async (account, params) => params,
      },
    },
    Broadcaster: {
      type: x => 'BasicBroadcaster',
      fields: {
        jobs: ({ id }, filters) => {
          return resolvers.Query.fields.jobs(
            {},
            {
              ...filters,
              broadcaster: id,
            },
          )
        },
      },
    },
    Delegator: {
      type: x => 'BasicDelegator',
      fields: {
        delegate: ({ delegateAddress }, params) => {
          return resolvers.Query.fields.account(null, {
            id: delegateAddress,
            ...params,
          })
        },
      },
    },
    Job: {
      type: x => x.type,
    },
    Transcoder: {
      type: x => 'BasicTranscoder',
    },
    Account: {
      type: x => 'BasicAccount',
      fields: {
        ethBalance: ({ id }) => {
          return livepeer.rpc.getEthBalance(id)
        },
        tokenBalance: ({ id }) => {
          return livepeer.rpc.getTokenBalance(id)
        },
        broadcaster: ({ id }, params) => {
          return resolvers.Query.fields.broadcaster(null, { id, ...params })
        },
        delegator: ({ id }, params) => {
          return resolvers.Query.fields.delegator(null, { id, ...params })
        },
        transcoder: ({ id }, params) => {
          return resolvers.Query.fields.transcoder(null, { id, ...params })
        },
      },
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
            const res = await throwAfter(
              fetch(videoUrl, { timeout: 3000 }),
              3000,
            )
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
