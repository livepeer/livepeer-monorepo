import { InternalServerError, ForbiddenError } from '../store/errors'
import jwt from 'jsonwebtoken'

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
      tokenObject = await req.store.get(`apitoken/${req.token}`)
      if (!tokenObject) {
        throw new ForbiddenError(
          `no token object ${authToken} found`,
        )
      }
      userId = tokenObject.userId

    } else if (authToken.startsWith('JWT')) {
      const jwtToken = authToken.substr(4)
      try {
        const verified = jwt.verify(jwtToken, req.config.jwtSecret, {audience: req.config.jwtAudience})
        userId = verified.sub
      }  catch (err) {
        throw new ForbiddenError(err.message)
      }
    }

    user = await req.store.get(`user/${userId}`)
    if (!user) {
      throw new InternalServerError(`no user found for token ${authToken}`)
    }

    req.user = user

    if (params.admin) {
      // admins must have a JWT
      if (authToken.startsWith('JWT') && user.admin !== true || authToken.startsWith('Bearer')) {
        throw new ForbiddenError(`user does not have admin priviledges`)
      }
    }
    return next()
  }
}

// export default router
export default authFactory
