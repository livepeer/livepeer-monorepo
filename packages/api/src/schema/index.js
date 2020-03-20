import { safeLoad as yamlParse } from 'js-yaml'
import { readFileSync } from 'fs'
import path from 'path'
import schema from './schema.json'


console.log(`SCHEMAAAA: ${JSON.stringify(schema.components.schemas['user'])}`)


export default schema
