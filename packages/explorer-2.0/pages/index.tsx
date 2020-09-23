import { Flex } from 'theme-ui'
import { useQuery } from '@apollo/react-hooks'
import Orchestrators from '../components/Orchestrators'
import OrchestratorsIcon from '../public/img/orchestrators.svg'
import StakingWidget from '../components/StakingWidget'
import Spinner from '../components/Spinner'
import { useWeb3React } from '@web3-react/core'
import { getLayout } from '../layouts/main'
import { withApollo } from '../lib/apollo'
import { Box } from 'theme-ui'
import Approve from '../components/Approve'
import Utils from 'web3-utils'
import { useEffect } from 'react'
import { usePageVisibility } from '../hooks'
import orchestratorsViewQuery from '../queries/orchestratorsView.gql'
import accountQuery from '../queries/account.gql'

const Home = () => {
  const context = useWeb3React()
  const isVisible = usePageVisibility()
  const pollInterval = 20000

  const variables = {
    orderBy: 'totalStake',
    orderDirection: 'desc',
    where: {
      status: 'Registered',
    },
  }
  const {
    data,
    loading,
    startPolling: startPollingOrchestrators,
    stopPolling: stopPollingOrchestrators,
  } = useQuery(orchestratorsViewQuery, {
    variables,
    ssr: false,
    pollInterval,
  })
  const {
    data: dataMyAccount,
    loading: loadingMyAccount,
    startPolling: startPollingMyAccount,
    stopPolling: stopPollingMyAccount,
  } = useQuery(accountQuery, {
    variables: {
      account: context?.account?.toLowerCase(),
    },
    pollInterval,
    skip: !context.active,
    ssr: false,
  })

  useEffect(() => {
    if (!isVisible) {
      stopPollingOrchestrators()
      stopPollingMyAccount()
    } else {
      startPollingOrchestrators(pollInterval)
      startPollingMyAccount(pollInterval)
    }
  }, [isVisible])

  return (
    <>
      {!data && (loading || loadingMyAccount) ? (
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
            <h1
              sx={{
                fontWeight: 600,
                mb: [4, 4, 4, 5],
                display: ['none', 'none', 'none', 'flex'],
                alignItems: 'center',
              }}
            >
              <OrchestratorsIcon
                sx={{ width: 32, height: 32, mr: 2, color: 'primary' }}
              />{' '}
              Orchestrators
            </h1>
            <Orchestrators
              currentRound={data.protocol.currentRound}
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
              transcoders={data.transcoders.filter((t) => t.active)}
              delegator={dataMyAccount?.delegator}
              currentRound={data.protocol.currentRound}
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
