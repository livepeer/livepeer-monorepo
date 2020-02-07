import { Flex } from 'theme-ui'
import { useQuery } from '@apollo/react-hooks'
import Orchestrators from '../components/Orchestrators'
import StakingWidget from '../components/StakingWidget'
import Spinner from '../components/Spinner'
import { useWeb3React } from '@web3-react/core'
import Layout from '../layouts/main'
import { withApollo } from '../lib/apollo'
import ClaimBanner from '../components/ClaimBanner'
import { Box } from 'theme-ui'
import Approve from '../components/Approve'
import Utils from 'web3-utils'

export default withApollo(() => {
  const orchestratorsViewQuery = require('../queries/orchestratorsView.gql')
  const accountQuery = require('../queries/account.gql')
  const context = useWeb3React()
  const { data, loading, error } = useQuery(orchestratorsViewQuery, {
    ssr: false,
  })
  const { data: myAccountData, loading: myAccountLoading } = useQuery(
    accountQuery,
    {
      variables: {
        account: context?.account?.toLowerCase(),
      },
      skip: !context.active,
    },
  )

  if (error) {
    console.log(error)
  }

  return (
    <Layout headerTitle="Orchestrators">
      {loading || myAccountLoading ? (
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
              pt: [1, 1, 1, 5],
              pr: [0, 0, 0, 0, 5],
              width: ['100%', '100%', '100%', '100%', '72%'],
            }}
          >
            {context.active && (
              <Box>
                {myAccountData &&
                  parseFloat(Utils.fromWei(myAccountData.account.allowance)) ===
                    0 &&
                  parseFloat(
                    Utils.fromWei(myAccountData.account.tokenBalance),
                  ) !== 0 && (
                    <Approve account={myAccountData.account} banner={true} />
                  )}
              </Box>
            )}
            {context.active && myAccountData.delegator?.lastClaimRound && (
              <ClaimBanner
                account={myAccountData.account}
                delegator={myAccountData.delegator}
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
              delegator={myAccountData?.delegator}
              currentRound={data.currentRound[0]}
              account={myAccountData?.account}
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
