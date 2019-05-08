import { safeLoad as yamlParse } from 'js-yaml'
import fs from 'fs-extra'
import path from 'path'

const schemaString = fs.readFileSync(
  path.resolve(__dirname, 'schema.yaml'),
  'utf8',
)
const schema = yamlParse(schemaString)

export default schema
