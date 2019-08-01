import wowzaHydrate from './wowza-hydrate'
const stream = require('./wowza-hydrate.test-data.json')

describe('wowzaHydrate', () => {
  it('should correctly determine renditions and presets', () => {
    const newStream = wowzaHydrate(stream)
    expect(newStream.presets).toEqual(['P360p30fps16x9', 'P144p30fps16x9'])
    expect(newStream.renditions).toEqual({
      source: '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88.m3u8',
      '360p':
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P360p30fps16x9.m3u8',
      '160p':
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P144p30fps16x9.m3u8',
    })
  })

  it('should not modify streams without a wowza property', () => {
    const inputStream = {
      id: 'abc123',
      otherField: 'otherValue',
    }
    const outputStream = wowzaHydrate(inputStream)
    expect(outputStream).toEqual(inputStream)
  })
})
