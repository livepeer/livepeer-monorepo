/** @jsx jsx */
import { jsx, Styled, Flex } from 'theme-ui'
import { useQuery } from '@apollo/react-hooks'
import Layout from '../components/Layout'
import Table from '../components/Table'
import StakingWidget from '../components/StakingWidget'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withApollo } from '../lib/apollo'
import gql from 'graphql-tag'

const GET_DATA = gql`
  query {
    transcoders(where: { status: "Registered" }) {
      id
      active
      feeShare
      rewardCut
      status
      totalStake
      pricePerSegment
      rewards {
        rewardTokens
      }
    }
    protocol {
      totalTokenSupply
      totalBondedToken
    }
  }
`

export default withApollo(() => {
  const { data, loading } = useQuery(GET_DATA, {
    notifyOnNetworkStatusChange: false,
    pollInterval: 10000,
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
          <div sx={{ color: 'primary' }}>
            <CircularProgress size={24} color="inherit" />
          </div>
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
          <Flex
            sx={{
              position: 'sticky',
              alignSelf: 'flex-start',
              top: 4,
              width: '30%',
            }}
          >
            <StakingWidget protocol={data.protocol} />
          </Flex>
        </>
      </Flex>
    </Layout>
  )
})
