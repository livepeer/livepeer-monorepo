/**
 * Combines several different M3U8 files into one that accounts for data from
 * all of them. Useful for providing a coherent playlist from a variety of
 * disparate broadcasters.
 */

import fetch from 'isomorphic-fetch'
import { Parser } from 'm3u8-parser'
import { basename, resolve } from 'path'

const PROTOCOL_RE = /^[a-zA-Z]+:\/\//

export default async (urls, { limit } = {}) => {
  const broadcasters = []
  await Promise.all(
    urls.map(async url => {
      try {
        const res = await fetch(url)
        if (res.status !== 200) {
          return
        }
        const text = await res.text()
        broadcasters.push([res, url, text])
      } catch (err) {
        // No problem, we expect sometimes they don't exist
      }
    }),
  )

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
    return handleMediaPlaylist(broadcasters, { limit })
  } else {
    throw new Error('unable to determine playlist type')
  }
}

// Helper function to grab the last limit of things
export const truncate = (run, limit) => {
  if (typeof limit !== 'number') {
    return run
  }
  if (run.length <= limit) {
    return run
  }
  return run.slice(run.length - limit, run.length)
}

export const handleMediaPlaylist = (broadcasters, { limit }) => {
  const segments = []
  let min = Infinity
  let max = -1
  const seenSeq = new Set()

  for (const [response, address, text] of broadcasters) {
    const parser = new Parser()
    parser.push(text)
    parser.end()
    for (const segment of parser.manifest.segments) {
      const seq = parseInt(basename(segment.uri, '.ts'))
      if (seenSeq.has(seq)) {
        // For now just ignore duplicated sequence numbers, we assume both instances are valid
        continue
      }
      seenSeq.add(seq)
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
  let bestRun = truncate(runs[0], limit)
  // OK so this is something of an ad-hoc algorithm for "best" run, but
  // we have a few objectives...
  for (let run of runs.slice(1)) {
    // If a few recent segments arrived out-of-order, hold off until
    // we have everything. "Having everything" will be defined for now
    // as a run of 5 contigious segments.
    run = truncate(run, limit)
    if (bestRun.length < 5 && run.length >= bestRun.length) {
      bestRun = run
    }
  }
  let targetDuration = 0
  let pairs = []
  for (const segment of bestRun) {
    if (segment.duration > targetDuration) {
      targetDuration = segment.duration
    }
    const pair = []
    pair.push(`#EXTINF:${segment.duration.toFixed(3)},`)
    // If segment is a full URL leave it alone, otherwise add its host and whatnot
    if (segment.uri.match(PROTOCOL_RE)) {
      pair.push(segment.uri)
    } else {
      const fullUrl = new URL(segment.address)
      fullUrl.pathname = resolve(fullUrl.pathname, segment.uri)
      pair.push(fullUrl.toString())
    }
    pairs.push(pair)
  }
  const output = [
    '#EXTM3U',
    '#EXT-X-VERSION:3',
    `#EXT-X-MEDIA-SEQUENCE:${bestRun[0].seq}`,
    `#EXT-X-TARGETDURATION:${Math.ceil(targetDuration)}`,
    ...pairs.map(pair => pair.join('\n')),
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
