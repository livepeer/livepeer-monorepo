/** @jsx jsx */
import { useEffect, useState } from 'react'
import { jsx, Flex } from 'theme-ui'
import Layout from '../components/Layout'
import Broadcaster from '../components/Broadcaster'

interface BroadcasterAddresses {
    [key: string]: BroadcasterInfo
}
interface BroadcasterInfo {
}

export default () => {
  const [broadcasters, setBroadcasters] = useState(null)
  useEffect(() => {
    ;(async () => {
      const googleAuthToken = localStorage.getItem('googleAuthToken')
      const res = await fetch('/api/broadcaster/addresses', {
        headers: { authorization: googleAuthToken },
      })
      if (res.status !== 200) {
        return console.error('fetch failed ' + (await res.text()))
      }
      const broadcasters: BroadcasterAddresses = await res.json()
      setBroadcasters(broadcasters)
    })()
  }, [Math.floor(Date.now() / 5000)])

  if (broadcasters === null) {
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
        {Object.entries(broadcasters).map(([address, item]) => (
          <Broadcaster
            key={address}
            address={address}
            deposit={item['deposit']}
            reserve={item['reserve']}
          />
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
