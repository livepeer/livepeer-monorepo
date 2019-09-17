/** @jsx jsx */
import React from 'react'
import { jsx, Flex } from 'theme-ui'
import { useRouter } from 'next/router'
import { useWeb3Context } from 'web3-react'
import Tabs, { TabType } from '../components/Tabs'
import Profile from '../components/Profile'
import StakingWidget from '../components/StakingWidget'

export default ({ children, delegator, transcoder, protocol }: any) => {
  const context = useWeb3Context()
  const { query, pathname } = useRouter()

  const account = query.account as string
  const isConnected: boolean = context.account == account
  const isOrchestrator: boolean = transcoder && transcoder.id
  const role = isOrchestrator ? 'Orchestrator' : 'Tokenholder'
  const tabs: Array<TabType> = getTabs(role, account, pathname)
  const isStaked = delegator && delegator.delegate

  return (
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
          role={role}
          isConnected={isConnected}
          styles={{ mb: 4 }}
        />
        <Tabs sx={{ mb: 4 }} tabs={tabs} />
        {children}
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
  )
}

function getTabs(
  role: string,
  account: string,
  pathname: string,
): Array<TabType> {
  let tabs: Array<TabType> = [
    {
      name: 'Staking',
      href: '/[account]/staking',
      as: `/${account}/staking`,
      isActive: pathname == '/[account]/staking',
    },
    {
      name: 'Earned Fees',
      href: '/[account]/fees',
      as: `/${account}/fees`,
      isActive: pathname == '/[account]/fees',
    },
    {
      name: 'History',
      href: '/[account]/history',
      as: `/${account}/history`,
      isActive: pathname == '/[account]/history',
    },
    {
      name: 'Settings',
      href: '/[account]/settings',
      as: `/${account}/settings`,
      isActive: pathname == '/[account]/settings',
    },
  ]
  if (role == 'Orchestrator') {
    tabs.unshift({
      name: 'Campaign',
      href: '/[account]/campaign',
      as: `/${account}/campaign`,
      isActive: pathname == '/[account]/campaign',
    })
  }

  return tabs
}
