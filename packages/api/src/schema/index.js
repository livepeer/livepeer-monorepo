import { safeLoad as yamlParse } from 'js-yaml'
import { readFileSync } from 'fs'
import path from 'path'
import schema from './schema.json'

// const schemaString = readFileSync(
// path.resolve(__dirname, 'schema.yaml'),
// 'utf8',
// )

// const schema = yamlParse(schemaString)

export default schema

// to json file, import with js
// build process to convert to json
// take yaml change to js file that contains yaml in it, but in line converts with safeLoad
// no loading files, opening sockets, etc.
// no CLI args, no environment variables ... architectural
