import wowzaHydrate from './wowza-hydrate'
const { stream, camcastStream } = require('./wowza-hydrate.test-data.json')
const streamWithoutTransrateTemplate = JSON.parse(JSON.stringify(stream))
streamWithoutTransrateTemplate.wowza.transcoderAppConfig.templatesInUse =
  '${SourceStreamName}.xml'

const streamWidthHeightTest50 = JSON.parse(JSON.stringify(stream))
streamWidthHeightTest50.name = 'width_height_test'
streamWidthHeightTest50.wowza.sourceInfo.fps = 50

const streamTransrate = JSON.parse(JSON.stringify(stream))
streamTransrate.name = 'transrate'
const streamTransrate25 = JSON.parse(JSON.stringify(streamTransrate))
streamTransrate25.wowza.sourceInfo.fps = 25
const streamTransrate15 = JSON.parse(JSON.stringify(streamTransrate))
streamTransrate15.wowza.sourceInfo.fps = 15
const streamTransrate45 = JSON.parse(JSON.stringify(streamTransrate))
streamTransrate45.wowza.sourceInfo.fps = 45

describe('wowzaHydrate', () => {
  it('should correctly determine renditions and presets 30fps', () => {
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
    const newStream = wowzaHydrate({ ...streamTransrate })
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

  it('should correctly determine renditions and presets 25fps', () => {
    const newStream = wowzaHydrate({ ...streamTransrate25 })
    expect(newStream.presets).toEqual(['P360p25fps16x9', 'P144p25fps16x9'])
    expect(newStream.renditions).toEqual({
      transrate_source:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/source.m3u8',
      transrate_360p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P360p25fps16x9.m3u8',
      transrate_160p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P144p25fps16x9.m3u8',
    })
  })

  it('should correctly determine renditions and presets 15fps', () => {
    const newStream = wowzaHydrate({ ...streamTransrate15 })
    expect(newStream.presets).toEqual(['P360p25fps16x9', 'P144p25fps16x9'])
    expect(newStream.renditions).toEqual({
      transrate_source:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/source.m3u8',
      transrate_360p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P360p25fps16x9.m3u8',
      transrate_160p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P144p25fps16x9.m3u8',
    })
  })

  it('should correctly determine renditions and presets 30fps', () => {
    const newStream = wowzaHydrate({ ...streamTransrate45 })
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

  it('should correctly determine renditions and presets 30fps', () => {
    const newStream = wowzaHydrate({ ...streamWidthHeightTest50 })
    expect(newStream.presets).toEqual([
      'P720p60fps16x9',
      'P360p30fps16x9',
      'P240p30fps16x9',
      'P144p30fps16x9',
    ])
    expect(newStream.renditions).toEqual({
      width_height_test_source:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/source.m3u8',
      width_height_test_720p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P720p60fps16x9.m3u8',
      width_height_test_360p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P360p30fps16x9.m3u8',
      width_height_test_240p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P240p30fps16x9.m3u8',
      width_height_test_160p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P144p30fps16x9.m3u8',
    })
  })

  it('should correctly substitute heights widths to correct value', () => {
    stream.wowza.sourceInfo.fps = 30
    stream.name = 'width_height_test'
    const newStream = wowzaHydrate({ ...stream })
    expect(newStream.presets).toEqual([
      'P720p30fps16x9',
      'P360p30fps16x9',
      'P240p30fps16x9',
      'P144p30fps16x9',
    ])
    expect(newStream.renditions).toEqual({
      width_height_test_source:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/source.m3u8',
      width_height_test_720p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P720p30fps16x9.m3u8',
      width_height_test_360p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P360p30fps16x9.m3u8',
      width_height_test_240p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P240p30fps16x9.m3u8',
      width_height_test_160p:
        '/stream/de7818e7-610a-4057-8f6f-b785dc1e6f88/P144p30fps16x9.m3u8',
    })
  })

  it('should fail if stream name does not equal any template name', () => {
    let message
    streamWithoutTransrateTemplate.name = 'fake_name'
    try {
      const newStream = wowzaHydrate({ ...streamWithoutTransrateTemplate })
    } catch (e) {
      message = e.message
    }
    expect(message).toEqual('no template found from templatesInUse')
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

  it('should handle duplicate stream cases', () => {
    const newStream = wowzaHydrate({ ...camcastStream })
    expect(newStream.presets).toEqual([
      'P720p25fps16x9',
      'P360p25fps16x9',
      'P360p30fps4x3',
      'P144p25fps16x9',
    ])
  })
})
