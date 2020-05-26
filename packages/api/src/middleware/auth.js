import { InternalServerError, ForbiddenError } from '../store/errors'
import jwt from 'jsonwebtoken'
import tracking from './tracking'

/**
 * creates an authentication middleware that can be customized.
 * @param {Object} params auth middleware params, to be defined later
 */
function authFactory(params) {
  return async (req, res, next) => {
    // must have either an API key (starts with 'Bearer') or a JWT token
    const authToken = req.headers.authorization
    let user
    let tokenObject
    let userId

    if (!authToken) {
      throw new ForbiddenError(`no token object ${authToken} found`)
    } else if (authToken.startsWith('Bearer')) {
      tokenObject = await req.store.get(`api-token/${req.token}`)
      if (!tokenObject) {
        throw new ForbiddenError(`no token object ${authToken} found`)
      }
      userId = tokenObject.userId
      // track last seen
      tracking.record(req.store, tokenObject)
    } else if (authToken.startsWith('JWT')) {
      const jwtToken = authToken.substr(4)
      try {
        const verified = jwt.verify(jwtToken, req.config.jwtSecret, {
          audience: req.config.jwtAudience,
        })
        userId = verified.sub
      } catch (err) {
        throw new ForbiddenError(err.message)
      }
    }

    user = await req.store.get(`user/${userId}`)

    if (!user) {
      throw new InternalServerError(`no user found for token ${authToken}`)
    }

    if (!params.allowUnverified && user.emailValid === false) {
      throw new ForbiddenError(
        `useremail ${user.email} has not been verified. Please check your inbox for verification email.`,
      )
    }

    req.user = user
    req.authTokenType = authToken.startsWith('Bearer') ? 'Bearer' : 'JWT'
    req.isUIAdmin = req.user.admin && req.authTokenType == 'JWT'
    if (tokenObject && tokenObject.name) {
      req.tokenName = tokenObject.name
    }

    if (params.admin) {
      // admins must have a JWT
      if (
        (authToken.startsWith('JWT') && user.admin !== true) ||
        authToken.startsWith('Bearer')
      ) {
        throw new ForbiddenError(`user does not have admin priviledges`)
      }
    }
    return next()
  }
}

// export default router
export default authFactory
