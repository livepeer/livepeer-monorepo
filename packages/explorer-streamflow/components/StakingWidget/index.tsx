/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import React, { useState, useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import Header from './Header'
import Input from './Input'
import ProjectionBox from './ProjectionBox'
import Footer from './Footer'
import { Tabs, TabList, Tab } from './Tabs'
import { Transcoder, Protocol } from '../../@types'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Utils from 'web3-utils'
import { useAccount } from '../../hooks'

interface Props {
  transcoder: Transcoder
  protocol: Protocol
}

const GET_ACCOUNT = gql`
  query($account: ID!) {
    account(id: $account) {
      id
      tokenBalance
      ethBalance
    }
    delegator(id: $account) {
      id
      tokenBalance
      ethBalance
      allowance
      pendingStake
    }
  }
`

export default ({ transcoder, protocol }: Props) => {
  let context = useWeb3Context()
  const [amount, setAmount] = useState('0')
  const [action, setAction] = useState('stake')
  const account = useAccount()

  // const { data, loading, error } = useQuery(GET_ACCOUNT, {
  //   variables: {
  //     account: context.active ? context.account.toLowerCase() : '',
  //   },
  //   ssr: false,
  //   skip: !context.active,
  // })
  // console.log(data)
  // console.log(error)
  let allowance = null
  let pendingStake = 0

  // return null
  // if (data && data.delegator) {
  //   allowance = Utils.fromWei(data.delegator.allowance)
  //   pendingStake = Math.max(
  //     Utils.fromWei(data.delegator.bondedAmount),
  //     Utils.fromWei(data.delegator.pendingStake),
  //   )
  // }
  // if (!allowance) {
  //   console.log('Approve Livepeer Token for Staking')
  // }

  return (
    <Box
      sx={{
        width: '100%',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        borderRadius: 5,
        backgroundColor: 'surface',
      }}
    >
      <Header transcoder={transcoder} />
      <div sx={{ p: 2 }}>
        <Tabs
          onChange={(index: number) => setAction(index ? 'unstake' : 'stake')}
        >
          <TabList>
            <Tab>Stake</Tab>
            <Tab>Unstake</Tab>
          </TabList>
        </Tabs>
        <Input
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAmount(e.target.value)
          }
          protocol={protocol}
        />
        <ProjectionBox action={action} />
        <Footer
          canStake={true}
          account={account}
          transcoder={transcoder}
          action={action}
          amount={amount}
          context={context}
        />
      </div>
    </Box>
  )
}
