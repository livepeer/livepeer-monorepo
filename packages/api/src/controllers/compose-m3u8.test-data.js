export const playlist1 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:171
#EXT-X-TARGETDURATION:2
#EXTINF:1.417,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/533.ts
#EXTINF:2.000,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/534.ts
#EXTINF:1.875,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/537.ts
#EXTINF:2.000,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/543.ts
#EXTINF:1.791,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/545.ts
#EXTINF:1.500,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/546.ts`

export const playlist2 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:195
#EXT-X-TARGETDURATION:2
#EXTINF:2.000,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/536.ts
#EXTINF:1.333,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/538.ts
#EXTINF:1.375,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/540.ts
#EXTINF:2.000,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/542.ts
#EXTINF:1.625,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/544.ts
#EXTINF:2.000,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/547.ts`

export const playlist3 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:162
#EXT-X-TARGETDURATION:2
#EXTINF:2.000,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/523.ts
#EXTINF:2.000,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/524.ts
#EXTINF:1.792,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/526.ts
#EXTINF:2.000,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/539.ts
#EXTINF:1.167,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/541.ts
#EXTINF:2.000,
/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/550.ts`

export const combinedPlaylist = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:536
#EXT-X-TARGETDURATION:2
#EXTINF:2.000,
test://playlist2/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/536.ts
#EXTINF:1.875,
test://playlist1/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/537.ts
#EXTINF:1.333,
test://playlist2/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/538.ts
#EXTINF:2.000,
test://playlist3/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/539.ts
#EXTINF:1.375,
test://playlist2/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/540.ts
#EXTINF:1.167,
test://playlist3/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/541.ts
#EXTINF:2.000,
test://playlist2/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/542.ts
#EXTINF:2.000,
test://playlist1/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/543.ts
#EXTINF:1.625,
test://playlist2/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/544.ts
#EXTINF:1.791,
test://playlist1/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/545.ts
#EXTINF:1.500,
test://playlist1/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/546.ts
#EXTINF:2.000,
test://playlist2/stream/60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9/547.ts`

export const masterPlaylist1 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=0,BANDWIDTH=4000000,RESOLUTION=0x0
60f2242c-f588-4752-a779-e15b6384a720/source.m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=0,BANDWIDTH=400000,RESOLUTION=256x144
60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9.m3u8`

export const masterPlaylist2 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=0,BANDWIDTH=4000000,RESOLUTION=0x0
60f2242c-f588-4752-a779-e15b6384a720/source.m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=0,BANDWIDTH=1200000,RESOLUTION=640x360
60f2242c-f588-4752-a779-e15b6384a720/P360p30fps16x9.m3u8`

export const masterPlaylist3 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=0,BANDWIDTH=400000,RESOLUTION=256x144
60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9.m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=0,BANDWIDTH=1200000,RESOLUTION=640x360
60f2242c-f588-4752-a779-e15b6384a720/P360p30fps16x9.m3u8`

export const combinedMasterPlaylist = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:PROGRAM-ID=0,BANDWIDTH=4000000,RESOLUTION=0x0
60f2242c-f588-4752-a779-e15b6384a720/source.m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=0,BANDWIDTH=1200000,RESOLUTION=640x360
60f2242c-f588-4752-a779-e15b6384a720/P360p30fps16x9.m3u8
#EXT-X-STREAM-INF:PROGRAM-ID=0,BANDWIDTH=400000,RESOLUTION=256x144
60f2242c-f588-4752-a779-e15b6384a720/P144p30fps16x9.m3u8`

export const emptyPlaylist = `#EXTM3U
#EXT-X-VERSION:3`

export const longPlaylistStore = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-TARGETDURATION:2
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/0.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/1.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/2.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/3.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/4.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/5.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/6.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/7.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/8.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/9.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/10.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/11.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/12.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/13.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/14.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/15.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/16.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/17.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/18.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/19.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/20.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/21.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/22.ts`

export const longPlaylistBroadcaster = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:21
#EXT-X-TARGETDURATION:2
#EXTINF:2.000,
/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/21.ts
#EXTINF:2.000,
/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/22.ts
#EXTINF:2.000,
/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/23.ts
#EXTINF:2.000,
/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/24.ts
#EXTINF:2.000,
/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/25.ts
#EXTINF:2.000,
/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/26.ts`

export const longPlaylistCombined = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-TARGETDURATION:2
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/0.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/1.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/2.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/3.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/4.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/5.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/6.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/7.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/8.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/9.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/10.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/11.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/12.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/13.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/14.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/15.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/16.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/17.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/18.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/19.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/20.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/21.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/22.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/23.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/24.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/25.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/26.ts`

export const longPlaylistCombinedTen = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:17
#EXT-X-TARGETDURATION:2
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/17.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/18.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/19.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/20.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/21.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/22.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/23.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/24.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/25.ts
#EXTINF:2.000,
test://longPlaylistBroadcaster/stream/6e028727-bb4d-4cf4-8bc0-cad57de4cd89/source/26.ts`

export const longPlaylistStoreRewritten = longPlaylistStore.replace(
  /test:\/\/longPlaylistBroadcaster\/stream/g,
  'https://example.com/store',
)
export const longPlaylistCombinedRewritten = longPlaylistCombined.replace(
  /test:\/\/longPlaylistBroadcaster\/stream/g,
  'https://example.com/store',
)
