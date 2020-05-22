import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import Router from 'express/lib/router'
import uuid from 'uuid/v4'
import ms from 'ms'
import jwt from 'jsonwebtoken'
import validator from 'email-validator'
import { makeNextHREF, sendgridEmail, trackAction } from './helpers'
import hash from '../hash'
import qs from 'qs'

const app = Router()

app.get('/', authMiddleware({ admin: true }), async (req, res) => {
  const resp = await req.store.list({ prefix: `user/`, cursor: req.query.cursor, limit: req.query.limit })
  res.status(200)

  if (resp.data.length > 0) {
    res.links({ next: makeNextHREF(req, resp.cursor) })
  }
  res.json(resp.data)
})

app.get('/:id', authMiddleware({ allowUnverified: true }), async (req, res) => {
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
  const { email, password } = req.body
  const emailValid = validator.validate(email)
  if (!emailValid) {
    res.status(422)
    res.json({ errors: ['invalid email'] })
    return
  }

  const [hashedPassword, salt] = await hash(password)
  const id = uuid()
  const emailValidToken = uuid()

  // use SendGrid to verify user only if credentials have been provided
  let validUser = true
  if (req.config.sendgridApiKey && req.config.supportAddr) {
    validUser = false
  }

  await Promise.all([
    req.store.create({
      kind: 'user',
      id: id,
      password: hashedPassword,
      email: email,
      salt: salt,
      admin: false,
      emailValidToken: emailValidToken,
      emailValid: validUser,
    }),
    trackAction(
      id,
      email,
      { name: 'user registered' },
      req.config.segmentApiKey,
    )
  ])

  const user = await req.store.get(`user/${id}`)

  const protocol =
    req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'

  const verificationUrl = `${protocol}://${
    req.headers.host
    }/app/user/verify?${qs.stringify({ email, emailValidToken })}`
  const unsubscribeUrl = `${protocol}://${req.headers.host}/#contactSection`

  if (!validUser && user) {
    const { supportAddr, sendgridTemplateId, sendgridApiKey } = req.config
    try {
      // send email verification message to user using SendGrid
      await sendgridEmail({
        email,
        supportAddr,
        sendgridTemplateId,
        sendgridApiKey,
        subject: 'Verify your Livepeer Email',
        preheader: 'Welcome to Livepeer!',
        buttonText: 'Verify Email',
        buttonUrl: verificationUrl,
        unsubscribe: unsubscribeUrl,
        text: [
          "Let's verify your email so you can start using the Livepeer API.",
          'Your link is active for 48 hours. After that, you will need to resend the verification email.',
        ].join('\n\n'),
      })
    } catch (err) {
      res.status(400)
      return res.json({
        errors: [
          `error sending confirmation email to ${req.body.email}: error: ${err}`,
        ],
      })
    }
  }

  if (!user) {
    res.status(403)
    return res.json({ errors: ['user not created'] })
  }

  res.status(201)
  res.json(user)
})

