/** @jsx jsx */
import { jsx, Box } from 'theme-ui'
import React, { useState } from 'react'
import Header from './Header'
import Input from './Input'
import ProjectionBox from './ProjectionBox'
import Help from '../../static/img/help.svg'
import Footer from './Footer'
import { Tabs, TabList, Tab } from './Tabs'
import { Account, Delegator, Transcoder, Protocol, Round } from '../../@types'
import Banner from '../Banner'
import Approve from '../Approve'
import Button from '../Button'
import Modal from '../Modal'
import { useWeb3Context } from 'web3-react'
import Utils from 'web3-utils'
import Claim from '../Claim'
import { MAX_EARNINGS_CLAIMS_ROUNDS } from '../../lib/utils'

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
  const [amount, setAmount] = useState('0')
  const [action, setAction] = useState('stake')
  const [open, setModalOpen] = useState(false)
  const context = useWeb3Context()
  let roundsSinceLastClaim = 0
  let lastClaimRound: number = 0
  if (delegator) {
    lastClaimRound = parseInt(delegator.lastClaimRound.id, 10)
    roundsSinceLastClaim = parseInt(currentRound.id, 10) - lastClaimRound
  }

  return (
    <div>
      {renderBanners(
        context,
        account,
        roundsSinceLastClaim,
        lastClaimRound,
        setModalOpen,
        parseInt(currentRound.id, 10),
      )}
      <Modal isOpen={open} setOpen={setModalOpen}>
        <iframe
          sx={{
            bg: '#323639',
            width: '100%',
            height: '100%',
            border: '0',
          }}
          src="https://uniswap.exchange/swap/0x58b6a8a3302369daec383334672404ee733ab239"
        />
      </Modal>
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
            transcoder={transcoder}
            value={amount}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmount(e.target.value ? e.target.value : '0')
            }
            protocol={protocol}
          />
          <ProjectionBox action={action} />
          <Footer
            currentRound={currentRound}
            roundsSinceLastClaim={roundsSinceLastClaim}
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

function renderBanners(
  context,
  account,
  roundsSinceLastClaim,
  lastClaimRound,
  setModalOpen,
  currentRound,
) {
  if (
    context.connectorName != 'Portis' &&
    context.account &&
    account &&
    account.id.toLowerCase() == context.account.toLowerCase() &&
    parseFloat(Utils.fromWei(account.tokenBalance)) == 0
  ) {
    return (
      <>
        <Banner
          label={
            <div sx={{ pr: 3, flex: 1 }}>
              Get Livepeer tokens for staking.
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
          button={<Button onClick={() => setModalOpen(true)}>Get LPT</Button>}
        />
      </>
    )
  }

  if (
    context.account &&
    account &&
    account.id.toLowerCase() == context.account.toLowerCase() &&
    parseFloat(account.allowance) == 0 &&
    parseFloat(account.tokenBalance) != 0
  ) {
    return (
      <Banner
        label={
          <div sx={{ pr: 3 }}>
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
    )
  }
  if (
    context.account &&
    account &&
    account.id.toLowerCase() == context.account.toLowerCase() &&
    roundsSinceLastClaim > MAX_EARNINGS_CLAIMS_ROUNDS
  ) {
    return (
      <Banner
        label={
          <div sx={{ pr: 3 }}>
            It's been over 100 rounds since your last claim.
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
        button={
          <Claim
            lastClaimRound={lastClaimRound}
            endRound={parseInt(currentRound.id, 10)}
          >
            Claim
          </Claim>
        }
      />
    )
  }
}
