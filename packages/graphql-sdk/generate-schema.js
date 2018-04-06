const fs = require('fs')
const { promisify } = require('util')
const { graphql, introspectionQuery } = require('graphql')
const schema = require('./lib/schema').default
const writeFile = promisify(fs.writeFile)
;(async () => {
  const res = await graphql(schema, introspectionQuery, null, {}, {})
  await writeFile('schema.json', JSON.stringify(res, null, 2), 'utf8')
})()
