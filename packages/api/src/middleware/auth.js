import logger from '../logger'
import { OAuth2Client } from 'google-auth-library'
import uuid from 'uuid/v4'

/**
 * generate token middleware
 * @param {object} req req object
 * @param {object} res res object
 * @param {fn} next callback
 */
async function generateUserAndToken(req, res, next) {
  // For the autogen case,
  // we want the token in the database to match up with what they provided in the token field,
  // so id should be req.token.

  const id = req.token
  if (!id) {
    // for now send a 406 if the user doesn't provide any access_token
    res.status(406)
    return res.json({ errors: ['missing auth token'] })
  }

  try {
    const userId = uuid()
    await req.store.create({
      id: userId,
      name: '',
      email: '',
      domain: '',
      kind: 'user',
    })

    await req.store.create({
      id,
      kind: 'apitoken',
      userId: userId,
    })
    const user = await req.store.get(`user/${userId}`)
    req.user = user
  } catch (error) {
    throw error
  }

  req.token = id
  logger.debug(`token = ${id}`)
  return await req.store.get(`apitoken/${id}`)
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
        const user = await getUserWithGoogleAuth(req, res, next)
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
        const user = await getUserWithGoogleAuth(req, res, next)
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
    }

    if (!req || !req.token) {
      // if no apiToken provided, and no google credentials provided, deny access
      console.log("HEREEEE")
      res.status(401)
      return res.json({ errors: ['missing auth token'] })
    }

    logger.info('authFactory params ', params)
    let tokenObject
    // if tokenObject does not exist, create tokenObject and user
    tokenObject = await req.store.get(`apitoken/${req.token}`)

    if (!tokenObject) {
      logger.warn('api Token not found... generating one')
      tokenObject = await generateUserAndToken(req, res, next)
    }

    if (tokenObject && !tokenObject.userId) {
      // if tokenObject exists, but no userId, create user and add userId to tokenObject
      try {
        const userId = uuid()
        await req.store.create({
          id: userId,
          name: '',
          email: '',
          domain: '',
          kind: 'user',
        })

        const newTokenObject = {
          id: tokenObject.id,
          kind: 'apitoken',
          userId: userId,
        }
        await req.store.replace(newTokenObject)
        const user = await req.store.get(`user/${newTokenObject.userId}`)
        req.user = user
      } catch (error) {
        res.status(403)
        return res.json({ errors: [error.toString()] })
      }
    } else if (tokenObject && tokenObject.userId) {
      const user = await req.store.get(`user/${tokenObject.userId}`)
      req.user = user
    }

    return next()
  }
}

async function getUserWithGoogleAuth(req, res, next) {
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
  let user = await req.store.get(`user/${payload.sub}`)

  if (!user) {
    await req.store.create({
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      domain: payload['hd'],
      kind: 'user',
    })
  }

  user = await req.store.get(`user/${payload.sub}`)
  return user
}

// export default router
export default authFactory
