// @flow
import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import QRCode from 'qrcode-react'
import { MoreVertical as MoreVerticalIcon } from 'react-feather'
import { Button } from 'rmwc/Button'
import { Icon } from 'rmwc/Icon'
import { MenuItem, SimpleMenu } from 'rmwc/Menu'
import AccountOverview from '../AccountOverview'
import AccountBroadcasting from '../AccountBroadcasting'
import AccountDelegating from '../AccountDelegating'
import AccountTranscoding from '../AccountTranscoding'
import {
  Avatar,
  Banner,
  BasicNavbar,
  Content,
  Footer,
  PageHeading,
  ScrollToTopOnMount,
  TabLink,
  Tabs,
} from '../../components'
import enhance from './enhance'

type AccountViewProps = {
  account: GraphQLProps<Account>,
  bond: ({ id: string }) => void,
  coinbase: GraphQLProps<Coinbase>,
  currentRound: GraphQLProps<Array<Round>>,
  history: History,
  match: Match,
  me: GraphQLProps<Account>,
  unbond: ({ id: string }) => void,
}

const AccountView: React.ComponentType<AccountViewProps> = ({
  account,
  bond,
  coinbase,
  history,
  match,
  me,
  unbond,
}) => {
  const accountAddress = match.params.accountId
  const userAddress = coinbase.data.coinbase
  const isMe = accountAddress === userAddress
  const { delegateAddress, status } = me.data.delegator
  const isBonded = status === 'Bonded'
  const isBonding = status === 'Pending'
  const isUnbonded = status === 'Unbonded'
  const isMyDelegate = accountAddress === delegateAddress
  const canRebond = isMyDelegate && (isBonded || isBonding)
  const canBond = !!userAddress
  const canUnbond = userAddress && isBonded && isMyDelegate
  const isTranscoder = me.data.transcoder.status === 'Registered'
  const showBondButtons =
    (canBond || canRebond || canUnbond) &&
    ((isTranscoder && isMe) || (!isTranscoder && !isMe))
  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <BasicNavbar />
      <Banner>
        <PageHeading>
          {isMe ? (
            <React.Fragment>
              <Avatar id={account.data.id} size={32} bg="#000" />&nbsp;My
              Account
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Avatar id={account.data.id} size={32} bg="#000" />&nbsp;
              Account&nbsp;<span style={{ fontSize: 16, height: 26 }}>
                {account.data.id.substr(0, 10)}...
              </span>
            </React.Fragment>
          )}
          {/** Bonding Actions */}
          {showBondButtons && (
            <SimpleMenu
              handle={
                <Button
                  style={{
                    minWidth: 0,
                    width: 32,
                    height: 32,
                  }}
                >
                  <Icon use="arrow_drop_down_circle" />
                </Button>
              }
              onSelected={async ({ detail }) => {
                const { action } = detail.item.dataset
                switch (action) {
                  case 'bond':
                    return bond({ id: accountAddress })
                  case 'unbond':
                    return await unbond({ id: accountAddress })
                }
              }}
            >
              {(canBond || canRebond) && (
                <MenuItem data-action="bond">Bond</MenuItem>
              )}
              {canUnbond && <MenuItem data-action="unbond">Unbond</MenuItem>}
            </SimpleMenu>
          )}
        </PageHeading>
        <div style={{ marginBottom: -32, paddingTop: 32 }}>
          <Tabs url={match.url}>
            <TabLink to={`${match.url}/overview`}>overview</TabLink>
            <TabLink to={`${match.url}/broadcasting`}>broadcasting</TabLink>
            <TabLink to={`${match.url}/delegating`}>delegating</TabLink>
            <TabLink to={`${match.url}/transcoding`}>transcoding</TabLink>
          </Tabs>
        </div>
      </Banner>
      <Content width="800px">
        <div>
          <Switch>
            <Route
              path={`${match.path}/overview`}
              component={AccountOverview}
            />
            <Route
              path={`${match.path}/broadcasting`}
              component={AccountBroadcasting}
            />
            <Route
              path={`${match.path}/delegating`}
              component={AccountDelegating}
            />
            <Route
              path={`${match.path}/transcoding`}
              component={AccountTranscoding}
            />
            <Redirect to={`${match.url}/overview`} />
          </Switch>
        </div>
      </Content>
    </React.Fragment>
  )
}

export default enhance(AccountView)
