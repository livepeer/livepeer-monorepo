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
import { Button, Content, TabLink, Tabs } from '../../components'
import { pathInfo } from '../../utils'
import enhance from './enhance'

type Account = {
  id: string,
  ethBalance: string,
  tokenBalance: string,
}

type Props = {
  account: Account,
  color: string,
  history: {
    push: (url: string) => void,
  },
  loading: Boolean,
  match: {
    path: string,
  },
}

const AccountView: React.Component<Props> = ({
  account,
  color,
  history,
  loading,
  match,
}: Props): ReactElement => {
  const me = pathInfo.isMe(match.path)
  return (
    <React.Fragment>
      <AccountTopSection>
        <Content>
          <AccountBasicInfo
            account={account.id}
            color={color}
            host={window.location.host}
            me={me}
            protocol={window.location.protocol}
          />
        </Content>
      </AccountTopSection>
      <Content width="800px">
        <BasicNavbar onSearch={x => history.push(`/accounts/${x}`)} />
        <div>
          <Tabs url={match.url}>
            <TabLink to={`${match.url}/overview`}>overview</TabLink>
            <TabLink to={`${match.url}/broadcasting`}>broadcasting</TabLink>
            <TabLink to={`${match.url}/delegating`}>delegating</TabLink>
            <TabLink to={`${match.url}/transcoding`}>transcoding</TabLink>
          </Tabs>
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

const AccountTopSection = styled.div`
  background: radial-gradient(circle at 500px 550px, #177e89cc, #000 75%);
  height: 240px;
  margin: 0 auto;
  padding: 32px;
`

const AccountBasicInfo = ({ account, color, host, me, protocol }) => {
  return (
    <div style={{ textAlign: 'center', color: '#fff' }}>
      <div
        style={{
          boxShadow: '0 0 0 1px #fff',
          borderRadius: '50%',
          width: 64,
          height: 64,
          margin: '0 auto',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -1280,
            right: -1280,
            bottom: -1280,
            left: -1280,
            width: 128,
            height: 128,
            margin: 'auto',
            transform: 'scale(2)',
            imageRendering: 'pixelated',
          }}
        >
          <QRCode
            value={`${protocol}//${host}/accounts/${account}`}
            fgColor={color}
            bgColor="#283845aa"
          />
        </div>
      </div>
      <h1 style={{ marginBottom: 0 }}>
        {me ? 'My Account' : 'Livepeer Account'}
      </h1>
      <h5>{account}</h5>
    </div>
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
