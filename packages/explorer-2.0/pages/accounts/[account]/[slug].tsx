import { Flex, Box } from 'theme-ui'
import { useRouter } from 'next/router'
import Layout from '../../../layouts/main'
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
import { useWeb3React } from '@web3-react/core'
import { getDelegatorStatus } from '../../../lib/utils'
import HistoryView from '../../../components/HistoryView'
import { withApollo } from '../../../lib/apollo'
import StakingWidgetModal from '../../../components/StakingWidgetModal'
import useWindowSize from 'react-use/lib/useWindowSize'
import ClaimBanner from '../../../components/ClaimBanner'

const GET_DATA = gql`
  query($account: ID!) {
    transcoder(id: $account) {
      id
      rewardCut
      feeShare
      totalStake
      active
      threeBoxSpace {
        __typename
        name
        website
        image
        description
      }
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

export default withApollo(() => {
  const router = useRouter()
  const context = useWeb3React()
  const { width } = useWindowSize()
  const { query, asPath } = router
  const slug = query.slug
  const { account, delegator, threeBoxSpace, refetch } = useAccount(
    query.account,
  )
  const { data, loading } = useQuery(GET_DATA, {
    variables: {
      account: query.account.toString().toLowerCase(),
    },
    ssr: false,
  })

  const SELECTED_STAKING_ACTION = gql`
    {
      selectedStakingAction @client
    }
  `
  const { data: selectedStakingAction } = useQuery(SELECTED_STAKING_ACTION)

  const myAccount = useAccount(context.account)

  if (loading) {
    return (
      <Layout>
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
      </Layout>
    )
  }

  const transcoder: Transcoder = data.transcoder
  const protocol: Protocol = data.protocol
  const currentRound: Round = data.currentRound[0]
  const isMyAccount: boolean =
    context.account && context.account == query.account
  const isStaked: boolean = !!(delegator && delegator?.delegate)
  const hasLivepeerToken: boolean =
    account && parseFloat(Utils.fromWei(account.tokenBalance)) > 0
  let role: string

  if (data?.transcoder?.id && isStaked) {
    role = 'Orchestrator'
  } else if (data?.delegator?.id || hasLivepeerToken) {
    role = 'Tokenholder'
  } else {
    role = 'Lurker'
  }

  const isMyDelegate =
    query.account.toString() === myAccount?.delegator?.delegate?.id
  const desktopWidth1 = [
    role == 'Orchestrator' || isMyDelegate ? '65%' : '100%',
  ]
  const desktopWidth2 = [
    role == 'Orchestrator' || isMyDelegate ? '70%' : '100%',
  ]

  const tabs: Array<TabType> = getTabs(
    role,
    query.account.toString(),
    asPath,
    isMyDelegate,
  )

  const headerTitle =
    process.env.THREEBOX_ENABLED && threeBoxSpace && threeBoxSpace.name
      ? threeBoxSpace.name
      : query.account
          .toString()
          .replace(query.account.toString().slice(5, 39), '…')

  return (
    <Layout headerTitle={headerTitle}>
      <Flex
        sx={{
          flexDirection: 'column',
          mb: 8,
          pr: [0, 0, 0, 6],
          pt: [1, 1, 1, 5],
          width: ['100%', '100%', '100%', desktopWidth1, desktopWidth2],
        }}
      >
        {context.active && myAccount?.delegator?.lastClaimRound && (
          <ClaimBanner
            account={myAccount.account}
            delegator={myAccount.delegator}
            currentRound={currentRound}
          />
        )}
        <Profile
          myAccount={myAccount}
          account={query.account.toString()}
          delegator={delegator}
          threeBoxSpace={threeBoxSpace}
          hasLivepeerToken={hasLivepeerToken}
          isMyDelegate={isMyDelegate}
          isMyAccount={isMyAccount}
          refetch={refetch}
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
      {(role == 'Orchestrator' || isMyDelegate) &&
        (width > 1020 ? (
          <Flex
            sx={{
              display: ['none', 'none', 'none', 'flex'],
              position: 'sticky',
              alignSelf: 'flex-start',
              top: 5,
              width: ['40%', '40%', '40%', '35%', '30%'],
            }}
          >
            <StakingWidget
              currentRound={data.currentRound[0]}
              delegator={myAccount.delegator}
              account={myAccount.account}
              transcoder={transcoder}
              protocol={protocol}
            />
          </Flex>
        ) : (
          <StakingWidgetModal>
            <StakingWidget
              selectedAction={selectedStakingAction?.selectedStakingAction}
              currentRound={data.currentRound[0]}
              delegator={myAccount.delegator}
              account={myAccount.account}
              transcoder={transcoder}
              protocol={protocol}
            />
          </StakingWidgetModal>
        ))}
    </Layout>
  )
})

function getTabs(
  role: string,
  account: string,
  asPath: string,
  isMyDelegate: boolean,
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
  if (role == 'Orchestrator' || isMyDelegate) {
    tabs.unshift({
      name: 'Campaign',
      href: '/accounts/[account]/[slug]',
      as: `/accounts/${account}/campaign`,
      isActive: asPath == `/accounts/${account}/campaign`,
    })
  }

  return tabs
}
