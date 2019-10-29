/**
 * Combines several different M3U8 files into one that accounts for data from
 * all of them. Useful for providing a coherent playlist from a variety of
 * disparate broadcasters.
 */

import fetch from 'isomorphic-fetch'
import { Parser } from 'm3u8-parser'
import { basename, resolve } from 'path'

export default async urls => {
  const responses = await Promise.all(
    urls.map(async url => {
      const res = await fetch(url)
      const text = await res.text()
      return [res, url, text]
    }),
  )
  const broadcasters = responses.filter(([response]) => {
    return response.status === 200
  })

  if (broadcasters.length === 0) {
    return null
  }
  let isMasterPlaylist = false
  let isMediaPlaylist = false
  for (const [response, address, text] of broadcasters) {
    if (text.includes('#EXT-X-STREAM-INF')) {
      isMasterPlaylist = true
    }
    if (text.includes('#EXT-X-MEDIA-SEQUENCE')) {
      isMediaPlaylist = true
    }
  }

  if (isMasterPlaylist && isMediaPlaylist) {
    throw new Error('cannot combine master and media playlists')
  }

  if (isMasterPlaylist) {
    return handleMasterPlaylist(broadcasters)
  } else if (isMediaPlaylist) {
    return handleMediaPlaylist(broadcasters)
  } else {
    throw new Error('unable to determine playlist type')
  }
}

export const handleMediaPlaylist = broadcasters => {
  const segments = []
  let min = Infinity
  let max = -1

  for (const [response, address, text] of broadcasters) {
    const parser = new Parser()
    parser.push(text)
    parser.end()
    for (const segment of parser.manifest.segments) {
      const seq = parseInt(basename(segment.uri, '.ts'))
      if (seq < min) {
        min = seq
      }
      if (seq > max) {
        max = seq
      }
      segments.push({
        ...segment,
        seq,
        address,
      })
    }
  }
  segments.sort((a, b) => a.seq - b.seq)
  let idx = 0
  let currentRun = null
  // All the sequential segment numbers in order
  const runs = []
  for (let i = min; i <= max; i += 1) {
    if (segments[idx].seq === i) {
      // We have ${i}.ts!
      if (currentRun === null) {
        currentRun = []
        runs.unshift(currentRun)
      }
      currentRun.push(segments[idx])
      idx += 1
    } else {
      // We do not have ${i}.ts
      currentRun = null
    }
  }
  let bestRun = runs[0]
  // OK so this is something of an ad-hoc algorithm for "best" run, but
  // we have a few objectives...
  for (const run of runs) {
    // If a few recent segments arrived out-of-order, hold off until
    // we have everything. "Having everything" will be defined for now
    // as a run of 5 contigious segments.
    if (bestRun.length < 5 && run.length > bestRun.length) {
      bestRun = run
    }
  }
  let targetDuration = 0
  let output = []
  for (const segment of bestRun) {
    if (segment.duration > targetDuration) {
      targetDuration = segment.duration
    }
    output.push(`#EXTINF:${segment.duration.toFixed(3)},`)
    // If segment is a full URL leave it alone, otherwise add its host and whatnot
    if (segment.uri.startsWith('http')) {
      output.push(segment.uri)
    } else {
      const fullUrl = new URL(segment.address)
      fullUrl.pathname = resolve(fullUrl.pathname, segment.uri)
      output.push(fullUrl.toString())
    }
  }
  output = [
    '#EXTM3U',
    '#EXT-X-VERSION:3',
    `#EXT-X-MEDIA-SEQUENCE:${bestRun[0].seq}`,
    `#EXT-X-TARGETDURATION:${Math.ceil(targetDuration)}`,
    ...output,
  ]

  return output.join('\n')
}

export const handleMasterPlaylist = broadcasters => {
  let playlists = {}

  for (const [response, address, text] of broadcasters) {
    const parser = new Parser()
    parser.push(text)
    parser.end()
    for (const playlist of parser.manifest.playlists) {
      playlists[playlist.uri] = playlist
    }
  }

  const output = ['#EXTM3U', '#EXT-X-VERSION:3']
  playlists = Object.values(playlists).sort((p1, p2) => {
    return p2.attributes.BANDWIDTH - p1.attributes.BANDWIDTH
  })
  for (const playlist of Object.values(playlists)) {
    const programId = playlist.attributes['PROGRAM-ID']
    const bandwidth = playlist.attributes.BANDWIDTH
    const { width, height } = playlist.attributes.RESOLUTION
    // Todo: kinda hardcoded to what go-livepeer provides right now
    output.push(
      `#EXT-X-STREAM-INF:PROGRAM-ID=${programId},BANDWIDTH=${bandwidth},RESOLUTION=${width}x${height}`,
    )
    output.push(playlist.uri)
  }

  return output.join('\n')
}
