/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import React, { useState } from 'react'
import { useWeb3Context } from 'web3-react'
import Header from './Header'
import Input from './Input'
import ProjectionBox from './ProjectionBox'
import Footer from './Footer'
import { Tabs, TabList, Tab } from './Tabs'
import { Transcoder, Protocol } from '../../@types'

interface Props {
  transcoder: Transcoder
  protocol: Protocol
}

export default ({ transcoder, protocol }: Props) => {
  let context = useWeb3Context()
  const [amount, setAmount] = useState('0')
  const [action, setAction] = useState('stake')

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
        <Footer action={action} amount={amount} context={context} />
      </div>
    </Box>
  )
}
