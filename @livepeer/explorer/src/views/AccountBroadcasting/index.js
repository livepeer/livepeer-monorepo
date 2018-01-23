import React, { ReactElement } from 'react'
import { matchPath } from 'react-router'
import { compose, withHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { queries } from '@livepeer/graphql-sdk'
import styled, { keyframes } from 'styled-components'
import {
  DownloadCloud as DownloadCloudIcon,
  Plus as PlusIcon,
  Send as SendIcon,
  Zap as VideoIcon,
} from 'react-feather'
import {
  formatBalance,
  openSocket,
  pathInfo,
  promptForArgs,
  toBaseUnit,
} from '../../utils'

/**
 * Components
 */

const withTransactionHandlers = withHandlers({
  onDepositETH: props =>
    async function depositETH(e: Event): void {
      try {
        e.preventDefault()
        const { deposit } = window.livepeer.rpc
        const args = promptForArgs([
          {
            ask: 'How Much ETH would you like to deposit?',
            format: toBaseUnit,
          },
        ]).filter(x => x)
        if (args.length < 1) return console.warn('Aborting transaction...')
        await deposit(...args)
        window.alert('Deposit complete!')
      } catch (err) {
        window.alert(err.message)
      }
    },
})

const query = gql(`
fragment BroadcasterFragment on Broadcaster {
  id
  deposit
  withdrawBlock
}
fragment JobFragment on Job {
  id
  broadcaster
  streamId
  profiles {
    id
    name
    bitrate
    framerate
    resolution
  }
}
query AccountBroadcasterAndJobsQuery(
  $id: String!,
  $me: Boolean!
) {
  me @include(if: $me) {
    id
    broadcaster {
      ...BroadcasterFragment
      jobs {
        ...JobFragment
      }
    }
  }
  account(id: $id) @skip(if: $me) {
    id
    broadcaster {
      ...BroadcasterFragment
      jobs {
        ...JobFragment
      }
    }
  }
}
`)

const connectApollo = graphql(query, {
  props: ({ data, ownProps }) => {
    const broadcaster = {
      deposit: '',
      withdrawBlock: '',
      jobs: [],
      ...(data.account || {}).broadcaster,
      ...(data.me || {}).broadcaster,
    }
    return {
      ...ownProps,
      error: data.error,
      refetch: data.refetch,
      fetchMore: data.fetchMore,
      loading: data.loading,
      broadcaster,
    }
  },
  options: ({ match }) => {
    return {
      pollInterval: 5000,
      variables: {
        id: pathInfo.getAccountParam(match.path),
        me: pathInfo.isMe(match.path),
      },
    }
  },
})

const enhance = compose(connectApollo, withTransactionHandlers)

/**
 * Components
 */

const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`

const Content = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 672px;
  max-width: 100%;
  margin: 0 auto 120px auto;
  padding: 0 16px;
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

const Box = ({ children, width }) => {
  return (
    <OuterBox width={width}>
      <InnerBox>{children}</InnerBox>
    </OuterBox>
  )
}

const OuterBox = styled.div`
  width: ${({ width }) => width || '100%'};
  padding: 16px 8px;
  text-align: center;
`

const InnerBox = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 2px 0px rgba(0, 0, 0, 0.15);
`

const MetricBox = ({ balance, title, suffix, prefix, erc20, children }) => {
  return (
    <Box width="50%">
      <h2
        style={{
          margin: 0,
          padding: 16,
          fontSize: 14,
          textTransform: 'uppercase',
          borderBottom: '1px solid #eee',
          color: '#666',
        }}
      >
        {title}
      </h2>
      <h3
        style={{
          borderBottom: children ? '1px solid #eee' : '',
          margin: 0,
          padding: `${24 + (!erc20 ? 12 : 0)}px 8px`,
        }}
      >
        {prefix}
        <strong style={{ fontWeight: 400 }}>
          {formatBalance(balance)}
        </strong>{' '}
        {suffix}
        <div>
          {erc20 && (
            <span style={{ fontSize: 12 }}>{formatBalance(balance, 18)}</span>
          )}
        </div>
      </h3>
      <div>{children}</div>
    </Box>
  )
}

type Props = {
  broadcaster: {
    // @todo
  },
  loading: boolean,
}
const AccountBroadcasting: React.Component<Props> = ({
  broadcaster,
  history,
  loading,
  match,
}: AccountBroadcastingProps): ReactElement => {
  const { deposit, jobs, withdrawBlock } = broadcaster
  const me = pathInfo.isMe(match.path)
  return (
    <Wrapper>
      {/** ETH Deposit */}
      <MetricBox erc20 title="ETH Deposit" balance={deposit} />
      {/** Withdraw Block */}
      <MetricBox title="Withdraw Block" balance={withdrawBlock} />
      <Content>
        <h3>Job History</h3>
        {!jobs.length && <div>There are no jobs for this account</div>}
        <div>
          {jobs.map(({ id, broadcaster, profiles, streamId }) => {
            return (
              <div
                key={id}
                style={{
                  background: '#fff',
                  marginBottom: 16,
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <VideoIcon size={24} />
                  <span style={{ padding: 4 }}>#{id}</span>
                </div>
                <div>
                  <strong
                    style={{
                      display: 'block',
                      fontWeight: 400,
                      padding: '16px 0',
                    }}
                  >
                    Manifest ID
                  </strong>
                  <input
                    readOnly
                    value={streamId.substr(0, 68 + 64)}
                    onFocus={e => e.target.select()}
                    style={{
                      // height: 32,
                      fontSize: 12,
                      width: '100%',
                      padding: 8,
                    }}
                  />
                </div>
                <div>
                  <strong
                    style={{
                      display: 'block',
                      fontWeight: 400,
                      padding: '16px 0',
                    }}
                  >
                    Profiles
                  </strong>
                  <div style={{ display: 'flex', flexFlow: 'row' }}>
                    {profiles.map(
                      ({ name, bitrate, framerate, resolution }) => {
                        return (
                          <div
                            key={name}
                            style={{
                              display: 'inline-block',
                              width: '50%',
                              padding: 8,
                              margin: 10,
                              border: '1px solid #eee',
                              fontSize: 14,
                            }}
                          >
                            Name: {name}
                            <br />
                            Bitrate: {bitrate}
                            <br />
                            Framerate: {framerate}
                            <br />
                            Resolution: {resolution}
                            <br />
                          </div>
                        )
                      },
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Content>
    </Wrapper>
  )
}

export default enhance(AccountBroadcasting)
