require('babel-polyfill')
const express = require('express')
const graphqlHTTP = require('express-graphql')
const { schema } = require('./main')
const livepeer = require('./main/mock-sdk.js').default
const app = express()

app.use(
  '/',
  graphqlHTTP(req => ({
    schema,
    context: { livepeer },
    graphiql: true,
  })),
)

app.listen(4000, () => {
  console.log('GraphiQL server running at http://localhost:4000')
})
