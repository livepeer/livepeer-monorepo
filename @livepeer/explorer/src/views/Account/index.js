import React from 'react'
import { matchPath } from 'react-router'
import { Link, NavLink, Redirect, Route, Switch } from 'react-router-dom'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
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
import { actions as routingActions } from '../../services/routing'

const { viewAccount } = routingActions

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      viewAccount,
    },
    dispatch,
  )

const connectRedux = connect(null, mapDispatchToProps)

const query = gql(`
fragment AccountFragment on Account {
  id
  ethBalance
  tokenBalance
}
query AccountQuery(
  $id: String!,
  $me: Boolean!
) {
  me @include(if: $me) {
    ...AccountFragment
  }
  account(id: $id) @skip(if: $me) {
    ...AccountFragment
  }
}
`)

const connectApollo = graphql(query, {
  props: ({ data, ownProps }) => {
    const account = {
      id: '',
      ...data.me,
      ...data.account,
    }
    return {
      ...ownProps,
      account,
      color: `#${account.id.substr(2, 6)}aa`,
      error: data.error,
      fetchMore: data.fetchMore,
      refetch: data.refetch,
      loading: data.loading,
    }
  },
  options: ({ match }) => {
    const { account } = match.params
    return {
      pollInterval: 5000,
      variables: {
        id: match.params.account || '',
        me: !match.params.account,
      },
    }
  },
})

const enhance = compose(connectRedux, connectApollo)

const AccountTopSection = styled.div`
  background: radial-gradient(circle at 500px 550px, #177e89cc, #000 75%);
  height: 240px;
  margin: 0 auto;
  padding: 32px;
`

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  margin: 8px;
  background-image: none !important;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  // box-shadow: 0 0 0 1px inset;
  background: none;
  cursor: pointer;
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

const TabLink = ({ children, to }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        margin: '0 8px',
      }}
    >
      <NavLink
        to={to}
        style={{
          display: 'inline-block',
          textDecoration: 'none',
          textTransform: 'capitalize',
          color: '#888',
          paddingBottom: 20,
          paddingTop: 12,
        }}
        activeStyle={{
          color: '#177E89',
          backgroundImage:
            'linear-gradient(to top,rgba(0,0,0,0),rgba(0,0,0,0) 0px,#00eb88 0px,#00eb88 2px,rgba(0,0,0,0) 2px)',
        }}
      >
        {children}
      </NavLink>
    </div>
  )
}

const Tabs = styled.div`
  padding: 8px 8px 0 8px;
  border-bottom: 1px solid #ddd;
`

type Props = {
  // @todo
}

const AccountView: React.Component<Props> = ({
  account,
  color,
  history,
  loading,
  match,
  viewAccount,
}: Props): ReactElement => {
  const me = matchPath(history.location.pathname, { path: '/me' })
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
      <Content>
        <BasicNavbar onSearch={viewAccount} />
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

const Content = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  max-width: 672px;
  margin: 0 auto 120px auto;
  padding: 0 16px;
`

const Media = styled.div`
  position: relative;
  display: block;
  width: 100%;
  max-width: 640px;
  background: #000;
  overflow: hidden;
`

const Info = styled.div`
  position: relative;
  display: flex;
  border: 1px solid #eee;
  border-radius: 0 0 4px 4px;
  padding: 8px 56px 8px 8px;
  background: #fff;
  p {
    margin: 0;
    padding: 0px 8px 8px 8px;
    font-size: 12px;
    color: #555;
    span {
      font-size: 12px;
      color: #aaa;
    }
  }
`

const fadeInOut = keyframes`
  from { opacity: 1; }
  to { opacity: .25; }
`

const FadeInOut = styled.div`
  ${({ loading }) =>
    !loading ? '' : `animation: ${fadeInOut} 2s linear infinite alternate;`};
`

export default enhance(AccountView)
