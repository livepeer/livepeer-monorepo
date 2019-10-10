import wowzaHydrate from './wowza-hydrate'
const stream = require('./wowza-hydrate.test-data.json')

describe('wowzaHydrate', () => {
  it('should correctly determine renditions and presets', () => {
    const newStream = wowzaHydrate({ ...stream })
    expect(newStream.presets).toEqual(['P360p30fps16x9', 'P240p30fps4x3'])
    expect(newStream.renditions).toEqual({
      test_stream_source:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/source.m3u8',
      test_stream_360p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P360p30fps16x9.m3u8',
      test_stream_240p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P240p30fps4x3.m3u8',
    })
  })

  it('should correctly determine renditions and presets with different stream name', () => {
    stream.name = 'transrate'
    const newStream = wowzaHydrate({ ...stream })
    expect(newStream.presets).toEqual(['P360p30fps16x9', 'P144p30fps16x9'])
    expect(newStream.renditions).toEqual({
      transrate_source:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/source.m3u8',
      transrate_360p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P360p30fps16x9.m3u8',
      transrate_160p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P144p30fps16x9.m3u8',
    })
  })

  it('should fail if missing parameters', () => {
    for (const field of ['name', 'id']) {
      const brokenStream = { ...stream }
      delete brokenStream[field]
      expect(() => wowzaHydrate(brokenStream)).toThrow()
    }
  })

  it('should passthrough stream unchanged if there is no wowza field', () => {
    const nonWowzaStream = { ...stream }
    delete nonWowzaStream.wowza
    expect(wowzaHydrate(nonWowzaStream)).toBe(nonWowzaStream)
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
