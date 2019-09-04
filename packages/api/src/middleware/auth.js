import bearerToken from 'express-bearer-token'
import { Router } from 'express'
import uuid from 'uuid/v4'

const router = Router()

router.use(bearerToken())

async function verifyToken(req, res, next) {
  if (!req || !req.token) {
    return res.sendStatus(403)
  }

  // check token against token DB
  let resp = await req.store.get(`apitoken/${req.token}`)
  res.json(resp)
}

async function generateToken(req, res, next) {
  const id = uuid()
  let resp = await req.store.create({
    id,
    kind: 'apitoken',
    otherdata: 1,
  })

  res.send(id)
}

router.get('/newtoken', generateToken)
router.get('/test', verifyToken)

export default router
