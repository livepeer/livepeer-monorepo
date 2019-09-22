/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import { useQuery } from '@apollo/react-hooks'
import Page from '../layouts/main'
import Orchestrators from '../components/Orchestrators'
import StakingWidget from '../components/StakingWidget'
import Spinner from '../components/Spinner'
import { withApollo } from '../lib/apollo'
import gql from 'graphql-tag'

const GET_DATA = gql`
  {
    transcoders(
      where: { status: Registered }
      orderBy: totalStake
      orderDirection: desc
    ) {
      id
      active
      feeShare
      rewardCut
      status
      totalStake
      pricePerSegment
      pools {
        rewardTokens
      }
    }
    protocol {
      totalTokenSupply
      totalBondedToken
    }
    selectedTranscoder @client {
      __typename
      id
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
      <Page>
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner />
        </Flex>
      </Page>
    )
  }

  return (
    <Page>
      <Flex
        sx={{
          width: 'calc(100% - 256px)',
          px: 5,
        }}
      >
        <>
          <Flex sx={{ paddingTop: 5, pr: 6, width: '70%' }}>
            <Orchestrators
              protocol={data.protocol}
              transcoders={data.transcoders}
            />
          </Flex>
          <Flex
            sx={{
              position: 'sticky',
              alignSelf: 'flex-start',
              top: 4,
              width: '30%',
            }}
          >
            <StakingWidget
              transcoder={
                data.selectedTranscoder.id
                  ? data.selectedTranscoder
                  : data.transcoders[0]
              }
              protocol={data.protocol}
            />
          </Flex>
        </>
      </Flex>
    </Page>
  )
})
