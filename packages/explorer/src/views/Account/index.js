// @flow
import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import QRCode from 'qrcode-react'
import { MoreVertical as MoreVerticalIcon } from 'react-feather'
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
  Button,
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
  const accountAddress = account.data.id
  const ensName = account.data.ensName
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
          <React.Fragment>
            <Avatar id={accountAddress} size={32} bg="#000" />&nbsp;
            {isMe ? 'My Account' : 'Account'}&nbsp;<span
              style={{ fontSize: 16, height: 26 }}
            >
              {ensName ? ensName : `${accountAddress.substr(0, 10)}...`}
            </span>
          </React.Fragment>
          {/** Bonding Actions */}
          {showBondButtons && (
            <span style={{ marginLeft: 8 }}>
              {(canBond || canRebond) && (
                <Button
                  className="outlined"
                  style={{ margin: 4 }}
                  onClick={() => bond({ id: accountAddress })}
                >
                  Bond
                </Button>
              )}
              {canUnbond && (
                <Button
                  className="outlined"
                  style={{ margin: 4 }}
                  onClick={() => unbond({ id: accountAddress })}
                >
                  Unbond
                </Button>
              )}
            </span>
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
