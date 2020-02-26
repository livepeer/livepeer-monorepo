import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import schema from '../apollo'
import {
  mergeSchemas,
  introspectSchema,
  makeRemoteExecutableSchema,
} from 'graphql-tools'
import { detectNetwork } from './utils'

const SUBGRAPH_MAINNET =
  'https://api.thegraph.com/subgraphs/name/livepeer/livepeer'

const SUBGRAPH_RINKEBY =
  'https://api.thegraph.com/subgraphs/name/adamsoffer/livepeer-rinkeby'

export default async () => {
  const network = await detectNetwork(window['web3']?.currentProvider)
  const subgraphServiceLink = new HttpLink({
    uri: network?.type === 'rinkeby' ? SUBGRAPH_RINKEBY : SUBGRAPH_MAINNET,
    fetch,
  })

  const createSubgraphServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(subgraphServiceLink),
      link: subgraphServiceLink,
    })
    return executableSchema
  }

  const subgraphSchema = await createSubgraphServiceSchema()

  const linkTypeDefs = `
    extend type Transcoder {
      threeBoxSpace: ThreeBoxSpace
    }
    extend type ThreeBoxSpace {
      transcoder: Transcoder
    }
    extend type Delegator {
      pendingStake: String
      pendingFees: String
      tokenBalance: String
      ethBalance: String
    }
  `

  const merged = mergeSchemas({
    schemas: [subgraphSchema, schema, linkTypeDefs],
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
            const delegator = await _context.livepeer.rpc.getDelegator(
              _delegator.id,
            )
            return delegator.pendingStake
          },
        },
        pendingFees: {
          async resolve(_delegator, _args, _context, _info) {
            const delegator = await _context.livepeer.rpc.getDelegator(
              _delegator.id,
            )
            return delegator.pendingFees
          },
        },
        tokenBalance: {
          async resolve(_delegator, _args, _context, _info) {
            return await _context.livepeer.rpc.getTokenBalance(_delegator.id)
          },
        },
        ethBalance: {
          async resolve(_delegator, _args, _context, _info) {
            return await _context.livepeer.rpc.getEthBalance(_delegator.id)
          },
        },
      },
    },
  })

  return merged
}
