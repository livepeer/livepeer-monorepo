import React from 'react'
import { matchPath } from 'react-router'
import { Link, NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { queries } from '@livepeer/graphql-sdk'
import Big from 'big.js'
import styled, { keyframes } from 'styled-components'
import {
  DownloadCloud as DownloadCloudIcon,
  Plus as PlusIcon,
  Video as VideoIcon,
  Send as SendIcon,
} from 'react-feather'
import QRCode from 'qrcode-react'
import BasicNavbar from '../../components/BasicNavbar'
import Footer from '../../components/Footer'
import AccountOverview from '../AccountOverview'
import AccountBroadcasting from '../AccountBroadcasting'
import AccountDelegating from '../AccountDelegating'
import AccountTranscoding from '../AccountTranscoding'
import {
  Avatar,
  Banner,
  Button,
  Content,
  PageHeading,
  ScrollToTopOnMount,
  TabLink,
  Tabs,
} from '../../components'
import { pathInfo } from '../../utils'
import enhance from './enhance'

type AccountViewProps = {
  account: Account,
  history: History,
  loading: boolean,
  match: Match,
}

const AccountView: React.Component<AccountViewProps> = ({
  account,
  history,
  loading,
  match,
}) => {
  const me = pathInfo.isMe(match.path)
  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <Banner>
        <PageHeading>
          <Avatar id={account.id} size={32} bg="#000" />&nbsp;{me ? (
            'My Account'
          ) : (
            <span>
              Account&nbsp;<span style={{ fontSize: 16 }}>
                {account.id.substr(0, 10)}...
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
            <Route path={`${match.url}/overview`} component={AccountOverview} />
            <Route
              path={`${match.url}/broadcasting`}
              component={AccountBroadcasting}
            />
            <Route
              path={`${match.url}/delegating`}
              component={AccountDelegating}
            />
            <Route
              path={`${match.url}/transcoding`}
              component={AccountTranscoding}
            />
            <Redirect to={`${match.url}/overview`} />
          </Switch>
        </div>
      </Content>
    </React.Fragment>
  )
}

const AccountViewStatus = styled.span`
  position: absolute;
  right: 8px;
  top: 8px;
  text-transform: uppercase;
  color: #555;
  font-size: 12px;
  span {
    display: inline-block;
    transform: scale(2);
    margin-right: 4px;
    color: ${({ live }) => (live ? 'red' : '#aaa')};
  }
`

export default enhance(AccountView)
