import { GraphQLSchema } from 'graphql'
import * as queries from './queries'

export { default as schema } from './schemas'
export { queries }
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
