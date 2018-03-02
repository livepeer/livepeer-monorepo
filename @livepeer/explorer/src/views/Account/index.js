// @flow
import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import AccountOverview from '../AccountOverview'
import AccountBroadcasting from '../AccountBroadcasting'
import AccountDelegating from '../AccountDelegating'
import AccountTranscoding from '../AccountTranscoding'
import QRCode from 'qrcode-react'
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
  history: History,
  match: Match,
}

const AccountView: React.ComponentType<AccountViewProps> = ({
  account,
  history,
  match,
}) => {
  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <Banner>
        <PageHeading>
          <Avatar id={account.data.id} size={32} bg="#000" />&nbsp;{!match
            .params.accountId ? (
            'My Account'
          ) : (
            <span>
              Account&nbsp;<span style={{ fontSize: 16 }}>
                {account.data.id.substr(0, 10)}...
              </span>
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
        <BasicNavbar onSearch={x => history.push(`/accounts/${x}`)} />
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
            <Redirect to={`${match.path}/overview`} />
          </Switch>
        </div>
      </Content>
    </React.Fragment>
  )
}

export default enhance(AccountView)
