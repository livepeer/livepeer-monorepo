// @flow
import * as React from 'react'
import { Link } from 'react-router-dom'
import Joyride from 'react-joyride'
import {
  DownloadCloud as DownloadCloudIcon,
  Send as SendIcon,
} from 'react-feather'
import { Card } from 'rmwc/Card'
import { Drawer, DrawerHeader, DrawerContent } from 'rmwc/Drawer'
import { Icon } from 'rmwc/Icon'
import { List, ListDivider, ListItem, SimpleListItem } from 'rmwc/List'
import { formatBalance, MathBN } from '../../utils'
import {
  Button,
  Content,
  EmptyMessage,
  InlineAccount,
  MetricBox,
  Tooltip,
  Wrapper,
} from '../../components'
import enhance from './enhance'

import { UserProfile, Profile } from '@livepeer/profiles'

type AccountOverviewProps = {
  account: GraphQLProps<Account>,
  coinbase: GraphQLProps<Coinbase>,
  currentRound: GraphQLProps<Round>,
  history: History,
  match: Match,
  onDepositETH: (e: Event) => void,
  onRequestETH: (e: Event) => void,
  onRequestLPT: (e: Event) => void,
  onTransferLPT: (e: Event) => void,
  transactions: GraphQLProps<Transaction>,
  unbondlocks: GraphQLProps<UnbondLock>,
}

