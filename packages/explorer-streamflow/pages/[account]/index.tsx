/** @jsx jsx */
import React from 'react'
import { useRouter } from 'next/router'
import { jsx, Flex, Styled } from 'theme-ui'
import Layout from '../../components/Layout'
import StakingWidget from '../../components/StakingWidget'
import Profile from '../../components/Profile'
import Tabs, { TabType } from '../../components/Tabs'
import List from '../../components/List'
import ListItem from '../../components/ListItem'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useWeb3Context } from 'web3-react'
import { withApollo } from '../../lib/apollo'
import CircularProgress from '@material-ui/core/CircularProgress'
import Card from '../../components/Card'

const GET_DATA = gql`
  query($account: ID!) {
    delegator(id: $account) {
      delegate {
        id
      }
      unbondingLocks {
        id
        amount
        withdrawRound {
          id
        }
      }
    }
    # The subgraph subgraph and graphql-sdk use different types for the eth
    # address so we have to pass two separate inputs
    transcoder(id: $account) {
      id
    }
    protocol {
      totalTokenSupply
      totalBondedToken
    }
    currentRound: rounds(first: 1, orderBy: timestamp, orderDirection: desc) {
      id
    }
    # transactions(address: $address) {
    #   id
    # }
  }
`

export default withApollo(() => {
  const context = useWeb3Context()
  const router = useRouter()
  const query = router.query
  const account = query.account as string
  const { data, loading } = useQuery(GET_DATA, {
    variables: {
      account: account.toLowerCase(),
      address: account.toLowerCase(),
    },
    notifyOnNetworkStatusChange: true,
    ssr: false,
  })
  console.log(data)
  return null
  if (loading) {
    return (
      <Layout>
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div sx={{ color: 'primary' }}>
            <CircularProgress size={24} color="inherit" />
          </div>
        </Flex>
      </Layout>
    )
  }
  const isOrchestrator = data && data.transcoder && data.transcoder.id
  const transcoder = isOrchestrator ? data.transcoder : data.delegator.delegate
  const tabs = getTabs(isOrchestrator, account)
  const unbondingLocks = data.delegator.unbondingLocks
  const currentRound = data.currentRound[0].id
  const isConnectedAccount = context.account == account
  const pendingStakeTransactions = unbondingLocks.filter(
    item =>
      item['withdrawRound'].id !== '0' &&
      item['withdrawRound'].id > currentRound,
  )

  const completedStakeTransactions = unbondingLocks.filter(
    item =>
      item['withdrawRound'].id !== '0' &&
      item['withdrawRound'].id <= currentRound,
  )

  console.log(data)
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
            isOrchestrator={isOrchestrator}
            isConnectedAccount={isConnectedAccount}
            styles={{ mb: 4 }}
          />
          <Tabs tabs={tabs} sx={{ mb: 5 }} />
          <Card
            sx={{ mb: 2 }}
            title="Staked Towards"
            subtitle={
              <div
                sx={{
                  fontSize: 3,
                  fontWeight: 'heading',
                  color: 'text',
                  lineHeight: 'heading',
                }}
              >
                {transcoder.id.replace(transcoder.id.slice(7, 37), '…')}
              </div>
            }
          />
          <div
            sx={{
              display: 'grid',
              gridGap: 2,
              gridTemplateColumns: `repeat(auto-fit, minmax(128px, 1fr))`,
              mb: 5,
            }}
          >
            <Card
              sx={{ flex: 1, mb: 2 }}
              title="Total Staked"
              subtitle={
                <div
                  sx={{
                    fontSize: 5,
                    color: 'text',
                    lineHeight: 'heading',
                    fontFamily: 'monospace',
                  }}
                >
                  612.00<span sx={{ ml: 1, fontSize: 1 }}>LPT</span>
                </div>
              }
            ></Card>
            <Card
              sx={{ flex: 1, mb: 2 }}
              title="Equity"
              subtitle={
                <div
                  sx={{
                    fontSize: 5,
                    color: 'text',
                    lineHeight: 'heading',
                    fontFamily: 'monospace',
                  }}
                >
                  0.004%
                </div>
              }
            ></Card>
          </div>
          {!!pendingStakeTransactions.length && (
            <List
              sx={{ mb: 6 }}
              header={<Styled.h4>Pending Transactions</Styled.h4>}
            >
              {pendingStakeTransactions.map(lock => (
                <ListItem key={lock.id}>{lock.id}</ListItem>
              ))}
            </List>
          )}
          <List header={<Styled.h4>Completed Transactions</Styled.h4>}>
            {!completedStakeTransactions.length && (
              <div sx={{ fontSize: 1, mt: 2 }}>No History</div>
            )}
            {completedStakeTransactions.map(lock => (
              <ListItem key={lock.id}>{lock.id}</ListItem>
            ))}
          </List>
        </Flex>
        {(isOrchestrator || isConnectedAccount) && (
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
              <StakingWidget transcoder={transcoder} protocol={data.protocol} />
            )}
          </Flex>
        )}
      </Flex>
    </Layout>
  )
})

function getTabs(isOrchestrator: boolean, account): Array<TabType> {
  let tabs: Array<TabType> = [
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
  if (isOrchestrator) {
    tabs.unshift(
      {
        name: 'Campaign',
        href: '/[account]/',
        as: `/${account}`,
        isActive: true,
      },
      {
        name: 'Staking',
        href: '/[account]/staking',
        as: `/${account}`,
      },
    )
  } else {
    tabs.unshift({
      name: 'Staking',
      href: '/[account]/',
      as: `/${account}`,
      isActive: true,
    })
  }

  return tabs
}
