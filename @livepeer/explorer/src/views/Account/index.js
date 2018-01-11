import React from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { queries } from '@livepeer/graphql-sdk'
import Big from 'big.js'
import styled, { keyframes } from 'styled-components'
import * as Icons from 'react-feather'
import {
  DownloadCloud as DownloadCloudIcon,
  Plus as PlusIcon,
  Video as VideoIcon,
  Send as SendIcon,
} from 'react-feather'
import QRCode from 'qrcode-react'
import BasicNavbar from '../../components/BasicNavbar'
import Footer from '../../components/Footer'
import { actions as routingActions } from '../../services/routing'

const formatBalance = (x, decimals = 6) => {
  if (!x) return ''
  return Big(x)
    .div('1000000000000000000')
    .toFixed(decimals)
    .replace(/0+$/, '')
    .replace(/\.$/, '')
}

const { viewAccount } = routingActions

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      viewAccount,
    },
    dispatch,
  )

const connectRedux = connect(null, mapDispatchToProps)

const connectApollo = graphql(gql(queries.AccountQuery), {
  props: ({ data, ownProps }) => {
    return {
      ...ownProps,
      loading: data.loading,
      account: data.account || {},
      colors: [`#${ownProps.match.params.account.substr(2, 6)}aa`],
    }
  },
  options: ({ match }) => {
    const { account } = match.params
    return {
      pollInterval: 5000,
      variables: {
        id: account,
      },
    }
  },
})

const enhance = compose(connectRedux, connectApollo)

const AccountTopSection = styled.div`
  background: linear-gradient(#283845, #283845cc);
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

const AccountBasicInfo = ({ account, color, me }) => {
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
            value={`${window.location.host}/accounts/${account}`}
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

const AccountView = ({ account, colors, loading, match, me, viewAccount }) => {
  const { bond, deposit, tapFaucet, transferToken } = window.livepeer.rpc
  return (
    <React.Fragment>
      <AccountTopSection>
        <Content>
          <AccountBasicInfo
            me={me}
            account={match.params.account.toLowerCase()}
            color={colors[0]}
          />
        </Content>
      </AccountTopSection>
      <Content>
        <BasicNavbar onSearch={viewAccount} />
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div
            style={{
              width: '50%',
              margin: '16px 8px',
              textAlign: 'center',
              background: '#fff',
              borderRadius: 4,
              boxShadow: '0 2px 2px 0px rgba(0,0,0,.15)',
            }}
          >
            <h3
              style={{
                borderBottom: '1px solid #eee',
                margin: 0,
                padding: '24px 8px',
              }}
            >
              <strong style={{ fontWeight: 400 }}>
                {formatBalance(account.ethBalance)}
              </strong>{' '}
              ETH
              <div>
                <span style={{ fontSize: 12 }}>
                  {formatBalance(account.ethBalance, 18)}
                </span>
              </div>
            </h3>
            <div>
              <Button
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
                <DownloadCloudIcon size={12} />
                <span style={{ marginLeft: 8 }}>request</span>
              </Button>
              <Button
                onClick={async e => {
                  e.preventDefault()
                  try {
                    // @todo - update tx loading state
                    await deposit(
                      window.prompt('How Much LPT would you like to deposit?'),
                    )
                    window.alert('Deposit complete!')
                  } catch (err) {
                    console.log(err)
                    window.alert(err.message)
                  } finally {
                    // @todo - update tx loading state
                  }
                }}
              >
                <PlusIcon size={12} />
                <span style={{ marginLeft: 8 }}>deposit</span>
              </Button>
            </div>
          </div>
          <div
            style={{
              width: '50%',
              margin: '16px 8px',
              textAlign: 'center',
              background: '#fff',
              borderRadius: 4,
              boxShadow: '0 2px 2px 0px rgba(0,0,0,.15)',
            }}
          >
            <h3
              style={{
                borderBottom: '1px solid #eee',
                margin: 0,
                padding: '24px 8px',
              }}
            >
              <strong style={{ fontWeight: 400 }}>
                {formatBalance(account.tokenBalance)}
              </strong>{' '}
              LPT
              <div>
                <span style={{ fontSize: 12 }}>
                  {formatBalance(account.tokenBalance, 18)}
                </span>
              </div>
            </h3>
            <div>
              <Button
                onClick={async e => {
                  e.preventDefault()
                  try {
                    const res = await tapFaucet()
                    window.alert('Got LPT!')
                  } catch (err) {
                    console.error(err)
                    window.alert(err.message)
                  }
                }}
              >
                <DownloadCloudIcon size={12} />
                <span style={{ marginLeft: 8 }}>request</span>
              </Button>
              <Button
                onClick={async e => {
                  e.preventDefault()
                  try {
                    // @todo - update tx loading state
                    await transferToken(
                      window.prompt('Who would you like to transfer LPT to?'),
                      window.prompt('How Much LPT would you like to transfer?'),
                    )
                    window.alert('Transfer complete!')
                  } catch (err) {
                    console.log(err)
                    window.alert(err.message)
                  } finally {
                    // @todo - update tx loading state
                  }
                }}
              >
                <SendIcon size={12} />
                <span style={{ marginLeft: 8 }}>transfer</span>
              </Button>
            </div>
          </div>
        </div>
        <pre>
          <code>
            {loading ? 'loading...' : JSON.stringify(account, null, 2)}
          </code>
        </pre>
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