const AccountOverview: React.ComponentType<AccountOverviewProps> = ({
  account,
  coinbase,
  currentRound,
  delegator,
  history,
  match,
  onDepositETH,
  onRequestETH,
  onRequestLPT,
  onTransferLPT,
  transactions,
  unbondlocks,
}) => {
  const searchParams = new URLSearchParams(history.location.search)
  const TOUR_ENABLED = !!searchParams.get('tour')
  const isMe = match.params.accountId === coinbase.data.coinbase
  const { ethBalance, id, tokenBalance } = account.data
  const IS_MAINNET = window.web3 && `${window.web3.version.network}` === '1'
  const transactionData = transactions.data
    // only livepeer transactions
    .filter(x => x.method)

  let unbondedAmount = 0
  if (unbondlocks) {
    const reducer = (accumulator, itemNext) =>
      MathBN.add(accumulator, itemNext.amount)
    const filter = item => item['withdrawRound'] !== '0'
    unbondlocks = unbondlocks.filter(filter)
    unbondedAmount = unbondlocks.reduce(reducer, 0)
  }

  console.log('Hello there')
  return (
    <React.Fragment>
      {/*<InlineHint flag="account-overview">
        <h3>Account Overview</h3>
        <p>The overview shows ETH and LPT balances in an account's wallet</p>
  </InlineHint>*/}
      <div
        style={{
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {(() => {
          if (account.data.id === window.web3.eth.defaultAccount) {
            console.log('account address not equal to web3 address')
            return <UserProfile />
          } else {
            console.log('account different')
            return <Profile address={account.data.id} />
          }
        })()}
      </div>
      <br />
      <Wrapper>
        <MetricBox
          className="eth-address"
          help="The Ethereum address representing this account"
          title="ETH Address"
          value={
            <Tooltip text={id}>
              <Link to={`/accounts/${id}`} style={{ textDecoration: 'none' }}>
                <InlineAccount address={id} border truncate={22} />
              </Link>
            </Tooltip>
          }
          textStyle={{ fontSize: '15px' }}
        />
        {/** ETH */}
        <MetricBox
          className="eth-balance"
          help="The amount of Ethereum owned by this account"
          title="ETH Balance"
          suffix="ETH"
          value={formatBalance(ethBalance)}
          textStyle={{ fontSize: '1em' }}
          subvalue={`${formatBalance(ethBalance, 18, 'wei')} WEI`}
        />
        {/** LPT */}
        <MetricBox
          className="token-balance"
          help="The amount of Livepeer Token (LPT) owned by this account"
          title="Current Livepeer Token Balance"
          suffix="LPT"
          value={formatBalance(tokenBalance)}
          textStyle={{ fontSize: '1em' }}
        >
          {isMe && (
            <React.Fragment>
              {/** request */}
              {!IS_MAINNET && (
                <Button onClick={onRequestLPT}>
                  <DownloadCloudIcon size={12} />
                  <span style={{ marginLeft: 8 }}>request</span>
                </Button>
              )}
              {/** transfer */}
              <Button onClick={onTransferLPT}>
                <SendIcon size={12} />
                <span style={{ marginLeft: 8 }}>transfer</span>
              </Button>
              {/** bond */}
              <Button
                className="bond-token primary"
                onClick={e => {
                  e.preventDefault()
                  history.push(`/transcoders?tour=true`)
                }}
              >
                <span style={{ fontSize: '10px' }}>bond to a transcoder</span>
                <span style={{ marginLeft: 8 }}>&rarr;</span>
              </Button>
            </React.Fragment>
          )}
        </MetricBox>
        <MetricBox
          className="eth-balance"
          help={`The amount of Livepeer Token (LPT) owned by this
                account that is in the unbonding state`}
          title="Pending Livepeer Token Balance"
          suffix="LPT"
          value={formatBalance(unbondedAmount)}
          textStyle={{ fontSize: '1em' }}
        >
          {isMe && (
            <React.Fragment>
              {/** view locks*/}
              <Button
                className={unbondedAmount ? 'bond-token primary' : 'disabled'}
                onClick={e => {
                  if (unbondlocks)
                    history.push(`/accounts/${id}/delegating#unbondinglocks`)
                }}
              >
                <span>View</span>
                <span style={{ marginLeft: 8 }}>&rarr;</span>
              </Button>
            </React.Fragment>
          )}
        </MetricBox>
        <Content>
          <h3>
            Recent Activity{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.supermax.cool/livepeer/mainnet/activity?filter=%7B%22search%22%3A%22${
                match.params.accountId
              }%22%7D`}
              style={{
                fontSize: 12,
              }}
            >
              view full history
            </a>
          </h3>
          {transactions.loading && !transactionData.length && (
            <EmptyMessage>
              <h2>Loading account activity...</h2>
            </EmptyMessage>
          )}
          {!transactions.loading && !transactionData.length && (
            <EmptyMessage>
              <h2>This account has no recent activity</h2>
            </EmptyMessage>
          )}
          <div>
            {transactionData.map(props => (
              <div key={props.id} style={{ marginBottom: 16 }}>
                <TransactionCard {...props} />
              </div>
            ))}
          </div>
        </Content>
      </Wrapper>
      {TOUR_ENABLED && isMe && (
        <Tour
          callback={({ action, index, type }) => {
            console.log(action, index, type)
            if (action === 'next' && type === 'tour:end') {
              history.push(`/transcoders?tour=true`)
            }
          }}
          continuous={true}
          disableOverlay={false}
          locale={{
            back: 'Back',
            close: 'Okay',
            last: 'Get Started',
            next: 'Next',
            skip: 'Skip',
          }}
          run={!account.loading}
          showProgress={true}
          steps={[
            {
              content:
                'Welcome to your account page. This is where you can find important information about your Livepeer account.',
              placement: 'right',
              target: '.page-heading',
            },
            {
              content:
                'This is the Ethereum wallet address that holds your Livepeer Token.',
              placement: 'top',
              target: '.eth-address',
            },
            {
              content:
                'This is the amount of Livepeer Token you currently own.',
              placement: 'top',
              target: '.token-balance',
            },
            {
              content: `You can bond these tokens to a transcoder to earn additional LPT and ETH every day. Bonding as soon as possible will help you maximize your earnings. Why not get started?`,
              placement: 'bottom',
              target: '.bond-token',
            },
          ]}
        />
      )}
    </React.Fragment>
  )
}

class Tour extends React.Component {
  shouldComponentUpdate(nextProps) {
    // Don't update if already running (causes beacon/tooltips to blink)
    return !this.props.run
  }
  render() {
    return <Joyride {...this.props} />
  }
}

class TransactionCard extends React.Component {
  state = { expanded: false }
  render() {
    const {
      confirmations,
      contract,
      gas,
      gasPrice,
      gasUsed,
      id,
      method,
      nonce,
      params,
      status,
      timeStamp,
    } = this.props
    const pending = Number(confirmations) < 1
    const failed = status === '0'
    const { expanded } = this.state
    const time = new Date(Number(timeStamp) * 1000).toLocaleString()
    const paramEntries = Object.entries(params)
    const hasParams = paramEntries.length > 0
    return (
      <React.Fragment>
        <Card>
          <div
            style={{
              position: 'relative',
              padding: '0 16px',
            }}
          >
            <h4
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icon
                strategy="ligature"
                use={
                  pending
                    ? 'warning'
                    : failed
                    ? 'error_outline'
                    : 'check_circle_outline'
                }
                style={{
                  color: pending ? 'orange' : failed ? 'red' : `var(--primary)`,
                }}
              />
              &nbsp;
              <Icon stategy="url" use={getActivityIcon(method)} />
              &nbsp;
              <span style={{ textDecoration: failed ? 'line-through' : '' }}>
                {formatTransactionMethod(method)}
              </span>
              <span
                style={{ fontSize: 12, paddingLeft: 8, marginLeft: 'auto' }}
              >
                {time}
              </span>
            </h4>
          </div>
          <div>
            <ListDivider />
            <List dense twoLine>
              <SimpleListItem
                key="hash"
                graphic=""
                text="transaction hash"
                secondaryText={id}
                meta="chevron_right"
                onClick={() => {
                  this.setState(state => ({ expanded: true }))
                }}
              />
            </List>
          </div>
        </Card>

        <React.Fragment>
          <Drawer
            temporary="true"
            open={expanded}
            onClose={() => this.setState(state => ({ expanded: false }))}
            style={{
              // chrome breaks with a large list fixed-position drawer elements
              // hiding them seems to fix
              opacity: expanded ? 1 : 0,
              transition: 'opacity .2s ease-out',
            }}
          >
            <DrawerHeader>
              <h3>Transaction Information</h3>
            </DrawerHeader>
            <DrawerContent>
              <List dense nonInteractive={true} twoLine>
                <ListItem>
                  <strong>Overview</strong>
                </ListItem>
                <SimpleListItem
                  graphic=""
                  text="Hash"
                  secondaryText={id}
                  meta=""
                />
                <SimpleListItem
                  graphic=""
                  text="Status"
                  secondaryText={
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      <Icon
                        strategy="ligature"
                        use={
                          pending
                            ? 'warning'
                            : failed
                            ? 'error_outline'
                            : 'check_circle_outline'
                        }
                        style={{
                          fontSize: 18,
                          color: pending
                            ? 'orange'
                            : failed
                            ? 'red'
                            : `var(--primary)`,
                        }}
                      />
                      &nbsp;
                      {pending ? 'Pending' : failed ? 'Failed' : `Success`}
                    </span>
                  }
                  meta=""
                />
                <SimpleListItem
                  graphic=""
                  text="Timestamp"
                  secondaryText={time}
                  meta=""
                />
                <SimpleListItem
                  graphic=""
                  text="Contract"
                  secondaryText={contract}
                  meta=""
                />
                <SimpleListItem
                  graphic=""
                  text="Method"
                  secondaryText={
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      <Icon
                        stategy="url"
                        use={getActivityIcon(method)}
                        style={{ fontSize: 18 }}
                      />
                      &nbsp;{method}
                    </span>
                  }
                  meta=""
                />
                <ListDivider />
                {hasParams && (
                  <ListItem>
                    <strong>Input Parameters</strong>
                  </ListItem>
                )}
                {paramEntries.map(([k, v]) => (
                  <SimpleListItem
                    key={k}
                    graphic=""
                    text={k.substr(1)}
                    secondaryText={Array.isArray(v) ? v.join(' - ') : v}
                    meta=""
                  />
                ))}
                <ListDivider />
                <ListItem>
                  <strong>Technical Details</strong>
                </ListItem>
                <SimpleListItem
                  graphic=""
                  text="Gas Limit"
                  secondaryText={gas}
                  meta=""
                />
                <SimpleListItem
                  graphic=""
                  text="Gas Used"
                  secondaryText={gasUsed}
                  meta=""
                />
                <SimpleListItem
                  graphic=""
                  text="Gas Price"
                  secondaryText={`${formatBalance(
                    gasPrice,
                    18,
                  )} ETH (${formatBalance(gasPrice, 8, 'gwei')} GWEI)`}
                  meta=""
                />
                <SimpleListItem
                  graphic=""
                  text="Nonce"
                  secondaryText={nonce}
                  meta=""
                />
              </List>
            </DrawerContent>
          </Drawer>
        </React.Fragment>
      </React.Fragment>
    )
  }
}

const formatTransactionMethod = (messages => name => {
  return messages[name] || name
})({
  approve: 'Approved a token amount for transfer',
  bond: 'Bonded to a delegate',
  claimEarnings: 'Claimed earnings',
  claimWork: 'Claimed work for transcoded segments',
  deposit: 'Deposited ETH for broadcasting',
  distributeFees: 'Distributed fees to delegators',
  initializeRound: 'Initialized a round',
  job: 'Started a video stream',
  request: 'Requested token from the faucet',
  reward: 'Claimed inflationary token reward for the round',
  unbond: 'Unbonded from delegate',
  withdraw: 'Withdrew ETH deposited for broadcasting',
  withdrawStake: 'Withdrew staked tokens',
})

const getActivityIcon = (messages => method => {
  return messages[method] || 'receipt'
})({
  approve: 'swap_horiz',
  bond: 'link',
  claimEarnings: 'assignment_turned_in',
  claimWork: 'memory',
  deposit: '/static/images/eth.svg',
  distributeFees: '/static/images/eth.svg',
  initializeRound: 'slideshow',
  job: 'videocam',
  request: 'get_app',
  reward: '/static/images/lpt.svg',
  unbond: 'link_off',
  withdraw: '/static/images/eth.svg',
  withdrawStake: '/static/images/lpt.svg',
})

export default enhance(AccountOverview)
