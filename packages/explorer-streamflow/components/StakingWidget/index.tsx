/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import React, { useState } from 'react'
import Header from './Header'
import Input from './Input'
import ProjectionBox from './ProjectionBox'
import Help from '../../static/img/help.svg'
import Footer from './Footer'
import { Tabs, TabList, Tab } from './Tabs'
import { Account, Transcoder, Protocol } from '../../@types'
import Banner from '../Banner'
import Approve from '../Approve'

interface Props {
  transcoder: Transcoder
  protocol: Protocol
  account: Account
}

export default ({ account, transcoder, protocol }: Props) => {
  const [amount, setAmount] = useState('0')
  const [action, setAction] = useState('stake')

  return (
    <div>
      {account && parseInt(account.allowance) == 0 && (
        <Banner
          label={
            <div>
              Approve Livepeer tokens for staking.
              <Help
                sx={{
                  position: 'relative',
                  ml: 1,
                  top: '2px',
                  width: 12,
                  height: 12,
                }}
              />
            </div>
          }
          button={<Approve>Approve</Approve>}
        />
      )}
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
            account={account}
            transcoder={transcoder}
            action={action}
            amount={amount}
          />
        </div>
      </Box>
    </div>
  )
}
