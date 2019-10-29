import { makeExecutableSchema } from 'graphql-tools'
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json'
import typeDefs from './types'
import resolvers from './resolvers'

export default makeExecutableSchema({
  typeDefs,
  resolvers: {
    ...resolvers,
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
  },
})
