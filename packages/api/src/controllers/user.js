import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import Router from 'express/lib/router'
import logger from '../logger'
import uuid from 'uuid/v4'
import jwt from 'jsonwebtoken'
import validator from 'email-validator'
import { hash, makeNextHREF } from './helpers'

const app = Router()

app.get('/', authMiddleware({ admin: true }), async (req, res) => {
  const resp = await req.store.list(`user/`, req.query.cursor, req.query.limit)
  res.status(200)

  if (resp.data.length > 0) {
    res.links({ next: makeNextHREF(req, resp.cursor) })
  }

  res.json(resp.data)
})

app.get('/:id', authMiddleware({}), async (req, res) => {
  const user = await req.store.get(`user/${req.params.id}`)
  if (req.user.admin !== true && req.user.id !== req.params.id) {
    res.status(403)
    res.json({
      errors: ['user can only request information on their own user object'],
    })
  } else {
    res.status(200)
    res.json(user)
  }
})

app.post('/', validatePost('user'), async (req, res) => {
  const emailValid = validator.validate(req.body.email)
  if (!emailValid) {
    res.status(422)
    res.json({ errors: ['invalid email'] })
    return
  }

  const [hashedPassword, salt] = await hash(req.body.password)
  const id = uuid()
  const admin = 'admin' in req.body ? req.body.admin : false
  await req.store.create({
    kind: 'user',
    id: id,
    password: hashedPassword,
    email: req.body.email,
    salt: salt,
    admin: admin,
  })

  const user = await req.store.get(`user/${id}`)

  if (user) {
    res.status(201)
    res.json(user)
  } else {
    res.status(403)
    res.json({ errors: ['user not created'] })
  }
})

app.post('/token', validatePost('user'), async (req, res) => {
  const userIds = await req.store.getPropertyIds(`useremail/${req.body.email}`)
  console.log(`USERUDSSSS: ${JSON.stringify(userIds)}`)
  const user = await req.store.get(`user/${userIds[0]}`, false)

  const [hashedPassword] = await hash(req.body.password, user.salt)
  if (hashedPassword !== user.password) {
    res.status(403)
    res.json({ errors: ['incorrect password'] })
    return
  }
  const token = jwt.sign(
    { sub: user.id, aud: req.config.jwtAudience },
    req.config.jwtSecret,
    {
      algorithm: 'HS256',
    },
  )
  res.status(201)
  res.json({ id: user.id, email: user.email, token: token })
})

export default app
