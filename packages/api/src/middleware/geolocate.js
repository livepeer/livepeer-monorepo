'use strict'

function geoLocateFactory (params) {
  return async (req, res, next) => {
    let first = req.query.first || true
    // Sometimes comes in as a string? Normalize.
    // console.log('req.url: ', req.url)
    // let url = new URL(req.url)
    let servers = req.config.ingests

    let smallestServer
    let smallestDuration = Infinity
    console.log('servers: ', typeof servers, servers)
    const promises = servers.map(async server => {
      const start = Date.now()
      const res = await fetch(`https://${server}/api`)
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
    if (first) {
      data = await Promise.race(promises)
    } else {
      data = await Promise.all(promises)
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