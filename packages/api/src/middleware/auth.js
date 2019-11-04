import logger from '../logger'
import { OAuth2Client } from 'google-auth-library'

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

  await req.store.create({
    id: id,
    name: '',
    email: '',
    domain: '',
    kind: 'user',
  })

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
      // if admin credentials required, use google auth to validate admin access
      try {
        const user = await getUserWithGoogleAUth(req, res, next)
        req.user = user
        if (
          user &&
          'domain' in user &&
          user.domain === req.config.trustedDomain
        ) {
          req.user = user
          return next()
        } else {
          res.status(403)
          return res.json({
            errors: [`not ${req.config.trustedDomain} email address`],
          })
        }
      } catch (error) {
        res.status(403)
        return res.json({ errors: ['not logged in', error.toString()] })
      }
    } else if (
      req.headers.authorization &&
      !req.headers.authorization.startsWith('Bearer')
    ) {
      // if admin credentials not required, but apiToken not provided, use google auth to allow admins to access
      try {
        const user = await getUserWithGoogleAUth(req, res, next)
        req.user = user
        if (
          user &&
          'domain' in user &&
          user.domain === req.config.trustedDomain
        ) {
          return next()
        }
      } catch (error) {
        res.status(403)
        return res.json({ errors: ['not logged in', error.toString()] })
      }
    } else if (req.token) {
      // if apiToken provided, get or create user with apiToken as user `id`
      try {
        const user = await getUserWithApiToken(req)
        req.user = user
      } catch (error) {
        res.status(403)
        return res.json({ errors: [error.toString()] })
      }
    }

    if (!req || !req.token) {
      // if no apiToken provided, and no google credentials provided, deny access
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

async function getUserWithApiToken(req) {
  var user
  try {
    user = await req.store.get(`user/${req.token}`)
  } catch (error) {
    if (error.type !== 'NotFoundError') {
      console.error(error)
      throw error
    }
  }
  if (!user) {
    await req.store.create({
      id: req.token,
      name: '',
      email: '',
      domain: '',
      kind: 'user',
    })
    user = await req.store.get(`user/${req.token}`)
  }
  return user
}

async function getUserWithGoogleAUth(req, res, next) {
  var googleAuthToken = req.headers.authorization
  if (googleAuthToken) {
    req.googleAuthToken = googleAuthToken
  } else {
    return null
  }
  const clientId = req.config.clientId
  const oauthServer = new OAuth2Client(clientId)

  try {
    var ticket = await oauthServer.verifyIdToken({
      idToken: googleAuthToken,
      audience: clientId,
    })
  } catch (e) {
    throw new Error('invalid oauth token')
  }
  const payload = ticket.getPayload()
  var user
  try {
    user = await req.store.get(`user/${payload.sub}`)
  } catch (error) {
    if (error.type !== 'NotFoundError') {
      console.error(error)
      throw error
    }
    await req.store.create({
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      domain: payload['hd'],
      kind: 'user',
    })
  }

  return user
}

// export default router
export default authFactory
