import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import Router from 'express/lib/router'
import logger from '../logger'
import uuid from 'uuid/v4'
import jwt from 'jsonwebtoken'
import validator from 'email-validator'
import SendgridMail from '@sendgrid/mail'
import { hash, makeNextHREF, sendgridMsg } from './helpers'

const app = Router()

app.get('/', authMiddleware({ admin: true }), async (req, res) => {
  const resp = await req.store.list(`user/`, req.query.cursor, req.query.limit)
  res.status(200)

  if (resp.data.length > 0) {
    res.links({ next: makeNextHREF(req, resp.cursor) })
  }

  res.json(resp.data)
})

app.get('/:id', authMiddleware({ unresitricted: true }), async (req, res) => {
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
  const emailValidToken = uuid()
  const admin = 'admin' in req.body ? req.body.admin : false

  // use SendGrid to verify user only if credentials have been provided
  let validUser = true
  if (req.config.sendgridApiKey && req.config.supportAddr) {
    validUser = false
  }

  await req.store.create({
    kind: 'user',
    id: id,
    password: hashedPassword,
    email: req.body.email,
    salt: salt,
    admin: admin,
    emailValidToken: emailValidToken,
    emailValid: validUser,
  })
  const user = await req.store.get(`user/${id}`)

  if (!validUser && user) {
    try {
      // send email verification message to user using SendGrid
      const emailConfirmation = sendgridMsg(req.body.email, emailValidToken, req.config, req.headers.host)
      SendgridMail.setApiKey(req.config.sendgridApiKey)
      SendgridMail.send(emailConfirmation)
    } catch (err) {
      // if sendgrid verification email fails to send, user is deleted
      await req.store.delete(`user/${id}`)
      res.status(403)
      res.json({
        errors: [
          `user not created - error sending confirmation email to ${req.body.email}:: error: ${err}`,
        ],
      })
    }
  }

  if (user) {
    res.status(201)
    res.json(user)
  } else {
    res.status(403)
    return res.json({ errors: ['user not created'] })
  }

  res.status(201)
  res.json(user)
})

app.post('/token', validatePost('user'), async (req, res) => {
  const userIds = await req.store.query('user', { email: req.body.email })
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

app.post('/verify', validatePost('userverify'), async (req, res) => {
  const userIds = await req.store.getPropertyIds(`useremail/${req.body.email}`)

  let user = await req.store.get(`user/${userIds[0]}`, false)
  if (user.emailValidToken === req.body.emailValidToken) {
    user = { ...user, emailValid: true }
    await req.store.replace(user)
    res.status(201)
    res.json({ email: user.email, emailValid: user.emailValid })
  } else {
    res.status(403)
    res.json({ errors: ['incorrect user validation token'] })
  }
})

// TODO: token must grant you one time access to modify the password.
// Add password reset tokens as a new record in the database with expiration dates and data.

export default app
