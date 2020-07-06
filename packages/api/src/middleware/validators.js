// import { schemaWalk } from '@cloudflare/json-schema-walker'
import validators from '../schema/validators'

export const validatePost = (name) => {
  const validate = validators[name]
  if (!validate) {
    throw new Error(`no validator found for ${name}`)
  }

  return (req, res, next) => {
    const { body } = req
    if (!validate(body)) {
      res.status(422)
      return res.json({
        errors: validate.errors.map((err) => JSON.stringify(err)),
      })
    }
    next()
  }

  // Enforcement of required read-only properties, currently unused

  // Generate a new version of the schema with all readOnly properties not required
  // const postSchema = JSON.parse(JSON.stringify(schema.components.schemas[name]))
  // schemaWalk(postSchema, node => {
  //   if (node.type !== 'object') {
  //     return
  //   }
  //   const oldRequired = node.required
  //   if (!oldRequired) {
  //     return
  //   }
  //   node.required = oldRequired.filter(key => {
  //     if (node.properties && node.properties[key].readOnly === true) {
  //       delete node.properties[key]
  //       return false
  //     }
  //     return true
  //   })
  // })
}

// Unused, should be rethought.

// export const validatePut = name => {
//   // Set up AJV validator that stores data on first validation then validates
//   // that it matches on the second validation.
//   const ajv = new Ajv()
//   let cache = {}
//   let first = true
//   ajv.removeKeyword('readOnly')
//   ajv.addKeyword('readOnly', {
//     validate: function(schema, data, parentSchema, path) {
//       if (first) {
//         cache[path] = data
//       } else {
//         if (data !== cache[path]) {
//           return false
//         }
//       }
//       return true
//     },
//   })
//   const validate = ajv.compile(schema.components.schemas[name])
//   return async (req, res, next) => {
//     const data = req.body

//     if (data.id !== `${name}/${req.params.id}`) {
//       res.status(409)
//       return res.json({ errors: ['id in URL and body must match'] })
//     }

//     // Cache the read-only values in the old data
//     const oldData = await req.store.get(data.id)

//     first = true
//     cache = {}
//     if (!validate(oldData)) {
//       throw new Error(
//         `Invalid code path, ${
//           data.id
//         } in the DB fails validation: ${JSON.stringify(validate.errors)}`,
//       )
//     }

//     first = false

//     if (!validate(data)) {
//       res.status(422)
//       return res.json({
//         errors: validate.errors.map(err => JSON.stringify(err)),
//       })
//     }

//     next()
//   }
// }
