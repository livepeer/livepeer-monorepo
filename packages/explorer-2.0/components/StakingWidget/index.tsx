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
import { useWeb3Context } from 'web3-react'
import Utils from 'web3-utils'
import Claim from '../Claim'
import { MAX_EARNINGS_CLAIMS_ROUNDS } from '../../lib/utils'
import Router, { useRouter } from 'next/router'

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
  const context = useWeb3Context()
  const router = useRouter()
  let roundsSinceLastClaim = 0
  let lastClaimRound: number = 0
  if (delegator && delegator.lastClaimRound) {
    lastClaimRound = parseInt(delegator.lastClaimRound.id, 10)
    roundsSinceLastClaim = parseInt(currentRound.id, 10) - lastClaimRound
  }

  return (
    <div className="tour-step-7">
      {renderBanners(
        context,
        account,
        roundsSinceLastClaim,
        lastClaimRound,
        parseInt(currentRound.id, 10),
        router,
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
  currentRound,
  router,
) {
  if (
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
          button={
            <Button
              onClick={() =>
                Router.push(
                  `${router.pathname}?openExchange=true`,
                  `${router.asPath}?openExchange=true`,
                )
              }
            >
              Get LPT
            </Button>
          }
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
          <Claim lastClaimRound={lastClaimRound} endRound={currentRound}>
            Claim
          </Claim>
        }
      />
    )
  }
}
