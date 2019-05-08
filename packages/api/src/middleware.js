import schema from './schema'
import Ajv from 'ajv'
import { schemaWalk } from '@cloudflare/json-schema-walker'

const ajv = new Ajv()

export const validatePost = name => {
  // Generate a new version of the schema with all readOnly properties not required
  const postSchema = JSON.parse(
    JSON.stringify(schema.components.schemas.ingress),
  )
  schemaWalk(postSchema, node => {
    if (node.type !== 'object') {
      return
    }
    const oldRequired = node.required
    node.required = oldRequired.filter(key => {
      if (node.properties[key].readOnly === true) {
        delete node.properties[key]
        return false
      }
      return true
    })
  })
  const validate = ajv.compile(postSchema)
  return (req, res, next) => {
    const { body } = req
    if (!validate(body)) {
      res.status(422)
      return res.json({
        errors: validate.errors.map(({ message }) => message),
      })
    }
    next()
  }
}
