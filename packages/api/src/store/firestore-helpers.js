import jwt from 'jsonwebtoken'

/**
 * Generate a Google Cloud API JWT
 *
 * @param config - the JWT configuration
 */
export async function generateJWT(config) {
  const iat = Math.floor(new Date().getTime() / 1000)
  let payload = {
    ...config.payload,
    iat: iat,
    exp: iat + 3600,
  }

  return jwt.sign(payload, config.privateKey, {
    algorithm: 'RS256',
    keyid: config.privateKeyID,
  })
}
