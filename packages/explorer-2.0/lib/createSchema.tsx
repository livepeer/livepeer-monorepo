import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import LivepeerSDK from '@adamsoffer/livepeer-sdk'
import schema from '../apollo'
import {
  mergeSchemas,
  introspectSchema,
  makeRemoteExecutableSchema,
} from 'graphql-tools'

const subgraphEndpoint =
  'https://api.thegraph.com/subgraphs/name/livepeer/livepeer'
const isProd = process.env.NODE_ENV === 'production'

const graphqlAPI = isProd
  ? 'https://explorer.livepeer.org/api/graphql'
  : 'http://localhost:3009/api/graphql'

export default async () => {
  const subgraphServiceLink = new HttpLink({
    uri: subgraphEndpoint,
    fetch,
  })

  const graphqlAPIServiceLink = new HttpLink({
    uri: graphqlAPI,
    fetch,
  })

  const createSubgraphServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(subgraphServiceLink),
      link: subgraphServiceLink,
    })
    return executableSchema
  }

  const createGraphqlAPIServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(graphqlAPIServiceLink),
      link: graphqlAPIServiceLink,
    })
    return executableSchema
  }

  const subgraphSchema = await createSubgraphServiceSchema()
  const graphqlAPISchema = await createGraphqlAPIServiceSchema()
  const linkTypeDefs = `
    extend type Transcoder {
      threeBoxSpace: ThreeBoxSpace
    }
    extend type ThreeBoxSpace {
      transcoder: Transcoder
    }
    extend type Delegator {
      pendingStake: String
      tokenBalance: String
      ethBalance: String
    }
  `

  const merged = mergeSchemas({
    schemas: [subgraphSchema, schema, graphqlAPISchema, linkTypeDefs],
    resolvers: {
      Transcoder: {
        threeBoxSpace: {
          async resolve(_obj, _args, _context, _info) {
            const threeBoxSpace = await _info.mergeInfo.delegateToSchema({
              schema: schema,
              operation: 'query',
              fieldName: 'threeBoxSpace',
              args: {
                id: _obj.id,
              },
              context: _context,
              info: _info,
            })
            return threeBoxSpace
          },
        },
      },
      Delegator: {
        pendingStake: {
          async resolve(_delegator, _args, _context, _info) {
            const { rpc } = await LivepeerSDK({ gas: 2.1 * 1000000 })
            const { pendingStake } = await rpc.getDelegator(_delegator.id)
            return pendingStake
          },
        },
        tokenBalance: {
          async resolve(_delegator, _args, _context, _info) {
            const { rpc } = await LivepeerSDK({ gas: 2.1 * 1000000 })
            return await rpc.getTokenBalance(_delegator.id)
          },
        },
        ethBalance: {
          async resolve(_delegator, _args, _context, _info) {
            const { rpc } = await LivepeerSDK({ gas: 2.1 * 1000000 })
            return await rpc.getEthBalance(_delegator.id)
          },
        },
      },
    },
  })

  return merged
}
