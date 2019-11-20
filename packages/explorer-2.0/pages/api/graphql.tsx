import { ApolloServer } from 'apollo-server-micro'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'
import LivepeerSDK from '@adamsoffer/livepeer-sdk'
import {
  mergeSchemas,
  introspectSchema,
  makeRemoteExecutableSchema,
} from 'graphql-tools'
import Cors from 'micro-cors'
import schema from '../../apollo'

const cors = Cors()
const subgraphEndpoint =
  'https://api.thegraph.com/subgraphs/name/livepeer/livepeer'
const threeBoxEndpoint = 'https://api.3box.io/graph'

const createSchema = async () => {
  const subgraphServiceLink = new HttpLink({
    uri: subgraphEndpoint,
    fetch,
  })

  const threeBoxServiceLink = new HttpLink({
    uri: threeBoxEndpoint,
    fetch,
  })

  const changefeedServiceLink = new HttpLink({
    uri: 'https://changefeed.app/graphql',
    fetch,
    headers: {
      Authorization: `Bearer ${process.env.CHANGEFEED_ACCESS_TOKEN}`,
    },
  })

  const createSubgraphServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(subgraphServiceLink),
      link: subgraphServiceLink,
    })
    return executableSchema
  }

  const create3BoxServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(threeBoxServiceLink),
      link: threeBoxServiceLink,
    })
    return executableSchema
  }

  const createChangefeedServiceSchema = async () => {
    const executableSchema = makeRemoteExecutableSchema({
      schema: await introspectSchema(changefeedServiceLink),
      link: changefeedServiceLink,
    })
    return executableSchema
  }

  const subgraphSchema = await createSubgraphServiceSchema()
  const threeBoxSchema = await create3BoxServiceSchema()
  const changefeedSchema = await createChangefeedServiceSchema()
  const linkTypeDefs = `
    extend type Profile {
      transcoder: Transcoder
    }
    extend type Transcoder {
      profile: Profile
    }
    extend type Delegator {
      pendingStake: String
      tokenBalance: String
      ethBalance: String
    }
  `

  const merged = mergeSchemas({
    schemas: [
      subgraphSchema,
      threeBoxSchema,
      changefeedSchema,
      schema,
      linkTypeDefs,
    ],
    resolvers: {
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

export const config = {
  api: {
    bodyParser: false,
  },
}

const runHandler = (request, context, handler) =>
  new Promise((resolve, reject) => {
    const callback = (error, body) => (error ? reject(error) : resolve(body))

    handler(context, request, callback)
  })

const run = async (context, request) => {
  const schema = await createSchema()
  const apolloServer = new ApolloServer({
    schema,
    introspection: true,
    playground: true,
  })
  const handler = apolloServer.createHandler({ path: '/api/graphql' })
  const response = await runHandler(request, context, handler)
  return response
}

export default cors(run)
