/** @jsx jsx */
import gql from 'graphql-tag'
import { useContext, useEffect, useState } from 'react'
import * as React from 'react'
// import MetaMaskContext from "../lib/metamask";
import { useQuery } from '@apollo/react-hooks'
import { jsx, Flex, Box } from 'theme-ui'
import Layout from '../components/Layout'
import Thumbnail from '../components/Thumbnail'
// import Layout from "@livepeer/explorer-streamflow/dist/components/Layout";
// import Table from "../components/Table";
// import ROICalculator from "../components/ROICalculator";

// const GET_DATA = require("../queries/transcoders.graphql");

interface BroadcasterManifest {}
interface BoradcasterManifestDict {
  [key: string]: BroadcasterManifest
}
interface BroadcasterData {
  Manifests: BoradcasterManifestDict
}
interface BroadcasterStatusResponse {
  [key: string]: BroadcasterData
}

export default () => {
  const [streams, setStreams] = useState(null)
  useEffect(() => {
    ;(async () => {
      const res = await fetch('https://livepeer.live/api/broadcaster/status')
      const data: BroadcasterStatusResponse = await res.json()
      const streams = []
      for (const [bName, bData] of Object.entries(data)) {
        for (const [id, data] of Object.entries(bData.Manifests)) {
          streams.push({
            broadcasterName: bName,
            streamId: id,
            stream: data,
          })
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
        {streams.map(({ ...props }) => (
          <Thumbnail key={props.streamId} {...props} />
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
