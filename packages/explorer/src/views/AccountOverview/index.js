// @flow
import * as React from 'react'
import {
  DownloadCloud as DownloadCloudIcon,
  Plus as PlusIcon,
  Send as SendIcon,
} from 'react-feather'
import { Card } from 'rmwc/Card'
import { Drawer, DrawerHeader, DrawerContent } from 'rmwc/Drawer'
import { Icon } from 'rmwc/Icon'
import {
  List,
  ListDivider,
  ListItem,
  ListItemText,
  SimpleListItem,
} from 'rmwc/List'
import { formatBalance } from '../../utils'
import {
  Button,
  Content,
  EmptyMessage,
  InlineHint,
  MetricBox,
  Wrapper,
} from '../../components'
import enhance from './enhance'

type AccountOverviewProps = {
  account: GraphQLProps<Account>,
  coinbase: GraphQLProps<Coinbase>,
  match: Match,
  onDepositETH: (e: Event) => void,
  onRequestETH: (e: Event) => void,
  onRequestLPT: (e: Event) => void,
  onTransferLPT: (e: Event) => void,
  transactions: GraphQLProps<Transaction>,
}

const AccountOverview: React.ComponentType<AccountOverviewProps> = ({
  account,
  coinbase,
  match,
  onDepositETH,
  onRequestETH,
  onRequestLPT,
  onTransferLPT,
  pendingTransactions = [],
  transactions,
}) => {
  const isMe = match.params.accountId === coinbase.data.coinbase
  const { ethBalance, id, tokenBalance } = account.data
  const IS_MAINNET = window.web3 && `${window.web3.version.network}` === '1'
  const transactionData = [
    ...pendingTransactions,
    ...transactions.data.filter(x => x.method),
  ].slice(0, 50) // chrome breaks with a large list
  return (
    <React.Fragment>
      {/*<InlineHint flag="account-overview">
        <h3>Account Overview</h3>
        <p>The overview shows ETH and LPT balances in an account's wallet</p>
  </InlineHint>*/}
      <Wrapper>
        <MetricBox
          title="ETH Address"
          width="100%"
          subvalue={<code style={{ fontSize: 16 }}>{id}</code>}
        />
      </Wrapper>
      <Wrapper>
        {/** ETH */}
        <MetricBox
          title="ETH Balance"
          suffix="ETH"
          value={formatBalance(ethBalance)}
          subvalue={formatBalance(ethBalance, 18)}
        />
        {/** LPT */}
        <MetricBox
          title="Token Balance"
          suffix="LPT"
          value={formatBalance(tokenBalance)}
          subvalue={formatBalance(tokenBalance, 18)}
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
            </React.Fragment>
          )}
        </MetricBox>
        <Content>
          <h3>
            Recent Activity{' '}
            <a
              target="_blank"
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
          {transactions.loading &&
            !transactionData.length && (
              <EmptyMessage>
                <h2>Loading account activity...</h2>
              </EmptyMessage>
            )}
          {!transactions.loading &&
            !transactionData.length && (
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
    </React.Fragment>
  )
}

class TransactionCard extends React.Component {
  state = { expanded: false }
  render() {
    const {
      confirmations,
      contract,
      gas,
      gasUsed,
      gasPrice,
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
              />&nbsp;
              <Icon stategy="url" use={getActivityIcon(method)} />&nbsp;
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
            <List dense nonInteractive={true} twoLine>
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
            temporary
            open={expanded}
            onClose={() => this.setState(state => ({ expanded: false }))}
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
                      />&nbsp;{pending
                        ? 'Pending'
                        : failed
                          ? 'Failed'
                          : `Success`}
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
                      />&nbsp;{method}
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
