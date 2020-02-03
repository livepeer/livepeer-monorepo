import { Box } from 'theme-ui'
import { useState } from 'react'
import Header from './Header'
import ProjectionBox from './ProjectionBox'
import ArrowDown from '../../public/img/arrow-down.svg'
import Footer from './Footer'
import { Tabs, TabList, Tab } from './Tabs'
import { Account, Delegator, Transcoder, Protocol, Round } from '../../@types'
import Approve from '../Approve'
import { useWeb3React } from '@web3-react/core'
import InputBox from './InputBox'
import { Flex } from 'theme-ui'
import ClaimBanner from '../ClaimBanner'
import Utils from 'web3-utils'

interface Props {
  transcoder: Transcoder
  delegator?: Delegator
  protocol: Protocol
  account: Account
  currentRound: Round
  selectedAction?: string
}

export default ({
  delegator,
  account,
  transcoder,
  protocol,
  currentRound,
  selectedAction = 'stake',
}: Props) => {
  const [amount, setAmount] = useState('')
  const [action, setAction] = useState(selectedAction)
  const context = useWeb3React()

  return (
    <Box className="tour-step-7">
      {context.active && (
        <Box sx={{ display: ['none', 'none', 'none', 'block'] }}>
          {account &&
            parseFloat(Utils.fromWei(account.allowance)) == 0 &&
            parseFloat(Utils.fromWei(account.tokenBalance)) != 0 && (
              <Approve account={account} context={context} banner={true} />
            )}
        </Box>
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
        <Box sx={{ pt: 1, pb: 2, px: 2 }}>
          <Tabs
            defaultIndex={selectedAction === 'stake' ? 0 : 1}
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
            amount={amount}
          />
        </Box>
      </Box>
    </Box>
  )
}
