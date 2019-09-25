import logger from '../logger'

/**
 * generate token middleware
 * @param {object} req req object
 * @param {object} res res object
 * @param {fn} next callback
 */
async function generateToken(req, res, next) {
  // For the autogen case,
  // we want the token in the database to match up with what they provided in the token field,
  // so id should be req.token.

  const id = req.token
  if (!id) {
    // for now send a 406 if the user doesn't provide any access_token
    return res.sendStatus(406)
  }

  let resp = await req.store.create({
    id,
    kind: 'apitoken',
  })

  req.token = id
  logger.debug(`token = ${id}`)
  return next()
}

/**
 * creates an authentication middleware that can be customized.
 * @param {Object} params auth middleware params, to be defined later
 */
function authFactory(params) {
  return async (req, res, next) => {
    if (!req || !req.token) {
      return res.sendStatus(401)
    }
    logger.info('authFactory params ', params)
    let resp
    try {
      // check token against token DB
      resp = await req.store.get(`apitoken/${req.token}`)
    } catch (e) {
      if (e.type !== 'NotFoundError') {
        throw e
      }

      logger.warn('api Token not found... generating one')
      return await generateToken(req, res, next)
    }

    return next()
  }
}

// export default router
export default authFactory
