import { setMock, clearMocks } from 'isomorphic-fetch'
import { Response } from 'node-fetch'
import * as testData from './compose-m3u8.test-data'
import composeM3U8 from './compose-m3u8'

describe('compose-m3u8', () => {
  beforeEach(() => {
    for (const [name, text] of Object.entries(testData)) {
      setMock(`test://${name}/stream/playlist.m3u8`, () => new Response(text))
    }
    setMock('test://404.m3u8', () => new Response('not found', { status: 404 }))
  })
  it('should combine responses', async () => {
    const combined = await composeM3U8([
      'test://playlist1/stream/playlist.m3u8',
      'test://playlist2/stream/playlist.m3u8',
      'test://playlist3/stream/playlist.m3u8',
    ])
    expect(combined).toEqual(testData.combinedPlaylist)
  })

  it('should ignore 404ing responses', async () => {
    const combined = await composeM3U8([
      'test://playlist1/stream/playlist.m3u8',
      'test://playlist2/stream/playlist.m3u8',
      'test://playlist3/stream/playlist.m3u8',
      'test://404.m3u8',
    ])
    expect(combined).toEqual(testData.combinedPlaylist)
  })

  it('should 404 if it only gets 404s', async () => {
    const combined = await composeM3U8([
      'test://404.m3u8',
      'test://404.m3u8',
      'test://404.m3u8',
    ])
    expect(combined).toBeNull()
  })

  it('should combine master playlists like sets', async () => {
    const combined = await composeM3U8([
      'test://masterPlaylist1/stream/playlist.m3u8',
      'test://masterPlaylist2/stream/playlist.m3u8',
      'test://masterPlaylist3/stream/playlist.m3u8',
    ])
    expect(combined).toEqual(testData.combinedMasterPlaylist)
  })

  it('should reject mixed master/media playlists', async () => {
    let failed = false
    try {
      await composeM3U8([
        'test://playlist1/stream/playlist.m3u8',
        'test://masterPlaylist1/stream/playlist.m3u8',
      ])
    } catch (e) {
      failed = true
    }
    expect(failed).toBe(true)
  })

  it('should reject empty playlists', async () => {
    let failed = false
    try {
      await composeM3U8(['test://emptyPlaylist/stream/playlist.m3u8'])
    } catch (e) {
      failed = true
    }
    expect(failed).toBe(true)
  })
})
// 60f2242c-f588-4752-a779-e15b6384a720
