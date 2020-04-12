import jwt from 'jsonwebtoken'

/**
 * Generate a Google Cloud API JWT
 *
 * @param config - the JWT configuration
 */
export function generateJWT(config) {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 3600
  const payload = {
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

// Prepare a google service account JSON string for use
export const prepareConfig = serviceAccountConfigStr => {
  const serviceAccountConfig = JSON.parse(serviceAccountConfigStr)
  const FIRESTORE_SERVICE_DEFINITION = {
    type: 'google.api.Service',
    config_version: 3,
    name: 'firestore.googleapis.com',
    title: 'Google Cloud Firestore API',
    apis: [
      {
        name: 'google.firestore.v1.Firestore',
      },
    ],
    authentication: {
      rules: [
        {
          selector: '*',
          oauth: {
            canonical_scopes:
              'https://www.googleapis.com/auth/cloud-platform,\nhttps://www.googleapis.com/auth/datastore',
          },
        },
      ],
    },
  }

  // JWT spec at https://developers.google.com/identity/protocols/OAuth2ServiceAccount#jwt-auth
  const payload = {
    aud: `https://${FIRESTORE_SERVICE_DEFINITION.name}/${FIRESTORE_SERVICE_DEFINITION.apis[0].name}`,
    iss: serviceAccountConfig.client_email,
    sub: serviceAccountConfig.client_email,
  }

  const privateKey = serviceAccountConfig.private_key
  const privateKeyID = serviceAccountConfig.private_key_id
  const docsPath = `projects/${serviceAccountConfig.project_id}/databases/(default)/documents`
  const url = `https://firestore.googleapis.com/v1/${docsPath}`

  // The object we want to send to KV
  return {
    payload,
    privateKey,
    privateKeyID,
    url,
    docsPath,
  }
}
