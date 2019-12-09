/** @jsx jsx */
import { jsx, Flex } from 'theme-ui'
import { useQuery } from '@apollo/react-hooks'
import Orchestrators from '../components/Orchestrators'
import StakingWidget from '../components/StakingWidget'
import Spinner from '../components/Spinner'
import gql from 'graphql-tag'
import { useAccount } from '../hooks'
import { useWeb3Context } from 'web3-react'
import { getLayout } from '../layouts/main'

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
      threeBoxSpace {
        __typename
        id
        did
        name
        url
        description
        image
      }
      delegator {
        startRound
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
      inflation
      inflationChange
    }
    selectedTranscoder @client {
      __typename
      index
      rewardCut
      id
    }
    currentRound: rounds(first: 1, orderBy: timestamp, orderDirection: desc) {
      id
    }
  }
`

const Index = () => {
  const context = useWeb3Context()
  const myAccount = useAccount(context.account)
  const { data, loading, error } = useQuery(GET_DATA, {
    ssr: false,
  })

  if (error) {
    console.log(error)
  }

  console.log(data)

  return (
    <>
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
        <Flex sx={{ width: '100%' }}>
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
              top: 5,
              width: '30%',
            }}
          >
            <StakingWidget
              delegator={myAccount.delegator}
              currentRound={data.currentRound[0]}
              account={myAccount.account}
              transcoder={
                data.selectedTranscoder.id
                  ? data.selectedTranscoder
                  : data.transcoders[0]
              }
              protocol={data.protocol}
            />
          </Flex>
        </Flex>
      )}
    </>
  )
}

Index.getLayout = getLayout
Index.displayName = ''
export default () => Index()
