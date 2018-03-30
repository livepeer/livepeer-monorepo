require('babel-polyfill')
const express = require('express')
const graphqlHTTP = require('express-graphql')
const createSchema = require('./main').default
const livepeer = require('./main/mock-sdk.js').default
const LivepeerSchema = createSchema({ livepeer })
const app = express()

app.use(
  '/',
  graphqlHTTP(req => ({
    schema: LivepeerSchema,
    graphiql: true,
  })),
)

app.listen(4000, () => {
  console.log('GraphiQL server running at http://localhost:4000')
})
