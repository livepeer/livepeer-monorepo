import Ajv from 'ajv'
import pack from 'ajv-pack'
import { safeLoad as parseYaml } from 'js-yaml'
import fs from 'fs-extra'
import path from 'path'

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

for (const [name, schema] of Object.entries(data.components.schemas)) {
  var validate = ajv.compile(schema)
  var moduleCode = pack(ajv, validate)
  const outPath = path.resolve(validatorDir, `${name}.js`)
  write(outPath, moduleCode)
  index.push(`export {default as ${name}} from './${name}.js'`)
}

const indexStr = index.join('\n')
const indexPath = path.resolve(validatorDir, 'index.js')
write(indexPath, indexStr, 'utf8')

// var validate = ajv.compile(schema)
// var moduleCode = pack(ajv, validate)

// // now you can
// // 1. write module code to file
// var fs = require('fs')
// var path = require('path')
// fs.writeFileSync(path.join(__dirname, '/validate.js'), moduleCode)

// // 2. require module from string
// var requireFromString = require('require-from-string')
// var packedValidate = requireFromString(moduleCode)

// export const validatePost = name => {
//   const ajv = new Ajv({ sourceCode: true })

//   // Generate a new version of the schema with all readOnly properties not required
//   const postSchema = JSON.parse(JSON.stringify(schema.components.schemas[name]))
//   schemaWalk(postSchema, node => {
//     if (node.type !== 'object') {
//       return
//     }
//     const oldRequired = node.required
//     if (!oldRequired) {
//       return
//     }
//     node.required = oldRequired.filter(key => {
//       if (node.properties && node.properties[key].readOnly === true) {
//         delete node.properties[key]
//         return false
//       }
//       return true
//     })
//   })
//   const validate = ajv.compile(postSchema)
//   return (req, res, next) => {
//     const { body } = req
//     if (!validate(body)) {
//       res.status(422)
//       return res.json({
//         errors: validate.errors.map(err => JSON.stringify(err)),
//       })
//     }
//     next()
//   }
// }
