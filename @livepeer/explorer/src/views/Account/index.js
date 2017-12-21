import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import styled, { keyframes } from 'styled-components'
import { Video as VideoIcon } from 'react-feather'
import BasicNavbar from '../../components/BasicNavbar'
import Footer from '../../components/Footer'
import { actions as routingActions } from '../../services/routing'

const { viewAccount } = routingActions

const isAddress = x => x.startsWith('0x') && x.length === 42

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      viewAccount,
    },
    dispatch,
  )

const connectRedux = connect(null, mapDispatchToProps)

const AccountFragment = gql`
fragment AccountFragment on Account {
  id
  ethBalance
  tokenBalance
  broadcaster {
    ...BroadcasterFragment
    jobs(dead: $dead, streamRootUrl: $streamRootUrl) {
      ...JobFragment
    }
  }
  delegator {
    ...DelegatorFragment
  }
  transcoder {
    ...TranscoderFragment
  }
}
`

const BroadcasterFragment = gql`
fragment BroadcasterFragment on Broadcaster {
  id
  deposit
  withdrawBlock
}
`

const DelegatorFragment = gql`
fragment DelegatorFragment on Delegator {
  status
  delegateAddress
  bondedAmount
  unbondedAmount
  delegatedAmount
  lastClaimRound
  startRound
  withdrawRound
}
`

const JobFragment = gql`
fragment JobFragment on Job {
  id
  broadcaster
  stream
  profiles {
    id
    name
    bitrate
    framerate
    resolution
  }
  ... on VideoJob {
    live
    url
  }
}
`

const TranscoderFragment = gql`
fragment TranscoderFragment on Transcoder {
  active
  status
  lastRewardRound
  blockRewardCut
  feeShare
  pricePerSegment
  pendingBlockRewardCut
  pendingFeeShare
  pendingPricePerSegment
}
`

// Queries

const AccountQuery = gql`
${AccountFragment}
${BroadcasterFragment}
${DelegatorFragment}
${JobFragment}
${TranscoderFragment}
query AccountQuery($id: String!, $dead: Boolean, $streamRootUrl: String) {
  account(id: $id) {
    ...AccountFragment
  }
}
`

const BroadcasterQuery = gql`
${BroadcasterFragment}
query BroadcasterQuery($id: String!) {
  broadcaster(id: $id) {
    ...BroadcasterFragment
  }
}
`

const BroadcasterWithJobsQuery = gql`
${BroadcasterFragment}
${JobFragment}
query BroadcasterWithJobsQuery($id: String!, $dead: Boolean, $streamRootUrl: String) {
  broadcaster(id: $id) {
    ...BroadcasterFragment
    jobs(dead: $dead, streamRootUrl: $streamRootUrl) {
      ...JobFragment
    }
  }
}
`

const DelegatorQuery = gql`
${DelegatorFragment}
query DelegatorQuery($id: String!) {
  delegator(id: $id) {
    ...DelegatorFragment
  }
}
`

const JobQuery = gql`
${JobFragment}
query JobQuery($id: Int!, $streamRootUrl: String) {
  job(id: $id, streamRootUrl: $streamRootUrl) {
    ...JobFragment
  }
}
`

const JobsQuery = gql`
${JobFragment}
query JobsQuery($dead: Boolean, $streamRootUrl: String, $broadcaster: String, $broadcasterWhereJobId: Int) {
  jobs(dead: $dead, streamRootUrl: $streamRootUrl, broadcaster: $broadcaster, broadcasterWhereJobId: $broadcasterWhereJobId) {
    ...JobFragment
  }
}
`

const TranscoderQuery = gql`
${TranscoderFragment}
query TranscoderQuery($id: String!) {
  transcoder(id: $id) {
    ...TranscoderFragment
  }
}
`

const connectApollo = graphql(AccountQuery, {
  // @TODO: figure out why pollInterval seems to do nothing
  // pollInterval: 10,
  props: ({ data, ownProps }) => {
    return {
      ...ownProps,
      loading: data.loading,
      account: data.account || {},
    }
  },
  options: ({ match }) => {
    const { account } = match.params
    return {
      variables: {
        id: account,
        dead: true,
        streamRootUrl: 'https://d194z9vj66yekd.cloudfront.net/stream/',
      },
    }
  },
})

const enhance = compose(connectRedux, connectApollo)

const AccountView = ({ account, loading, match, viewAccount }) => {
  return (
    <Content>
      <h1 style={{ marginBottom: 0 }}>Livepeer Account</h1>
      <h3>{match.params.account}</h3>
      <pre>
        <code>{loading ? 'loading...' : JSON.stringify(account, null, 2)}</code>
      </pre>
    </Content>
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
