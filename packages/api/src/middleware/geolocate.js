'use strict'

// This is a spec but it doesn't look like it's very well supported, so
import promiseAny from 'promise.any'

export function addProtocol(url, protocol = 'https') {
  if (url.indexOf('://') > 0) {
    return url
  }
  return protocol + '://' + url
}

function geoLocateFactory({ first = true, region = 'region' }) {
  return async (req, res, next) => {
    if (req.query.first === 'false') {
      first = false
    } else if (req.query.first == 'true') {
      first = true
    }

    let serversObject = req.config[region]
    let servers = []
    for (let i in serversObject) {
      servers.push(addProtocol(serversObject[i]))
    }

    if (servers.length < 1) {
      req.region = null
      return next()
    }

    let smallestServer
    let smallestDuration = Infinity
    console.log('servers: ', typeof servers, servers)
    const errors = []
    const promises = servers.map(async (server) => {
      const start = Date.now()
      const upstreamUrl = `${server}/api/geolocate`
      const res = await fetch(upstreamUrl)
      if (res.status !== 200) {
        const err = new Error(
          `${upstreamUrl} HTTP ${res.status}: ${await res.text()}`,
        )
        errors.push(err)
        throw err
      }
      const duration = Date.now() - start
      if (duration < smallestDuration) {
        smallestDuration = duration
        smallestServer = server
      }
      return {
        server,
        duration,
      }
    })
    let data
    try {
      if (first) {
        data = await promiseAny(promises)
        data = [data]
      } else {
        data = await Promise.all(promises)
      }
    } catch (e) {
      const allErrors = errors.map((err) => err.message).join(', ')
      throw new Error(`${e.message}: ${allErrors}`)
    }
    const ret = {
      chosenServer: smallestServer,
      servers: data,
    }

    req.region = ret
    return next()
  }
}

export default geoLocateFactory
