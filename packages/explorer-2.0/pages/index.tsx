import { Flex } from 'theme-ui'
import { useQuery } from '@apollo/react-hooks'
import Orchestrators from '../components/Orchestrators'
import StakingWidget from '../components/StakingWidget'
import Spinner from '../components/Spinner'
import gql from 'graphql-tag'
import { useAccount } from '../hooks'
import { useWeb3React } from '@web3-react/core'
import Layout from '../layouts/main'
import { withApollo } from '../lib/apollo'
import ClaimBanner from '../components/ClaimBanner'
import { Box } from 'theme-ui'
import Approve from '../components/Approve'
import Utils from 'web3-utils'

const GET_DATA = gql`
  {
    transcoders(
      where: {
        delegator_not: null
        id_not: "0x0000000000000000000000000000000000000000"
      }
      orderBy: totalStake
      orderDirection: desc
    ) {
      id
      active
      accruedFees
      feeShare
      activationRound
      deactivationRound
      rewardCut
      active
      totalStake
      threeBoxSpace {
        __typename
        did
        name
        website
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
      threeBoxSpace {
        __typename
        name
        website
        description
        image
      }
    }
    currentRound: rounds(first: 1, orderBy: timestamp, orderDirection: desc) {
      id
    }
  }
`

export default withApollo(() => {
  const context = useWeb3React()
  const myAccount = useAccount(context.account)
  const { data, loading, error } = useQuery(GET_DATA, {
    ssr: false,
  })

  if (error) {
    console.log(error)
  }

  return (
    <Layout headerTitle="Orchestrators">
      {loading ? (
        <Flex
          sx={{
            height: [
              'calc(100vh - 100px)',
              'calc(100vh - 100px)',
              'calc(100vh - 100px)',
              '100vh',
            ],
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner />
        </Flex>
      ) : (
        <Flex sx={{ width: '100%' }}>
          <Flex
            sx={{
              flexDirection: 'column',
              paddingTop: [0, 0, 0, 5],
              pr: [0, 0, 0, 0, 5],
              width: ['100%', '100%', '100%', '100%', '72%'],
            }}
          >
            {context.active && (
              <Box sx={{ display: ['none', 'none', 'none', 'block'] }}>
                {myAccount.account &&
                  parseFloat(Utils.fromWei(myAccount.account.allowance)) ===
                    0 &&
                  parseFloat(Utils.fromWei(myAccount.account.tokenBalance)) !==
                    0 && <Approve account={myAccount.account} banner={true} />}
              </Box>
            )}
            {context.active && myAccount.delegator?.lastClaimRound && (
              <ClaimBanner
                account={myAccount.account}
                delegator={myAccount.delegator}
                currentRound={data.currentRound[0]}
              />
            )}
            <Orchestrators
              currentRound={data.currentRound[0]}
              transcoders={data.transcoders}
            />
          </Flex>
          <Flex
            sx={{
              display: ['none', 'none', 'none', 'none', 'flex'],
              position: 'sticky',
              alignSelf: 'flex-start',
              top: 5,
              width: '28%',
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
    </Layout>
  )
})
