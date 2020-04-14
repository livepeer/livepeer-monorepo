import Ajv from 'ajv'
import pack from 'ajv-pack'
import { safeLoad as parseYaml } from 'js-yaml'
import fs from 'fs-extra'
import path from 'path'
import { compile as generateTypes } from 'json-schema-to-typescript'

const write = (dir, data) => {
  fs.writeFileSync(dir, data, 'utf8')
  console.log(`wrote ${dir}`)
}

const schemaDir = path.resolve(__dirname, 'schema')
const validatorDir = path.resolve(schemaDir, 'validators')
fs.ensureDirSync(validatorDir)

const schemaStr = fs.readFileSync(
  path.resolve(schemaDir, 'schema.yaml'),
  'utf8',
)
const data = parseYaml(schemaStr)
write(path.resolve(schemaDir, 'schema.json'), JSON.stringify(data, null, 2))
const ajv = new Ajv({ sourceCode: true })

const index = []
const types = []

;(async () => {
  for (const [name, schema] of Object.entries(data.components.schemas)) {
    schema.title = name
    const type = await generateTypes(schema)
    types.push(type)
    var validate = ajv.compile(schema)
    var moduleCode = pack(ajv, validate)
    const outPath = path.resolve(validatorDir, `${name}.js`)
    write(outPath, moduleCode)
    index.push(`export {default as ${name}} from './${name}.js'`)
  }

  const indexStr = index.join('\n')
  const indexPath = path.resolve(validatorDir, 'index.js')
  write(indexPath, indexStr)

  const typeStr = types.join('\n')
  const typePath = path.resolve(schemaDir, 'types.d.ts')
  write(typePath, typeStr)
})()
