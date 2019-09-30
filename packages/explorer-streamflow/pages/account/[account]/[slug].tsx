/** @jsx jsx */
import React from 'react'
import { jsx, Flex } from 'theme-ui'
import { useRouter } from 'next/router'
import Page from '../../../layouts/main'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import Tabs, { TabType } from '../../../components/Tabs'
import Profile from '../../../components/Profile'
import StakingWidget from '../../../components/StakingWidget'
import TokenholdersView from '../../../components/TokenholdersView'
import CampaignView from '../../../components/CampaignView'
import StakingView from '../../../components/StakingView'
import { withApollo } from '../../../lib/apollo'
import { Transcoder, Delegator, Protocol } from '../../../@types'
import Spinner from '../../../components/Spinner'
import { useAccount } from '../../../hooks'
import Utils from 'web3-utils'
import { useWeb3Context } from 'web3-react'

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
  const account = useAccount()
  const router = useRouter()
  const context = useWeb3Context()
  const { query, asPath } = router
  const slug = query.slug

  const { data, loading, error } = useQuery(GET_DATA, {
    variables: {
      account: query.account.toString().toLowerCase(),
    },
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
  const isMyAccount: boolean =
    context.account && context.account == query.account
  const isStaked: boolean = !!(delegator && delegator.delegate)
  const hasLivepeerToken: boolean =
    account && Utils.fromWei(account.tokenBalance) > 0
  let role: string

  if (data.transcoder && data.transcoder.id) {
    role = 'Orchestrator'
  } else if ((data.delegator && data.delegator.id) || hasLivepeerToken) {
    role = 'Tokenholder'
  } else {
    role = 'Observer'
  }

  const tabs: Array<TabType> = getTabs(role, query.account.toString(), asPath)

  return (
    <Page>
      <Flex
        sx={{
          flexDirection: 'column',
          mb: 8,
          pr: 6,
          pt: 5,
          width:
            role == 'Orchestrator' || (isMyAccount && isStaked)
              ? '70%'
              : '100%',
        }}
      >
        <Profile
          account={query.account.toString()}
          delegator={delegator}
          hasLivepeerToken={hasLivepeerToken}
          isMyAccount={isMyAccount}
          role={role}
          sx={{ mb: 4 }}
          transcoder={transcoder}
        />
        <Tabs sx={{ mb: 4 }} tabs={tabs} />
        {slug == 'campaign' && <CampaignView />}
        {slug == 'tokenholders' && <TokenholdersView />}
        {slug == 'staking' && <StakingView />}
      </Flex>
      {(role == 'Orchestrator' || (isMyAccount && isStaked)) && (
        <Flex
          sx={{
            alignSelf: 'flex-start',
            borderRadius: 2,
            justifyContent: 'center',
            minHeight: 300,
            position: 'sticky',
            top: 4,
            width: '30%',
          }}
        >
          <StakingWidget
            account={account}
            transcoder={
              role == 'Orchestrator' ? transcoder : delegator.delegate
            }
            protocol={protocol}
          />
        </Flex>
      )}
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
      href: '/account/[account]/[slug]',
      as: `/account/${account}/staking`,
      isActive: asPath == `/account/${account}/staking`,
    },
    // {
    //   name: 'Earned Fees',
    //   href: '/account/[account]/[slug]',
    //   as: `/account/${account}/fees`,
    //   isActive: asPath == `/account/${account}/fees`,
    // },
    {
      name: 'History',
      href: '/account/[account]/[slug]',
      as: `/account/${account}/history`,
      isActive: asPath == `/account/${account}/history`,
    },
    {
      name: 'Settings',
      href: '/account/[account]/[slug]',
      as: `/account/${account}/settings`,
      isActive: asPath == `/account/${account}/settings`,
    },
  ]
  if (role == 'Orchestrator') {
    tabs.splice(0, 0, {
      name: 'Tokenholders',
      href: '/account/[account]/[slug]',
      as: `/account/${account}/tokenholders`,
      isActive: asPath == `/account/${account}/tokenholders`,
    })
    tabs.unshift({
      name: 'Campaign',
      href: '/account/[account]/[slug]',
      as: `/account/${account}/campaign`,
      isActive: asPath == `/account/${account}/campaign`,
    })
  }

  return tabs
}
