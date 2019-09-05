import bearerToken from 'express-bearer-token'
import { Router } from 'express'
import uuid from 'uuid/v4'
import logger from '../logger'

const router = Router()

router.use(bearerToken())

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

  next()
  // if (resp) {
  // } else {
  //   logger.warn('api Token not found... generating one')
  //   generateToken(req, res, next)
  // }
}

async function generateToken(req, res, next) {
  const id = uuid()
  let resp = await req.store.create({
    id,
    kind: 'apitoken',
    otherdata: 1,
    autogen: true,
  })

  req.token = id
  logger.info('token = ', id)
  next()
}

// router.get('/newtoken', generateToken)
// router.get('/test', verifyToken)

router.use(verifyToken)

export default router
