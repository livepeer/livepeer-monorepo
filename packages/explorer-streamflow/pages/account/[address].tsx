/** @jsx jsx */
import { useRouter } from 'next/router'
import { jsx, Flex } from 'theme-ui'
import Layout from '../../components/Layout'
import ROICalculator from '../../components/ROICalculator'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

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
export default () => {
  const router = useRouter()
  if (!router) {
    return null
  }
  const { address } = router.query
  const { data, loading } = useQuery(GET_PROTOCOL_DATA, {
    notifyOnNetworkStatusChange: true,
    ssr: false
  })

  return (
    <Layout>
      <Flex
        sx={{
          width: 'calc(100% - 256px)',
          maxWidth: '1300px',
          margin: '0 auto',
          px: 4
        }}>
        <>
          <Flex sx={{ paddingTop: 5, pr: 6, width: '70%' }}>{address}</Flex>
          {loading ? (
            <div>Loading</div>
          ) : (
            <ROICalculator protocol={data.protocol} />
          )}
        </>
      </Flex>
    </Layout>
  )
}
