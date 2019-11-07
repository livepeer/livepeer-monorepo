/** @jsx jsx */
import React from 'react'
import { jsx, Flex } from 'theme-ui'
import { useRouter } from 'next/router'
import { getLayout } from '../../../layouts/main'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import Tabs, { TabType } from '../../../components/Tabs'
import Profile from '../../../components/Profile'
import StakingWidget from '../../../components/StakingWidget'
import TokenholdersView from '../../../components/TokenholdersView'
import CampaignView from '../../../components/CampaignView'
import StakingView from '../../../components/StakingView'
import { Transcoder, Protocol, Round } from '../../../@types'
import Spinner from '../../../components/Spinner'
import { useAccount } from '../../../hooks'
import Utils from 'web3-utils'
import { useWeb3Context } from 'web3-react'
import { getDelegatorStatus } from '../../../lib/utils'
import HistoryView from '../../../components/HistoryView'

const GET_DATA = gql`
  query($account: ID!) {
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
      inflation
      inflationChange
    }
    currentRound: rounds(first: 1, orderBy: timestamp, orderDirection: desc) {
      id
    }
  }
`

const AccountPage = () => {
  const router = useRouter()
  const context = useWeb3Context()
  const { query, asPath } = router
  const slug = query.slug
  const { account, delegator } = useAccount(query.account.toString())
  const { data, loading, error } = useQuery(GET_DATA, {
    variables: {
      account: query.account.toString().toLowerCase(),
    },
    ssr: false,
  })

  const myAccount = useAccount(context.account)

  if (error) {
    console.error(error)
  }

  if (loading) {
    return (
      <>
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner />
        </Flex>
      </>
    )
  }

  const transcoder: Transcoder = data.transcoder
  const protocol: Protocol = data.protocol
  const currentRound: Round = data.currentRound[0]
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
    <>
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
          status={getDelegatorStatus(delegator, currentRound)}
          transcoder={transcoder}
        />
        <Tabs tabs={tabs} />
        {slug == 'campaign' && <CampaignView />}
        {slug == 'tokenholders' && <TokenholdersView />}
        {slug == 'staking' && <StakingView />}
        {slug == 'history' && <HistoryView />}
      </Flex>
      {(role == 'Orchestrator' || (isMyAccount && isStaked)) && (
        <Flex
          sx={{
            alignSelf: 'flex-start',
            position: 'sticky',
            top: 5,
            width: '30%',
          }}
        >
          <StakingWidget
            currentRound={data.currentRound[0]}
            delegator={myAccount.delegator}
            account={myAccount.account}
            transcoder={
              role == 'Orchestrator' ? transcoder : delegator.delegate
            }
            protocol={protocol}
          />
        </Flex>
      )}
    </>
  )
}

function getTabs(
  role: string,
  account: string,
  asPath: string,
): Array<TabType> {
  let tabs: Array<TabType> = [
    {
      name: 'Staking',
      href: '/accounts/[account]/[slug]',
      as: `/accounts/${account}/staking`,
      isActive: asPath == `/accounts/${account}/staking`,
    },
    {
      name: 'History',
      href: '/accounts/[account]/[slug]',
      as: `/accounts/${account}/history`,
      isActive: asPath == `/accounts/${account}/history`,
    },
  ]
  if (role == 'Orchestrator') {
    // tabs.splice(0, 0, {
    //   name: 'Tokenholders',
    //   href: '/accounts/[account]/[slug]',
    //   as: `/accounts/${account}/tokenholders`,
    //   isActive: asPath == `/accounts/${account}/tokenholders`,
    // })
    tabs.unshift({
      name: 'Campaign',
      href: '/accounts/[account]/[slug]',
      as: `/accounts/${account}/campaign`,
      isActive: asPath == `/accounts/${account}/campaign`,
    })
  }

  return tabs
}

AccountPage.getLayout = getLayout
AccountPage.displayName = ''
export default AccountPage
