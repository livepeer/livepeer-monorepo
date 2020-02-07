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
import Spinner from '../../../components/Spinner'
import Utils from 'web3-utils'
import { useWeb3React } from '@web3-react/core'
import { getDelegatorStatus } from '../../../lib/utils'
import HistoryView from '../../../components/HistoryView'
import { withApollo } from '../../../lib/apollo'
import StakingWidgetModal from '../../../components/StakingWidgetModal'
import useWindowSize from 'react-use/lib/useWindowSize'
import ClaimBanner from '../../../components/ClaimBanner'
import Approve from '../../../components/Approve'

export default withApollo(() => {
  const accountViewQuery = require('../../../queries/accountView.gql')
  const accountQuery = require('../../../queries/account.gql')
  const router = useRouter()
  const context = useWeb3React()
  const { width } = useWindowSize()
  const { query, asPath } = router
  const slug = query.slug
  const { data, loading, refetch } = useQuery(accountViewQuery, {
    variables: {
      account: query.account.toString().toLowerCase(),
    },
    ssr: false,
  })

  const { data: myAccountData, loading: myAccountLoading } = useQuery(
    accountQuery,
    {
      variables: {
        account: context?.account?.toLowerCase(),
      },
      skip: !context.active,
      pollInterval: 10000,
      ssr: false,
    },
  )

  const SELECTED_STAKING_ACTION = gql`
    {
      selectedStakingAction @client
    }
  `
  const { data: selectedStakingAction } = useQuery(SELECTED_STAKING_ACTION)

  if (loading || myAccountLoading) {
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

  const isMyAccount: boolean =
    context.account && context.account == query.account
  const isStaked: boolean = !!data.delegator?.delegate
  const hasLivepeerToken: boolean =
    data.account && parseFloat(Utils.fromWei(data.account.tokenBalance)) > 0
  let role: string

  if (data?.transcoder?.id && isStaked) {
    role = 'Orchestrator'
  } else if (data?.delegator?.id || hasLivepeerToken) {
    role = 'Tokenholder'
  } else {
    role = 'Lurker'
  }

  const isMyDelegate =
    query.account.toString() === myAccountData?.delegator?.delegate?.id

  const tabs: Array<TabType> = getTabs(
    role,
    query.account.toString(),
    asPath,
    isMyDelegate,
  )

  const headerTitle =
    process.env.THREEBOX_ENABLED && data?.threeBoxSpace?.name
      ? data.threeBoxSpace.name
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
          width: [
            '100%',
            '100%',
            '100%',
            role == 'Orchestrator' || isMyDelegate ? '72%' : '100%',
          ],
        }}
      >
        {context.active && (
          <Box>
            {myAccountData.account &&
              parseFloat(Utils.fromWei(myAccountData.account.allowance)) ===
                0 &&
              parseFloat(Utils.fromWei(myAccountData.account.tokenBalance)) !==
                0 && <Approve account={myAccountData.account} banner={true} />}
          </Box>
        )}
        {context.active && myAccountData?.delegator?.lastClaimRound && (
          <ClaimBanner
            account={myAccountData.account}
            delegator={myAccountData.delegator}
            currentRound={data.currentRound[0]}
          />
        )}
        <Profile
          account={query.account.toString()}
          delegator={data.delegator}
          threeBoxSpace={data.threeBoxSpace}
          hasLivepeerToken={hasLivepeerToken}
          isMyDelegate={isMyDelegate}
          isMyAccount={isMyAccount}
          refetch={refetch}
          role={role}
          sx={{ mb: 4 }}
          status={getDelegatorStatus(data.delegator, data.currentRound[0])}
          transcoder={data.transcoder}
        />
        <Tabs tabs={tabs} />
        {slug == 'campaign' && <CampaignView transcoder={data.transcoder} />}
        {slug == 'tokenholders' && <TokenholdersView />}
        {slug == 'staking' && (
          <StakingView
            delegator={data.delegator}
            protocol={data.protocol}
            currentRound={data.currentRound[0]}
          />
        )}
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
              width: ['40%', '40%', '40%', '28%'],
            }}
          >
            <StakingWidget
              currentRound={data.currentRound[0]}
              delegator={myAccountData?.delegator}
              account={myAccountData?.account}
              transcoder={data.transcoder}
              protocol={data.protocol}
            />
          </Flex>
        ) : (
          <StakingWidgetModal>
            <StakingWidget
              selectedAction={selectedStakingAction?.selectedStakingAction}
              currentRound={data.currentRound[0]}
              delegator={myAccountData?.delegator}
              account={myAccountData?.account}
              transcoder={data.transcoder}
              protocol={data.protocol}
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
      name: 'Earned Fees',
      href: '/accounts/[account]/[slug]',
      as: `/accounts/${account}/fees`,
      isActive: asPath == `/accounts/${account}/fees`,
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
