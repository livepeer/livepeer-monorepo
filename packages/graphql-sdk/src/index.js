import { GraphQLSchema } from 'graphql'
import * as queries from './queries'
import * as utils from './utils'

export { default as schema } from './schema'
export { queries, utils }
export const introspectionQueryResultData = {
  __schema: {
    types: [
      {
        kind: 'INTERFACE',
        name: 'Account',
        possibleTypes: [
          {
            name: 'AccountType',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Broadcaster',
        possibleTypes: [
          {
            name: 'BroadcasterType',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Delegator',
        possibleTypes: [
          {
            name: 'DelegatorType',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Transcoder',
        possibleTypes: [
          {
            name: 'TranscoderType',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Job',
        possibleTypes: [
          {
            name: 'JobType',
          },
        ],
      },
    ],
  },
}
