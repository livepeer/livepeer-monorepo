import { Flex, Styled } from 'theme-ui'
import { useQuery } from '@apollo/client'
import Orchestrators from '../components/Orchestrators'
import { useWeb3React } from '@web3-react/core'
import { getLayout } from '../layouts/main'
import { withApollo } from '../lib/apollo'
import { Box } from 'theme-ui'
import Approve from '../components/Approve'
import Utils from 'web3-utils'
import { useEffect } from 'react'
import { usePageVisibility } from '../hooks'
import accountQuery from '../queries/account.gql'

const OrchestratorsPage = () => {
  const context = useWeb3React()
  const isVisible = usePageVisibility()
  const pollInterval = 20000

  const {
    data: dataMyAccount,
    startPolling: startPollingMyAccount,
    stopPolling: stopPollingMyAccount,
  } = useQuery(accountQuery, {
    variables: {
      account: context?.account?.toLowerCase(),
    },
    pollInterval,
    skip: !context.active,
  })

  useEffect(() => {
    if (!isVisible) {
      stopPollingMyAccount()
    } else {
      startPollingMyAccount(pollInterval)
    }
  }, [isVisible])

  return (
    <>
      <Flex sx={{ width: '100%' }}>
        <Flex
          sx={{
            flexDirection: 'column',
            mt: [3, 3, 3, 5],
            width: '100%',
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
          <Styled.h1
            sx={{
              fontSize: [3, 3, 26],
              fontWeight: 600,
              mb: 22,
              display: ['none', 'none', 'none', 'flex'],
              alignItems: 'center',
            }}
          >
            Top Orchestrators
          </Styled.h1>
          <Orchestrators pageSize={30} />
        </Flex>
      </Flex>
    </>
  )
}

OrchestratorsPage.getLayout = getLayout

export default withApollo({
  ssr: false,
})(OrchestratorsPage)
