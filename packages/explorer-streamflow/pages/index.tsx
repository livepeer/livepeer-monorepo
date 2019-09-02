<<<<<<< HEAD
// /** @jsx jsx */
import gql from 'graphql-tag'
import { useContext, useEffect, useState } from 'react'
=======
/** @jsx jsx */
>>>>>>> Abstract next-apollo integration; add styleguide;
import * as React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { jsx, Styled, Flex } from 'theme-ui'
import Layout from '../components/Layout'
import Table from '../components/Table'
import ROICalculator from '../components/ROICalculator'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withApollo } from '../lib/apollo'

const GET_DATA = require('../queries/transcoders.graphql')

export default withApollo(() => {
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
<<<<<<< HEAD
            alignItems: 'center',
          }}
        >
          Loading...
=======
            alignItems: 'center'
          }}>
          <Styled.div sx={{ color: 'primary' }}>
            <CircularProgress size={24} color="inherit" />
          </Styled.div>
>>>>>>> Abstract next-apollo integration; add styleguide;
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
})
