/** @jsx jsx */
import { useEffect, useState } from 'react'
import { jsx, Flex } from 'theme-ui'
import Layout from '../components/Layout'
import Thumbnail from '../components/Thumbnail'

interface BroadcasterManifest {}
interface BoradcasterManifestDict {
  [key: string]: BroadcasterManifest
}
interface BroadcasterData {
  Manifests: BoradcasterManifestDict
}
interface BroadcasterStatusResponse {
  // [key: string]: BroadcasterData
}

export default () => {
  const [streams, setStreams] = useState(null)
  useEffect(() => {
    ;(async () => {
      const googleAuthToken = localStorage.getItem('googleAuthToken')
      const res = await fetch('/api/broadcaster/status', {
        headers: { authorization: googleAuthToken },
      })
      if (res.status !== 200) {
        return console.error('fetch failed ' + (await res.text()))
      }
      const data: BroadcasterStatusResponse = await res.json()
      const streams = {}
      for (const [bName, bData] of Object.entries(data)) {
        for (const [id, stream] of Object.entries(bData.Manifests)) {
          streams[id] = stream
        }
      }
      setStreams(streams)
    })()
  }, [Math.floor(Date.now() / 5000)])

  if (streams === null) {
    return (
      <Layout>
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'space-around',
          }}
        >
          Loading...
        </Flex>
      </Layout>
    )
  }

  return (
    <Layout>
      <Flex
        sx={{
          flexWrap: 'wrap',
          flexGrow: '1',
          flexBasis: '0px',
          padding: 3,
          justifyContent: 'center',
        }}
      >
        {Object.entries(streams).map(([id, stream]) => (
          <Thumbnail key={id} id={id} stream={stream} />
        ))}
        {/* To fill with empty ones, uncomment: */}
        {/* {[...new Array(50)].map((_, x) => (
          <Thumbnail key={streams[0].streamId} {...streams[0]} />
        ))} */}
      </Flex>
    </Layout>
  )
  // return (
  //   <Layout>
  //     <Flex>Loaded!</Flex>
  //   </Layout>
  // );
}
