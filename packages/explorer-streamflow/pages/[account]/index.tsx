/** @jsx jsx */
import React from 'react'
import { useRouter } from 'next/router'
import { jsx, Flex } from 'theme-ui'
import Layout from '../../components/Layout'
import StakingWidget from '../../components/StakingWidget'
import Profile from '../../components/Profile'
import Tabs from '../../components/Tabs'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useWeb3Context } from 'web3-react'
import { withApollo } from '../../lib/apollo'
import CircularProgress from '@material-ui/core/CircularProgress'

const GET_DATA = gql`
  query($transcoderID: ID!) {
    transcoder(id: $transcoderID) {
      id
    }
    protocol {
      totalTokenSupply
      totalBondedToken
    }
  }
`

const Overview = () => {
  const context = useWeb3Context()
  const router = useRouter()
  const { account } = router.query
  const { data, loading } = useQuery(GET_DATA, {
    variables: { transcoderID: account },
    notifyOnNetworkStatusChange: true,
    ssr: true,
  })
  const isOrchestrator = data && data.transcoder && data.transcoder.id
  const views = [
    {
      name: 'Staking',
      href: '/[account]',
      as: `/${account}`,
      isActive: true,
    },
    {
      name: 'Earned Fees',
      href: '/[account]/fees',
      as: `/${account}/fees`,
    },
    {
      name: 'History',
      href: '/[account]/history',
      as: `/${account}/history`,
    },
    {
      name: 'Settings',
      href: '/[account]/settings',
      as: `/${account}/settings`,
    },
  ]

  return (
    <Layout>
      <Flex
        sx={{
          width: 'calc(100% - 256px)',
          maxWidth: 1300,
          margin: '0 auto',
          px: 5,
        }}
      >
        <Flex
          sx={{ paddingTop: 5, flexDirection: 'column', pr: 6, width: '70%' }}
        >
          {loading ? (
            <Flex sx={{ alignSelf: 'center', color: 'primary' }}>
              <CircularProgress size={24} color="inherit" />
            </Flex>
          ) : (
            <>
              <Profile
                account={account}
                isOrchestrator={isOrchestrator}
                isConnectedAccount={context.account == account}
                styles={{ mb: 4 }}
              />
              <Tabs tabs={views} />
            </>
          )}
        </Flex>

        <Flex
          sx={{
            position: 'sticky',
            alignSelf: 'flex-start',
            top: 4,
            bg: 'surface',
            minHeight: 300,
            borderRadius: 2,
            width: '30%',
            justifyContent: 'center',
          }}
        >
          {loading ? (
            <Flex sx={{ alignSelf: 'center', color: 'primary' }}>
              <CircularProgress size={24} color="inherit" />
            </Flex>
          ) : (
            <StakingWidget protocol={data.protocol} />
          )}
        </Flex>
      </Flex>
    </Layout>
  )
}
export default withApollo(Overview)
