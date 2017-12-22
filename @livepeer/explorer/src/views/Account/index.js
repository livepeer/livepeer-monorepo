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
  query BroadcasterWithJobsQuery(
    $id: String!
    $dead: Boolean
    $streamRootUrl: String
  ) {
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
  query JobsQuery(
    $dead: Boolean
    $streamRootUrl: String
    $broadcaster: String
    $broadcasterWhereJobId: Int
  ) {
    jobs(
      dead: $dead
      streamRootUrl: $streamRootUrl
      broadcaster: $broadcaster
      broadcasterWhereJobId: $broadcasterWhereJobId
    ) {
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
      pollInterval: 5000,
      variables: {
        id: account,
        dead: true,
        streamRootUrl: 'https://d194z9vj66yekd.cloudfront.net/stream/',
      },
    }
  },
})

const enhance = compose(connectRedux, connectApollo)

const AccountView = ({ account, loading, match, me, viewAccount }) => {
  const { bond, tapFaucet } = window.livepeer.rpc
  return (
    <Content>
      <BasicNavbar onSearch={viewAccount} />
      <h1 style={{ marginBottom: 0 }}>Livepeer Account</h1>
      <h3>{match.params.account.toLowerCase()}</h3>
      {me && (
        <div>
          {/* https://thenounproject.com/wirawizinda097/collection/kitchen/?oq=faucet&cidx=1&i=1263707
            <div
            style={{
              display: 'inline-block',
              width: 16,
              height: 16,
              backgroundSize: 'contain',
              backgroundImage:
                'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjAwJyBoZWlnaHQ9JzIwMCcgZmlsbD0iIzAwMDAwMCIgeG1sbnM6eD0iaHR0cDovL25zLmFkb2JlLmNvbS9FeHRlbnNpYmlsaXR5LzEuMC8iIHhtbG5zOmk9Imh0dHA6Ly9ucy5hZG9iZS5jb20vQWRvYmVJbGx1c3RyYXRvci8xMC4wLyIgeG1sbnM6Z3JhcGg9Imh0dHA6Ly9ucy5hZG9iZS5jb20vR3JhcGhzLzEuMC8iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOmE9Imh0dHA6Ly9ucy5hZG9iZS5jb20vQWRvYmVTVkdWaWV3ZXJFeHRlbnNpb25zLzMuMC8iIHZlcnNpb249IjEuMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAgMTAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBkPSJNNjgsMzcuOWgyNC4zYzEuMSwwLDItMC45LDItMnMtMC45LTItMi0ySDY2LjljLTItNS02LjYtOC43LTEyLjItOS41VjIxSDY2YzEuMSwwLDItMC45LDItMnMtMC45LTItMi0ySDM5LjUgICBjLTEuMSwwLTIsMC45LTIsMnMwLjksMiwyLDJoMTEuM3YzLjRjLTUuNSwwLjctMTAuMSw0LjQtMTIuMiw5LjVIMjcuMmMtMTIuNCwwLTIxLjQsOC4zLTIxLjQsMTkuNmMwLDAuMSwwLDAuMSwwLDAuMiAgIGMwLDAuMSwwLDAuMSwwLDAuMmMwLDEuMSwwLjksMiwyLDJoMTBjMS4xLDAsMi0wLjksMi0yYzAtNC4xLDMuMy03LjQsNy40LTcuNGMwLDAsMCwwLDAsMGgxMS44YzIuNSw0LjksNy42LDguMywxMy41LDguMyAgIGM1LjksMCwxMS0zLjQsMTMuNS04LjNoMjZjMS4xLDAsMi0wLjksMi0ycy0wLjktMi0yLTJINjhWMzcuOXogTTM3LjUsNDIuNUgyNy4yYy0wLjEsMC0wLjEsMC0wLjIsMGMtNS41LDAuMS0xMC4xLDQuMS0xMSw5LjRIMTAgICBjMC44LTguMiw3LjgtMTQuMSwxNy4zLTE0LjFoMTAuM1Y0Mi41eiBNNTIuNyw1MC44Yy02LjIsMC0xMS4zLTUtMTEuMy0xMS4zczUtMTEuMywxMS4zLTExLjNTNjQsMzMuMyw2NCwzOS41UzU4LjksNTAuOCw1Mi43LDUwLjggICB6Ii8+PHBhdGggZD0iTTEyLjksNjBjLTAuNywwLTEuMywwLjQtMS43LDAuOWMtMC42LDAuOS01LjQsOC44LTUuNCwxMy4xYzAsNSwzLjEsOSw3LjEsOXM3LjEtMy45LDcuMS05YzAtNC4zLTQuOS0xMi4yLTUuNC0xMy4xICAgQzE0LjIsNjAuNCwxMy42LDYwLDEyLjksNjB6IE0xMi45LDc5Yy0xLjcsMC0zLjEtMi4zLTMuMS01YzAtMS43LDEuNi01LjIsMy4xLTguMWMxLjYsMi45LDMuMSw2LjMsMy4xLDguMSAgIEMxNiw3Ni43LDE0LjYsNzksMTIuOSw3OXoiLz48L2c+PC9zdmc+")',
            }}
          />*/}
          <button
            onClick={() => {
              const ws = new WebSocket('ws://52.14.204.154/api')
              ws.onopen = () => {
                ws.onerror = e => {
                  console.error(e)
                }
                ws.onmessage = e => {
                  const data = JSON.parse(e.data)
                  console.log(account, data)
                  if (data.requests) {
                    data.requests.forEach(({ account: addr, time }) => {
                      if (addr.toLowerCase() !== account.id.toLowerCase())
                        return
                      const t1 = Date.now()
                      const t2 = +new Date(time)
                      const t = t1 - t2
                      const waitTime = 270 * 60 * 1000
                      const timeRemaining = waitTime - t
                      if (timeRemaining > 0) {
                        window.alert(
                          `You may tap the ETH faucet again in ${msToTime(
                            waitTime - t,
                          )}`,
                        )
                      } else {
                        window.alert('Got some ETH from the faucet! :)')
                      }
                      // console.log(
                      //   t1,
                      //   t2,
                      //   t,
                      //   waitTime - t,
                      //   msToTime(waitTime - t),
                      //   msToTime(t),
                      // )
                    })
                  }
                  ws.close()
                  function msToTime(duration) {
                    let milliseconds = parseInt((duration % 1000) / 100),
                      seconds = parseInt((duration / 1000) % 60),
                      minutes = parseInt((duration / (1000 * 60)) % 60),
                      hours = parseInt((duration / (1000 * 60 * 60)) % 24)

                    hours = hours < 10 ? '0' + hours : hours
                    minutes = minutes < 10 ? '0' + minutes : minutes
                    seconds = seconds < 10 ? '0' + seconds : seconds

                    return hours + 'h ' + minutes + 'min ' + seconds + 's'
                  }
                }
                const payload = `{"url":"${account.id}","tier":2}`
                console.log('SENDING', payload)
                ws.send(payload)
              }
            }}
          >
            get ETH
          </button>
          <button
            onClick={async e => {
              e.preventDefault()
              try {
                const res = await tapFaucet()
                window.alert('Got LPT!\n' + JSON.stringify(res, null, 2))
              } catch (err) {
                console.error(err)
                window.alert(err.message)
              }
            }}
          >
            get LPT
          </button>
          <button
            onClick={async e => {
              e.preventDefault()
              try {
                await bond({
                  to: window.prompt('Who would you like to bond to?'),
                  amount: window.prompt('How Much LPT would you like to bond?'),
                })
              } catch (err) {
                console.log(err)
              }
            }}
          >
            bond
          </button>
        </div>
      )}
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
