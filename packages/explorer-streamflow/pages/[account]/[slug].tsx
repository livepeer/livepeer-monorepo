/** @jsx jsx */
import React from 'react'
import { jsx, Flex } from 'theme-ui'
import { useRouter } from 'next/router'
import { useWeb3Context } from 'web3-react'
import Page from '../../layouts/main'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import Tabs, { TabType } from '../../components/Tabs'
import Profile from '../../components/Profile'
import StakingWidget from '../../components/StakingWidget'
import TokenholdersView from '../../components/TokenholdersView'
import CampaignView from '../../components/CampaignView'
import StakingView from '../../components/StakingView'
import { withApollo } from '../../lib/apollo'
import { Transcoder, Delegator, Protocol } from '../../@types'
import Spinner from '../../components/Spinner'

const GET_DATA = gql`
  query($account: ID!) {
    delegator(id: $account) {
      id
      pendingStake
      status
      delegate {
        id
      }
    }
    transcoder(id: $account) {
      id
      rewardCut
      feeShare
      totalStake
      active
    }
    protocol {
      totalTokenSupply
      totalBondedToken
    }
    currentRound: rounds(first: 1, orderBy: timestamp, orderDirection: desc) {
      id
    }
  }
`

export default withApollo(() => {
  const context = useWeb3Context()
  const router = useRouter()
  const { query, asPath } = router
  const account = query.account as string
  const slug = query.slug

  const { data, loading, error } = useQuery(GET_DATA, {
    variables: {
      account: account.toLowerCase(),
      address: account.toLowerCase(),
    },
    notifyOnNetworkStatusChange: true,
    ssr: false,
  })

  if (error) {
    console.error(error)
  }

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
  const transcoder: Transcoder = data.transcoder
  const delegator: Delegator = data.delegator
  const protocol: Protocol = data.protocol
  const isConnected: boolean = context.account == account
  const isOrchestrator: boolean = data.transcoder && data.transcoder.id
  const role = isOrchestrator ? 'Orchestrator' : 'Tokenholder'
  const tabs: Array<TabType> = getTabs(role, account, asPath)
  const isStaked = delegator && delegator.delegate

  return (
    <Page>
      <Flex
        sx={{
          width: 'calc(100% - 256px)',
          maxWidth: 1300,
          margin: '0 auto',
          px: 5,
        }}
      >
        <Flex
          sx={{
            paddingTop: 5,
            mb: 8,
            flexDirection: 'column',
            pr: 6,
            width: '70%',
          }}
        >
          <Profile
            account={account}
            delegator={delegator}
            transcoder={transcoder}
            role={role}
            isConnected={isConnected}
            styles={{ mb: 4 }}
          />
          <Tabs sx={{ mb: 4 }} tabs={tabs} />
          {slug == 'campaign' && <CampaignView />}
          {slug == 'tokenholders' && <TokenholdersView />}
          {slug == 'staking' && <StakingView />}
        </Flex>
        {(role == 'Orchestrator' || (isConnected && isStaked)) && (
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
            <StakingWidget
              transcoder={
                role == 'Orchestrator' ? transcoder : delegator.delegate
              }
              protocol={protocol}
            />
          </Flex>
        )}
      </Flex>
    </Page>
  )
})

function getTabs(
  role: string,
  account: string,
  asPath: string,
): Array<TabType> {
  let tabs: Array<TabType> = [
    {
      name: 'Staking',
      href: '/[account]/[slug]',
      as: `/${account}/staking`,
      isActive: asPath == `/${account}/staking`,
    },
    {
      name: 'Earned Fees',
      href: '/[account]/[slug]',
      as: `/${account}/fees`,
      isActive: asPath == `/${account}/fees`,
    },
    {
      name: 'History',
      href: '/[account]/[slug]',
      as: `/${account}/history`,
      isActive: asPath == `/${account}/history`,
    },
    {
      name: 'Settings',
      href: '/[account]/[slug]',
      as: `/${account}/settings`,
      isActive: asPath == `/${account}/settings`,
    },
  ]
  if (role == 'Orchestrator') {
    tabs.splice(0, 0, {
      name: 'Tokenholders',
      href: '/[account]/[slug]',
      as: `/${account}/tokenholders`,
      isActive: asPath == `/${account}/tokenholders`,
    })
    tabs.unshift({
      name: 'Campaign',
      href: '/[account]/[slug]',
      as: `/${account}/campaign`,
      isActive: asPath == `/${account}/campaign`,
    })
  }

  return tabs
}
