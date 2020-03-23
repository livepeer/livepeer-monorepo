import { authMiddleware } from '../middleware'
import { validatePost } from '../middleware'
import { Router } from 'express'
import logger from '../logger'
import Crypto from 'node-webcrypto-ossl'
import util from 'util'
import uuid from 'uuid/v4'
import jwt from 'jsonwebtoken'
import validator from 'email-validator'

const app = Router()
const crypto = new Crypto()
const ITERATIONS = 10000

app.get('/', authMiddleware({ admin : true }), async (req, res) => {
  let limit = req.query.limit
  let cursor = req.query.cursor
  logger.info(`cursor params ${req.query.cursor}, limit ${limit}`)
  const resp = await req.store.list(`user/`, cursor, limit)
  let output = resp.data
  const nextCursor = resp.cursor
  res.status(200)

  if (output.length > 0) {
    res.links({ next: makeNextHREF(req, nextCursor) })
  }

  output = output.map(x => ({
    ...x,
    password: null,
    salt: null,
  }))

  res.json(output)
})

app.get('/:id', authMiddleware({}), async (req, res) => {
  const user = await req.store.get(`user/${req.params.id}`)
  const secureUser = { ...user, password: null, salt: null }
  res.status(200)
  res.json(secureUser)
})

app.post('/', authMiddleware({}), validatePost('user'), async (req, res) => {
  const email = req.body.email
  const emailValid = validator.validate(email)
  const password = req.body.password
  if (!email || !password || !emailValid) {
    res.status(422)
    res.json({ error: 'missing/invalid email or password' })
    return
  }

  const [hashedPassword, salt] = await hash(req.body.password)
  const id = uuid()
  await req.store.create({
      kind: 'user',
      id: id,
      password: hashedPassword,
      email: req.body.email,
      salt: salt,
    })

  const user = await req.store.get(`user/${id}`)

  if (user) {
    const secureUser = { ...user, password: null, salt: null }

    res.status(201)
    res.json(secureUser)
  } else {
    res.status(403)
    res.json({ error: 'user not created' })
  }
})

app.post(
  '/token',
  authMiddleware({}),
  validatePost('user'),
  async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (!email || !password) {
      res.status(422)
      res.json({ error: 'missing email or password' })
      return
    }

    const userEmail = await req.store.get(`useremail/${email}`)
    if (!userEmail) {
      res.status(404)
      res.json({ error: `user ${email} not found` })
      return
    }
    const user = await req.store.get(`user/${userEmail.userId}`)
    if (!user) {
      res.status(404)
      res.json({
        error: `data integrity exception: user registered for ${email} does not exist at user/${userEmail.userId}`,
      })
      return
    }
    const [hashedPassword] = await hash(password, user.salt)
    if (hashedPassword !== user.password) {
      res.status(403)
      res.json({ error: 'incorrect password' })
      return
    }
    const token = jwt.sign({ sub: user.id }, 'secret', {
      algorithm: 'HS256',
    })
    res.status(201)
    res.json({ id: user.id, email: user.email, token: token })
  },
)

function makeNextHREF(req, nextCursor) {
  let baseUrl = new URL(
    `${req.protocol}://${req.get('host')}${req.originalUrl}`,
  )
  let next = baseUrl
  next.searchParams.set('cursor', nextCursor)
  return next.href
}

async function hash(password, salt) {
  let saltBuffer
  if (salt) {
    saltBuffer = fromHexString(salt)
  } else {
    saltBuffer = crypto.getRandomValues(new Uint8Array(8))
  }
  var encoder = new util.TextEncoder('utf-8')
  var passphraseKey = encoder.encode(password)

  // You should firstly import your passphrase Uint8array into a CryptoKey
  const key = await crypto.subtle.importKey(
    'raw',
    passphraseKey,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey'],
  )
  const webKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      // don't get too ambitious, or at least remember
      // that low-power phones will access your app
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    key,

    // Note: for this demo we don't actually need a cipher suite,
    // but the api requires that it must be specified.
    // For AES the length required to be 128 or 256 bits (not bytes)
    { name: 'AES-CBC', length: 256 },

    // Whether or not the key is extractable (less secure) or not (more secure)
    // when false, the key can only be passed as a web crypto object, not inspected
    true,

    // this web crypto object will only be allowed for these functions
    ['encrypt', 'decrypt'],
  )
  const buffer = await crypto.subtle.exportKey('raw', webKey)

  const outKey = bytesToHexString(new Uint8Array(buffer))
  const outSalt = bytesToHexString(saltBuffer)
  return [outKey, outSalt]
}

const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

function bytesToHexString(bytes, separate) {
  /// <signature>
  ///     <summary>Converts an Array of bytes values (0-255) to a Hex string</summary>
  ///     <param name="bytes" type="Array"/>
  ///     <param name="separate" type="Boolean" optional="true">Inserts a separator for display purposes (default = false)</param>
  ///     <returns type="String" />
  /// </signature>

  var result = ''
  if (typeof separate === 'undefined') {
    separate = false
  }

  for (var i = 0; i < bytes.length; i++) {
    if (separate && i % 4 === 0 && i !== 0) {
      result += '-'
    }

    var hexval = bytes[i].toString(16).toUpperCase()
    // Add a leading zero if needed.
    if (hexval.length === 1) {
      result += '0'
    }

    result += hexval
  }

  return result
}

export default app
