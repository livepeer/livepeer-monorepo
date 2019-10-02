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
    if (params.admin === true) {
      try {
        const user = await getUser(req, res, next)
        if (user.domain === req.trustedDomain) {
          req.user = user
          return next()
        } else {
          res.status(403)
          return res.json({
            errors: ['not livepeer.org email address'],
          })
        }
      } catch (error) {
        console.error(error)
        res.status(403)
        return res.json({ errors: ['not logged in'] })
      }
    }

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

async function getUser(req, res, next) {
  var lpToken = req.headers.lptoken
  if (lpToken != null) {
    req.lpToken = lpToken
  } else {
    lpToken = req.lpToken
  }
  let clientId = req.clientId
  let { OAuth2Client } = require('google-auth-library')
  let client = new OAuth2Client(clientId)
  let ticket = await client.verifyIdToken({
    idToken: lpToken,
    audience: clientId,
  })
  let payload = ticket.getPayload()

  var user
  try {
    user = await req.store.get(`user/${payload.sub}`)
  } catch (error) {
    if (error.type !== 'NotFoundError') {
      throw error
    }
    await req.store.create({
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      domain: payload['hd'], // this doesn't always exist!!!
      kind: 'user',
    })
    user = await req.store.get(`user/${payload.sub}`)
  }

  return user
}

// export default router
export default authFactory

// // TODO: add tests ... do a failure test here ... try to make req without appropriate header. 403 back. stream.test.js
// // fix the broken tests!
