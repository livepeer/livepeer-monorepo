/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import React, { useState } from 'react'
import Header from './Header'
import ProjectionBox from './ProjectionBox'
import ArrowDown from '../../public/img/arrow-down.svg'
import Footer from './Footer'
import { Tabs, TabList, Tab } from './Tabs'
import { Account, Delegator, Transcoder, Protocol, Round } from '../../@types'
import ApproveBanner from '../ApproveBanner'
import { useWeb3Context } from 'web3-react'
import InputBox from './InputBox'
import { Flex } from 'theme-ui'
import ClaimBanner from '../ClaimBanner'
import GetLPTBanner from '../GetLPTBanner'

interface Props {
  transcoder: Transcoder
  delegator?: Delegator
  protocol: Protocol
  account: Account
  currentRound: Round
}

export default ({
  delegator,
  account,
  transcoder,
  protocol,
  currentRound,
}: Props) => {
  const [amount, setAmount] = useState('')
  const [action, setAction] = useState('stake')
  const context = useWeb3Context()
  return (
    <div className="tour-step-7">
      {context.active && (
        <>
          <GetLPTBanner account={account} />
          <ApproveBanner account={account} />
          <ClaimBanner
            account={account}
            delegator={delegator}
            currentRound={currentRound}
          />
        </>
      )}
      <Box
        sx={{
          width: '100%',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: 10,
          backgroundColor: 'surface',
        }}
      >
        <Header transcoder={transcoder} />
        <div sx={{ pt: 1, pb: 2, px: 3 }}>
          <Tabs
            onChange={(index: number) => setAction(index ? 'unstake' : 'stake')}
          >
            <TabList>
              <Tab>Stake</Tab>
              <Tab>Unstake</Tab>
            </TabList>
          </Tabs>

          <InputBox
            account={account}
            action={action}
            delegator={delegator}
            transcoder={transcoder}
            amount={amount}
            setAmount={setAmount}
            protocol={protocol}
          />
          <Flex
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '95%',
              bg: '#181a21',
              height: 32,
              margin: '0 auto',
            }}
          >
            <ArrowDown sx={{ width: 8, color: 'rgba(255, 255, 255, .3)' }} />
          </Flex>
          <ProjectionBox action={action} />
          <Footer
            currentRound={currentRound}
            account={account}
            delegator={delegator}
            transcoder={transcoder}
            action={action}
            amount={parseFloat(amount)}
          />
        </div>
      </Box>
    </div>
  )
}
