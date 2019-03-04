// Return cost-per-minute
const PROVIDERS = [
  {
    name: 'AWS',
    cost: bitrate => {
      if (bitrate.resolution.height <= 720) {
        return 0.015
      }
      return 0.03
    },
  },
  {
    name: 'Livepeer',
    cost: () => 0.01,
  },
]

export const getComparisons = bitrates => {
  if (!bitrates || bitrates.length < 2) {
    return []
  }
  // bitrates[0] is the source, skip it
  return PROVIDERS.map(provider => {
    let sum = 0
    for (const bitrate of bitrates) {
      sum += provider.cost(bitrate)
    }
    return {
      name: provider.name,
      costPerMinute: sum,
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
  let c = `${Math.floor(cents - d * 100)}`
  while (c.length < 2) {
    c = '0' + c
  }
  return `$${d}.${c}`
}

export const kbpsFormat = bytes => `${Math.round(bytes / 1024)} kbps`

export const mbpsFormat = bytes => `${Math.round(bytes / 1024 / 1024)} mbps`
