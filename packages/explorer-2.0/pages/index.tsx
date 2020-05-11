import { Flex } from 'theme-ui'
import { useQuery } from '@apollo/react-hooks'
import Orchestrators from '../components/Orchestrators'
import StakingWidget from '../components/StakingWidget'
import Spinner from '../components/Spinner'
import { useWeb3React } from '@web3-react/core'
import Layout, { getLayout } from '../layouts/main'
import { withApollo } from '../lib/apollo'
import ClaimBanner from '../components/ClaimBanner'
import { Box } from 'theme-ui'
import Approve from '../components/Approve'
import Utils from 'web3-utils'
import { useEffect } from 'react'

const Home = () => {
  const orchestratorsViewQuery = require('../queries/orchestratorsView.gql')
  const accountQuery = require('../queries/account.gql')
  const context = useWeb3React()
  const { data, loading, refetch } = useQuery(orchestratorsViewQuery, {
    pollInterval: 10000,
    ssr: false,
  })
  const {
    data: dataMyAccount,
    loading: loadingMyAccount,
    refetch: refetchMyAccount,
  } = useQuery(accountQuery, {
    variables: {
      account: context?.account?.toLowerCase(),
    },
    pollInterval: 10000,
    skip: !context.active,
    ssr: false,
  })

  // Refetch data if we detect a network change
  useEffect(() => {
    refetch()
    if (context.account) {
      refetchMyAccount()
    }
  }, [context.chainId])

  return (
    <>
      {loading || loadingMyAccount ? (
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
                {dataMyAccount &&
                  parseFloat(Utils.fromWei(dataMyAccount.account.allowance)) ===
                    0 &&
                  parseFloat(
                    Utils.fromWei(dataMyAccount.account.tokenBalance),
                  ) !== 0 && (
                    <Approve account={dataMyAccount.account} banner={true} />
                  )}
              </Box>
            )}
            {context.active && dataMyAccount?.delegator?.lastClaimRound && (
              <ClaimBanner
                delegator={dataMyAccount.delegator}
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
              delegator={dataMyAccount?.delegator}
              currentRound={data.currentRound[0]}
              account={dataMyAccount?.account}
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

Home.getLayout = getLayout

export default withApollo({
  ssr: false,
})(Home)
