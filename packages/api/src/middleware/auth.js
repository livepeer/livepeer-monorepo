import bearerToken from 'express-bearer-token'
import { Router } from 'express'
import uuid from 'uuid/v4'
import logger from '../logger'

const router = Router()

router.use(bearerToken())

/**
 * verify the http brearer token
 * NOTE: this generates a token if no token is provided for now
 * FIXME: stop generating tokens on the fly
 * @param {object} req req object, this should already have req.store
 * @param {object} res res object
 * @param {fn} next callback
 */
async function verifyToken(req, res, next) {
  // if (!req || !req.token) {
  //   return res.sendStatus(403)
  // }
  let resp
  try {
    // check token against token DB
    resp = await req.store.get(`apitoken/${req.token}`)
  } catch (e) {
    logger.warn('api Token not found... generating one')
    await generateToken(req, res, next)
  }
}

/**
 * generate token middleware
 * @param {object} req req object
 * @param {object} res res object
 * @param {fn} next callback
 */
async function generateToken(req, res, next) {
  const id = uuid()
  let resp = await req.store.create({
    id,
    kind: 'apitoken',
    otherdata: 1,
    autogen: true,
  })

  req.token = id
  logger.debug(`token = ${id}`)
  return next()
}

router.use(verifyToken)

export default router
