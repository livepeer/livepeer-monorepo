import styled from 'styled-components'

// Return cost-per-hour
const PROVIDERS = [
  {
    name: 'AWS',
    color: '#ff9900',
    costPerStream: (bitrate, source) => {
      if (source) {
        if (bitrate.resolution.height < 720) {
          return 0.06
        }
        if (bitrate.resolution.height < 2160) {
          return 0.12
        }
        return 0.7
      }
      return 0.702
    },
  },
  {
    name: 'Wowza Cloud',
    color: '#fe8503',
    cost: () => 3,
  },
  {
    name: 'Bitmovin',
    color: '#1eabe2',
    costPerStream: (bitrate, source) => {
      if (source) {
        return 0
      }
      return 0.0217 * 60
    },
  },
  {
    name: 'Livepeer',
    cost: () => 0.3,
    color: '#00eb87',
  },
]

export const DEFAULT_COLORS = ['#00890b', '#005689', '#89002d', '#895f00']

// Assumes the first bitrate provided is the source
export const getComparisons = bitrates => {
  if (!bitrates || bitrates.length < 2) {
    return []
  }
  // bitrates[0] is the source, skip it
  return PROVIDERS.map(provider => {
    let sum = 0
    let source = true
    if (provider.costPerStream) {
      for (const bitrate of bitrates) {
        sum += provider.costPerStream(bitrate, source)
        source = false
      }
    } else {
      sum = provider.cost()
    }
    return {
      name: provider.name,
      color: provider.color,
      costPerMinute: sum / 60,
    }
  })
}

export const timeFormat = ms => {
  const sec = Math.floor(ms / 1000)
  const m = Math.floor(sec / 60)
  let s = `${sec - m * 60}`
  while (s.length < 2) {
    s = '0' + s
  }
  return `${m}:${s}`
}

export const dollarFormat = dollars => {
  const cents = dollars * 100
  const d = Math.floor(cents / 100)
  let c = `${Math.ceil(cents - d * 100)}`
  while (c.length < 2) {
    c = '0' + c
  }
  return `$${d}.${c}`
}

export const kbpsFormat = bytes => `${Math.round(bytes / 1024)} kbps`

export const mbpsFormat = bytes => `${Math.round(bytes / 1024 / 1024)} mbps`

export const ChartInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
