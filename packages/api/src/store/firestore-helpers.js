import jwt from 'jsonwebtoken'

/**
 * Generate a Google Cloud API JWT
 *
 * @param config - the JWT configuration
 */
export function generateJWT(config) {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 3600
  let payload = {
    ...config.payload,
    iat,
    exp,
  }

  const token = jwt.sign(payload, config.privateKey, {
    algorithm: 'RS256',
    keyid: config.privateKeyID,
  })
  return [token, exp * 1000]
}
