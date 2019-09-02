// /** @jsx jsx */
import gql from 'graphql-tag'
import { useContext, useEffect, useState } from 'react'
import * as React from 'react'
import MetaMaskContext from '../lib/metamask'
import { useQuery } from '@apollo/react-hooks'
import { jsx, Flex } from 'theme-ui'
import Layout from '../components/Layout'
import Table from '../components/Table'
import ROICalculator from '../components/ROICalculator'

const GET_DATA = require('../queries/transcoders.graphql')

export default () => {
  const { data, loading } = useQuery(GET_DATA, {
    notifyOnNetworkStatusChange: true,
    ssr: false,
  })

  if (loading) {
    return (
      <Layout>
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
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
          width: 'calc(100% - 256px)',
          px: 5,
        }}
      >
        <>
          <Flex sx={{ paddingTop: 5, pr: 6, width: '70%' }}>
            <Table transcoders={data.transcoders} />
          </Flex>
          <ROICalculator protocol={data.protocol} />
        </>
      </Flex>
    </Layout>
  )
}