app.post('/token', validatePost('user'), async (req, res) => {
  const { data: userIds } = await req.store.query({
    kind: 'user',
    query: { email: req.body.email }
  })
  if (userIds.length < 1) {
    res.status(404)
    return res.json({ errors: ['user not found'] })
  }
  const user = await req.store.get(`user/${userIds[0]}`, false)
  if (!user) {
    res.status(404)
    return res.json({ errors: ['user not found'] })
  }

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

app.post('/verify', validatePost('user-verification'), async (req, res) => {
  const { data: userIds } = await req.store.query({
    kind: 'user',
    query: { email: req.body.email }
  })
  if (userIds.length < 1) {
    res.status(404)
    return res.json({ errors: ['user not found'] })
  }

  let user = await req.store.get(`user/${userIds[0]}`, false)
  if (user.emailValidToken === req.body.emailValidToken) {
    // alert sales of new verified user
    const { supportAddr, sendgridTemplateId, sendgridApiKey } = req.config
    const protocol =
      req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'
    const buttonUrl = `${protocol}://${req.headers.host}/login`
    const unsubscribeUrl = `${protocol}://${req.headers.host}/#contactSection`
    const salesEmail = 'sales@livepeer.org'

    try {
      // send email verification message to user using SendGrid
      await sendgridEmail({
        email: salesEmail,
        supportAddr,
        sendgridTemplateId,
        sendgridApiKey,
        subject: `User ${user.email} signed up with Livepeer!`,
        preheader: 'We have a new verified user',
        buttonText: 'Log into livepeer',
        buttonUrl: buttonUrl,
        unsubscribe: unsubscribeUrl,
        text: [
          `User ${user.email} has signed up and verified their email with Livepeer!`,
        ].join('\n\n'),
      })
    } catch (err) {
      res.status(400)
      return res.json({
        errors: [
          `error sending confirmation email to ${req.body.email}: error: ${err}`,
        ],
      })
    }

    // return user
    user = { ...user, emailValid: true }
    await req.store.replace(user)
    res.status(201)
    res.json({ email: user.email, emailValid: user.emailValid })
  } else {
    res.status(403)
    res.json({ errors: ['incorrect user validation token'] })
  }
})

app.post(
  '/password/reset',
  validatePost('password-reset'),
  async (req, res) => {
    const { email, password, resetToken } = req.body
    const { data: [userId] } = await req.store.query({
      kind: 'user',
      query: { email: email }
    })
    if (!userId) {
      res.status(404)
      return res.json({ errors: ['user not found'] })
    }

    let user = await req.store.get(`user/${userId}`)
    if (!user) {
      res.status(404)
      return res.json({ errors: [`user email ${email} not found`] })
    }

    const { data: tokens } = await req.store.query({
      kind: 'password-reset-token',
      query: {
        userId: user.id
      },
    })

    if (tokens.length < 1) {
      res.status(404)
      return res.json({ errors: ['Password reset token not found'] })
    }

    let dbResetToken
    for (let i = 0; i < tokens.length; i++) {
      const token = await req.store.get(
        `password-reset-token/${tokens[i]}`,
        false,
      )

      if (token.resetToken === resetToken) {
        dbResetToken = token
      }
    }

    if (!dbResetToken || dbResetToken.expiration < Date.now()) {
      res.status(403)
      return res.json({
        errors: ['incorrect or expired user validation token'],
      })
    }

    // change user password
    const [hashedPassword, salt] = await hash(password)
    await req.store.replace({
      ...user,
      password: hashedPassword,
      salt: salt,
      emailValid: true,
    })

    user = await req.store.get(`user/${userId}`)

    // delete all reset tokens associated with user
    for (const t of tokens) {
      await req.store.delete(`password-reset-token/${t}`)
    }

    res.status(201)
    return res.json(user)
  },
)

app.post(
  '/password/reset-token',
  validatePost('password-reset-token'),
  async (req, res) => {
    const email = req.body.email
    const { data: [userId] } = await req.store.query({
      kind: 'user',
      query: { email: email }
    })
    if (!userId) {
      res.status(404)
      return res.json({ errors: ['user not found'] })
    }

    let user = await req.store.get(`user/${userId}`)
    if (!user) {
      res.status(404)
      return res.json({ errors: [`user email ${email} not found`] })
    }

    const id = uuid()
    let resetToken = uuid()
    await req.store.create({
      kind: 'password-reset-token',
      id: id,
      userId: userId,
      resetToken: resetToken,
      expiration: Date.now() + ms('48 hours'),
    })

    const { supportAddr, sendgridTemplateId, sendgridApiKey } = req.config
    try {
      const protocol =
        req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'

      const verificationUrl = `${protocol}://${
        req.headers.host
        }/reset-password?${qs.stringify({ email, resetToken })}`
      const unsubscribeUrl = `${protocol}://${req.headers.host}/#contactSection`

      await sendgridEmail({
        email,
        supportAddr,
        sendgridTemplateId,
        sendgridApiKey,
        subject: 'Livepeer Password Reset',
        preheader: 'Reset your Livepeer Password!',
        buttonText: 'Reset Password',
        buttonUrl: verificationUrl,
        unsubscribe: unsubscribeUrl,
        text: [
          "Let's change your password so you can log into the Livepeer API.",
          'Your link is active for 48 hours. After that, you will need to resend the password reset email.',
        ].join('\n\n'),
      })
    } catch (err) {
      res.status(400)
      return res.json({
        errors: [`error sending confirmation email to ${email}: error: ${err}`],
      })
    }

    const newToken = await req.store.get(`password-reset-token/${id}`, false)

    if (newToken) {
      res.status(201)
      res.json(newToken)
    } else {
      res.status(403)
      res.json({ errors: ['error creating password reset token'] })
    }
  },
)

app.post(
  '/make-admin',
  authMiddleware({ admin: true }),
  validatePost('make-admin'),
  async (req, res) => {
    const { data: userIds } = await req.store.query({
      kind: 'user',
      query: { email: req.body.email }
    })
    if (userIds.length < 1) {
      res.status(404)
      return res.json({ errors: ['user not found'] })
    }

    let user = await req.store.get(`user/${userIds[0]}`, false)
    if (user) {
      user = { ...user, admin: req.body.admin }
      await req.store.replace(user)
      res.status(201)
      res.json({ email: user.email, admin: user.admin })
    } else {
      res.status(403)
      res.json({ errors: ['user not made an admin'] })
    }
  },
)

export default app
