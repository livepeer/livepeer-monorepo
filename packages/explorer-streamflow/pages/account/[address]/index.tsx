/** @jsx jsx */
import { useRouter } from 'next/router'
import { jsx, Flex, Box } from 'theme-ui'
import Layout from '../../../components/Layout'
import ROICalculator from '../../../components/ROICalculator'
import Profile from '../../../components/Profile'
import Tabs from '../../../components/Tabs'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { withApollo } from '../../../lib/apollo'

const GET_PROTOCOL_DATA = gql`
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
  const router = useRouter()
  const { address } = router.query
  const { data, loading } = useQuery(GET_PROTOCOL_DATA, {
    notifyOnNetworkStatusChange: true,
    ssr: false
  })

  const views = [
    { name: 'Overview', slug: '', isActive: true },
    { name: 'Staking', slug: 'staking' },
    { name: 'Earned Fees' },
    { name: 'History' },
    { name: 'Settings' }
  ]

  return (
    <Layout>
      <Flex
        sx={{
          width: 'calc(100% - 256px)',
          maxWidth: 1300,
          margin: '0 auto',
          px: 4
        }}>
        <Flex
          sx={{ paddingTop: 5, flexDirection: 'column', pr: 6, width: '70%' }}>
          <Profile address={address} styles={{ mb: 4 }} />
          <Tabs tabs={views} address={address} />
        </Flex>

        {loading ? (
          <div>Loading</div>
        ) : (
          <ROICalculator protocol={data.protocol} />
        )}
      </Flex>
    </Layout>
  )
})
