import { makeExecutableSchema } from 'graphql-tools'
import GraphQLJSON from 'graphql-type-json'
import types from './types'
import resolvers from './resolvers'

const SchemaDef = `
schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
`

export default makeExecutableSchema({
  typeDefs: [SchemaDef, ...types],
  resolvers: { ...resolvers, JSON: GraphQLJSON },
})
