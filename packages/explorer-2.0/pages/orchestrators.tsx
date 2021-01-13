import { Flex, Styled } from 'theme-ui'
import { useQuery } from '@apollo/client'
import Orchestrators from '../components/Orchestrators'
import { useWeb3React } from '@web3-react/core'
import { getLayout } from '../layouts/main'
import { Box } from 'theme-ui'
import Approve from '../components/Approve'
import Utils from 'web3-utils'
import { useEffect } from 'react'
import { usePageVisibility } from '../hooks'
import accountQuery from '../queries/account.gql'
import { NextPage } from 'next'
import { withApollo, getStaticApolloProps } from '../apollo'
import Head from 'next/head'

type Params = {}
type Props = {}

const OrchestratorsPage = () => {
  const context = useWeb3React()
  const isVisible = usePageVisibility()
  const pollInterval = 30000

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
      <Head>
        <title>Livepeer Explorer - Orchestrators</title>
      </Head>
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
              mb: 4,
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

export default withApollo({ ssr: false })(OrchestratorsPage as NextPage)

export const getStaticProps = getStaticApolloProps<Props, Params>(
  OrchestratorsPage,
  {
    revalidate: 10,
  },
)
