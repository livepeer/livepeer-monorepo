import { makeExecutableSchema } from 'graphql-tools'
import types from './types'
import resolvers from './resolvers'

const SchemaDef = `
schema {
  query: Query
  mutation: Mutation
}
`

export default makeExecutableSchema({
  typeDefs: [SchemaDef, ...types],
  resolvers,
})
