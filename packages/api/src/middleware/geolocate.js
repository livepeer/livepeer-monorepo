'use strict'

function geoLocateFactory (params) {
  return async (req, res, next) => {    
    let first = params.first || true
    if (req.query.first === "false") {
      first = false
    } else if (req.query.first = "true") {
      first = true
    }
    
    let serversObject = req.config.region
    let servers  = []
    for (let i in serversObject) {
      servers.push(serversObject[i])
    }

    if (servers.length < 1) {
      req.region = null
      return next()
    }
    
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
      data = [data]
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