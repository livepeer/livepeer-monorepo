/**
 * Helper function to set up a proper minio client
 */

import { Client } from 'minio'

export default ({ s3Url, s3Access, s3Secret }) => {
  const url = new URL(s3Url)
  const useSSL = url.protocol === 'https:'

  let port = url.port
  if (!port) {
    port = useSSL ? '443' : '80'
  }

  const bucket = url.pathname.slice(1)

  const client = new Client({
    endPoint: url.hostname,
    port: parseInt(port),
    useSSL: useSSL,
    accessKey: s3Access,
    secretKey: s3Secret,
  })

  return {
    put(path, data) {
      return new Promise((resolve, reject) => {
        client.putObject(bucket, path, data, function(err, etag) {
          if (err) {
            return reject(err)
          }
          return resolve(etag)
        })
      })
    },

    list(prefix) {
      return new Promise((resolve, reject) => {
        const data = []
        const stream = client.listObjects(bucket, prefix, true)
        stream.on('data', function(obj) {
          data.push(obj)
        })
        stream.on('error', function(err) {
          reject(err)
        })
        stream.on('end', () => {
          resolve(data)
        })
      })
    },
  }
}
