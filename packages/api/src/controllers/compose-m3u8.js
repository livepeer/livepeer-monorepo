/**
 * Combines several different M3U8 files into one that accounts for data from
 * all of them. Useful for providing a coherent playlist from a variety of
 * disparate broadcasters.
 */

import fetch from 'isomorphic-fetch'
import { Parser } from 'm3u8-parser'
import { basename, resolve } from 'path'

export default async urls => {
  let min = Infinity
  let max = -1
  const segments = []
  const responses = await Promise.all(
    urls.map(async url => {
      const res = await fetch(url)
      const text = await res.text()
      return [res, url, text]
    }),
  )
  const pertinentBroadcasters = responses.filter(([response]) => {
    return response.status === 200
  })
  if (pertinentBroadcasters.length === 0) {
    return null
  }

  for (const [response, address, text] of pertinentBroadcasters) {
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
    const fullUrl = new URL(segment.address)
    fullUrl.pathname = resolve(fullUrl.pathname, segment.uri)
    output.push(fullUrl.toString())
  }
  output = [
    '#EXTM3U',
    '#EXT-X-VERSION:3',
    `#EXT-X-MEDIA-SEQUENCE:${bestRun[0].seq}`,
    `#EXT-X-TARGETDURATION:${targetDuration}`,
    ...output,
  ]
  return output.join('\n')
}
