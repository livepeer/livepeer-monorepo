import { setMock, clearMocks } from 'isomorphic-fetch'
import { Response } from 'node-fetch'
import {
  playlist1,
  playlist2,
  playlist3,
  combinedPlaylist,
} from './compose-m3u8.test-data'
import composeM3U8 from './compose-m3u8'

describe('compose-m3u8', () => {
  beforeEach(() => {
    setMock(
      'test://playlist-1/stream/playlist.m3u8',
      () => new Response(playlist1),
    )
    setMock(
      'test://playlist-2/stream/playlist.m3u8',
      () => new Response(playlist2),
    )
    setMock(
      'test://playlist-3/stream/playlist.m3u8',
      () => new Response(playlist3),
    )
    setMock('test://404.m3u8', () => new Response('not found', { status: 404 }))
  })
  it('should combine responses', async () => {
    const combined = await composeM3U8([
      'test://playlist-1/stream/playlist.m3u8',
      'test://playlist-2/stream/playlist.m3u8',
      'test://playlist-3/stream/playlist.m3u8',
    ])
    expect(combined).toEqual(combinedPlaylist)
  })

  it('should ignore 404ing responses', async () => {
    const combined = await composeM3U8([
      'test://playlist-1/stream/playlist.m3u8',
      'test://playlist-2/stream/playlist.m3u8',
      'test://playlist-3/stream/playlist.m3u8',
      'test://404.m3u8',
    ])
    expect(combined).toEqual(combinedPlaylist)
  })

  it('should 404 if it only gets 404s', async () => {
    const combined = await composeM3U8([
      'test://404.m3u8',
      'test://404.m3u8',
      'test://404.m3u8',
    ])
    expect(combined).toBeNull()
  })
})
// 60f2242c-f588-4752-a779-e15b6384a720
