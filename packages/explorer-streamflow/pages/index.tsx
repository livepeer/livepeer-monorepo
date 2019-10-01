/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import { useQuery } from '@apollo/react-hooks'
import Page from '../layouts/main'
import Orchestrators from '../components/Orchestrators'
import StakingWidget from '../components/StakingWidget'
import Spinner from '../components/Spinner'
import { withApollo } from '../lib/apollo'
import gql from 'graphql-tag'
import { useAccount } from '../hooks'

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
      active
      totalStake
      delegator {
        startRound {
          id
        }
        bondedAmount
        unbondingLocks {
          withdrawRound
        }
      }
      pools(first: 30, orderBy: id, orderDirection: desc) {
        rewardTokens
      }
    }
    protocol {
      totalTokenSupply
      totalBondedToken
    }
    selectedTranscoder @client {
      __typename
      index
      id
    }
    currentRound: rounds(first: 1, orderBy: timestamp, orderDirection: desc) {
      id
    }
  }
`

export default withApollo(() => {
  const account = useAccount()

  const { data, loading } = useQuery(GET_DATA, {
    pollInterval: 10000,
    ssr: false,
  })

  return (
    <Page>
      {loading ? (
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner />
        </Flex>
      ) : (
        <>
          <Flex sx={{ paddingTop: 5, pr: 6, width: '70%' }}>
            <Orchestrators
              currentRound={data.currentRound[0]}
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
              account={account}
              transcoder={
                data.selectedTranscoder.id
                  ? data.selectedTranscoder
                  : data.transcoders[0]
              }
              protocol={data.protocol}
            />
          </Flex>
        </>
      )}
    </Page>
  )
})
