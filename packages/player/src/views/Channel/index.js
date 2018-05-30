import React, { Component } from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { queries } from '@livepeer/graphql-sdk'
import { lifecycle } from 'recompose'
import styled, { keyframes } from 'styled-components'
import {
  Code as CodeIcon,
  Facebook as FacebookIcon,
  // Github as GithubIcon,
  Link as LinkIcon,
  // Search as SearchIcon,
  // ThumbsUp as ThumbsUpIcon,
  Twitter as TwitterIcon,
  Video as VideoIcon,
} from 'react-feather'
import { VideoPlayer, Snapshot } from '@livepeer/chroma'
import BasicNavbar from '../../components/BasicNavbar'
import Footer from '../../components/Footer'
import { actions as routingActions } from '../../services/routing'
import Modal from 'react-responsive-modal'

const { changeChannel } = routingActions

const isAddress = x => x.startsWith('0x') && x.length === 42

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeChannel,
    },
    dispatch,
  )

const connectRedux = connect(null, mapDispatchToProps)

const connectApollo = graphql(gql(queries.JobsQuery), {
  props: ({ data, ownProps }, state) => {
    // console.log(data)
    return {
      ...ownProps,
      loading: data.loading,
      jobs: data.jobs || [],
    }
  },
  options: ({ match }) => {
    const { channel } = match.params
    return {
      pollInterval: 5000,
      variables: {
        broadcaster: channel,
      },
    }
  },
})

const enhance = compose(connectRedux, connectApollo)

class Channel extends Component {
  state = {
    url: '',
    live: null,
    modal: '', // tip | link | embed
    tipAmount: 0,
    didCopy: false,
  }
  openModal = modal => {
    this.setState({ modal })
  }

  closeModal = () => {
    this.setState({ modal: '', didCopy: false, tipAmount: 0 })
  }

  copyToClipboard = e => {
    this.text.select()
    document.execCommand('copy')
    this.setState({ didCopy: true })
  }

  sendTip = (broadcaster, value) => {
    window.web3.eth.sendTransaction(
      {
        from: window.web3.eth.coinbase,
        to: broadcaster,
        value: window.web3.toWei(value, 'ether'),
      },
      (error, result) => {
        this.setState({ tippingOpen: false })
      },
    )
  }

  handleTipChange = e => {
    this.setState({ tipAmount: e.target.value })
  }

  async componentWillReceiveProps(nextProps) {
    const { channel } = nextProps.match.params
    const [latestJob] = nextProps.jobs
    if (!latestJob) {
      if (nextProps.loading === false) this.setState({ live: false })
      return
    }
    const manifestId = latestJob.streamId.substr(0, 68 + 64)
    if (channel === process.env.REACT_APP_LIVEPEER_TV_ADDRESS) {
      return this.setState({
        live: true,
        url: `${
          process.env.REACT_APP_LIVEPEER_TV_STREAM_ROOT_URL
        }/${manifestId}.m3u8`,
      })
    }
    if (channel === process.env.REACT_APP_CRYPTO_LIVEPEER_TV_ADDRESS) {
      return this.setState({
        live: true,
        url: `${
          process.env.REACT_APP_CRYPTO_LIVEPEER_TV_STREAM_ROOT_URL
        }/${manifestId}.m3u8`,
      })
    }
    let url = `${process.env.REACT_APP_STREAM_ROOT_URL}/${manifestId}.m3u8`
    this.setState({ url })
  }

  render() {
    const { jobs, loading, match, changeChannel, updateJob } = this.props
    const { live, url, modal, didCopy, tipAmount } = this.state
    const [latestJob] = jobs
    const { streamId, broadcaster = match.params.channel } = latestJob || {}
    const web3IsEnabled = window.web3 && window.web3.eth.coinbase
    const embedLink = `<iframe width="240" height="160" src="${
      window.location.origin
    }/embed/${broadcaster}/?maxWidth=100%&aspectRatio=16:9"></iframe>`
    return (
      <div>
        <BasicNavbar onSearch={changeChannel} />
        {/*
          * Modals
          */}
        {/* Channel Link Url */}
        <Modal
          open={modal === 'link'}
          onClose={() => this.closeModal('link')}
          center
        >
          <h2>Copy Channel Link</h2>
          <div style={{ display: 'flex' }}>
            <input
              ref={text => (this.text = text)}
              style={{
                width: '100%',
                borderRadius: 0,
                borderWidth: 2,
                borderColor: 'var(--primary)',
                borderStyle: 'solid',
                padding: 5,
                outline: 'none',
                fontSize: 14,
              }}
              type="text"
              value={window.location.toString()}
              onClick={this.copyToClipboard}
            />
            {document.queryCommandSupported('copy') && (
              <Button style={{ width: 128 }} onClick={this.copyToClipboard}>
                {didCopy ? 'Copied!' : 'Copy'}
              </Button>
            )}
          </div>
        </Modal>
        {/* Channel Embed Code */}
        <Modal
          open={modal === 'embed'}
          onClose={() => this.closeModal('embed')}
          center
        >
          <h2>Copy Embed Link</h2>
          <textarea
            ref={text => (this.text = text)}
            style={{
              display: 'block',
              width: 320,
              height: 104,
              padding: 8,
              outline: 'none',
              fontSize: '14px',
            }}
            onClick={this.copyToClipboard}
            value={embedLink}
          />
          {document.queryCommandSupported('copy') && (
            <p style={{ textAlign: 'right' }}>
              <Button onClick={this.copyToClipboard}>
                {didCopy ? 'Copied!' : 'Copy'}
              </Button>
            </p>
          )}
        </Modal>
        {/* Broadcaster Tipping */}
        <Modal
          open={modal === 'tip'}
          onClose={() => this.closeModal('tip')}
          center
        >
          <h2>Leave a tip</h2>
          <p
            style={{
              lineHeight: 1.5,
              color: '#555',
            }}
          >
            Enter the amount of ETH you want to tip:
          </p>
          <div style={{ display: 'flex' }}>
            <input
              style={{
                width: '100%',
                borderRadius: 0,
                borderWidth: 2,
                borderColor: 'var(--primary)',
                borderStyle: 'solid',
                padding: 5,
                outline: 'none',
                fontSize: 14,
              }}
              type="number"
              placeholder="0.002"
              step="0.001"
              min="0"
              onChange={this.handleTipChange}
              value={tipAmount}
            />
            <Button
              style={{ width: 128 }}
              onClick={() => this.sendTip(broadcaster, tipAmount)}
            >
              ♥ Send tip
            </Button>
          </div>
        </Modal>
        {/*
          * Video Player
          */}
        <Media>
          {(!live || loading) && (
            <div
              style={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#000',
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                margin: 0,
                color: '#fff',
                zIndex: 2,
              }}
            >
              <FadeInOut loading={loading || live === null}>
                <p>
                  {loading || live === null
                    ? 'L O A D I N G ...'
                    : 'This broadcaster is currently offline'}
                </p>
              </FadeInOut>
            </div>
          )}
          <VideoPlayer
            autoPlay={true}
            poster=""
            src={url}
            aspectRatio="16:9"
            onLive={() => {
              this.setState({ live: true })
            }}
            onDead={() => {
              this.setState({ live: false })
            }}
          />
        </Media>
        <Content>
          <Info>
            <Snapshot
              at={1}
              defaultSrc="/static/images/snapshot-placeholder.svg"
              url={live ? url : ''}
              width={128}
              height={128}
              style={{
                backgroundColor: '#222',
                borderRadius: '1px 0 0 1px',
              }}
            />
            <div style={{ width: 'calc(100% - 128px)', padding: 8 }}>
              <ChannelStatus live={live}>
                <span>•</span>
                {live ? 'live' : 'offline'}
              </ChannelStatus>
              <p
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                Broadcaster:<br />
                <span>{isAddress(broadcaster) ? broadcaster : 'Unknown'}</span>
              </p>
              <p
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                Stream ID:<br />
                <span title={url}>{streamId || 'N/A'}</span>
              </p>
            </div>
          </Info>
          {/*
            * Tipping
            */}
          <div
            style={{
              display: web3IsEnabled ? 'block' : 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexFlow: 'row-wrap',
                justifyContent: 'flex-end',
                alignItems: 'center',
                width: '100%',
                margin: '0 auto',
                padding: '16px 0',
              }}
            >
              <p
                style={{
                  margin: 0,
                  paddingLeft: 16,
                  lineHeight: 1.5,
                  color: 'var(--text)',
                }}
              >
                Enjoying the show? Support your favorite broadcasters &nbsp;
                <Button onClick={() => this.openModal('tip')}>
                  ♥ &nbsp;&nbsp;Leave a tip
                </Button>
              </p>
            </div>
          </div>
          {/*
            * Share links
            */}
          <div>
            <p
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingRight: 8,
                width: '100%',
                fontSize: 12,
                color: 'var(--text)',
              }}
            >
              Share: &nbsp;
              {/*<FacebookIcon
                color="var(--primary)"
                size={18}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  window.confirm('Share on Facebook...')
                }}
              />*/}
              &nbsp;&nbsp;
              <TwitterIcon
                color="var(--primary)"
                size={18}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const message = `Check out ${broadcaster}'s live stream on the Livepeer Media Player DApp\n${
                    window.location
                  }\n#livepeer #eth #dapp #decentralized`
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      message,
                    )}`,
                  )
                }}
              />
              &nbsp;&nbsp;
              <LinkIcon
                color="var(--primary)"
                size={18}
                style={{ cursor: 'pointer' }}
                onClick={() => this.openModal('link')}
              />
              &nbsp;&nbsp;
              <CodeIcon
                color="var(--primary)"
                size={18}
                style={{ cursor: 'pointer' }}
                onClick={() => this.openModal('embed')}
              />
            </p>
          </div>
          <br />
          <br />
          {/*
            <div>
              <h3 style={{ color: '#555' }}>Streaming Now</h3>
              <hr style={{ border: 0, borderTop: '1px solid #eee' }} />
              <div
                style={{
                  display: 'inline-flex',
                  width: '100%',
                  marginTop: -16,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {[
                  'http://static.filehorse.com/screenshots-web/online-games/minecraft-screenshot-02.jpg',
                  'http://catbordhi.com/wp-content/uploads/015.jpg',
                  'https://i.ytimg.com/vi/sUStdzuKKL8/hqdefault.jpg',
                  'https://ak3.picdn.net/shutterstock/videos/3818060/thumb/1.jpg',
                  'http://www.iac.lu.se/wp-content/uploads/2015/06/video_studio.jpg',
                  'https://i.ytimg.com/vi/hGE2EUiE7Oo/maxresdefault.jpg',
                  'https://www.geek.com/wp-content/uploads/2016/03/video-game-streaming-625x350.jpg',
                ].map((url, i) => (
                  <span
                    key={i}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: 'calc(100% / 7)',
                      paddingBottom: 'calc(100% / 7)',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 16,
                        left: 8,
                        right: 8,
                        margin: 'auto',
                        backgroundColor: '#ccc',
                        backgroundImage: `url(${url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        window.confirm(
                          'Probably link to some hard-coded 24/7 streams here',
                        )
                      }}
                    />
                  </span>
                ))}
              </div>
              <p style={{ textAlign: 'right', padding: '0 8px', fontSize: 12 }}>
                <a href="#">See more</a>
              </p>
            </div>
          */}
        </Content>
        <Footer>
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              width: '100vw',
              background: '#00eb87',
              color: '#000',
              boxShadow: '0 0 2px 0 rgba(0,0,0,.1)',
            }}
          >
            <div
              style={{
                // width: 640,
                maxWidth: '100%',
                margin: '0 auto',
                padding: 16,
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  flexFlow: 'row-wrap',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <VideoIcon color="#000" size={32} />
                <p
                  style={{
                    // width: '75%',
                    margin: 0,
                    padding: '0 16px',
                    lineHeight: 1.5,
                    color: '#000',
                  }}
                >
                  Livepeer is building decentralized video broadcasting
                  infrastructure on the Ethereum mainnet.
                </p>
                <p style={{ margin: '0 0 0 auto' }}>
                  <Button
                    onClick={() => {
                      window.open('https://livepeer.org/participate/')
                    }}
                  >
                    Join the Alpha
                  </Button>
                </p>
              </div>
            </div>
          </div>
        </Footer>
      </div>
    )
  }
}

const Button = styled.button`
  background: ${({ inverted }) => (inverted ? 'var(--primary)' : '#000')};
  color: ${({ inverted }) => (!inverted ? 'var(--primary)' : '#000')};
  outline: 0;
  border: none;
  borde-radius: 0;
  margin: 0;
  padding: 8px 12px;
  font-size: 12px;
  text-transform: uppercase;
  cursor: pointer;
  letter-spacing: 1;
`

const ChannelStatus = styled.span`
  display: inline-block;
  position: absolute;
  right: 8px;
  top: 8px;
  text-transform: uppercase;
  color: var(--text);
  font-size: 11px;
  background #000;
  padding: 4px 8px;
  border-radius: 2px;
  letter-spacing: 1px;
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
  // max-width: 672px;
  margin: 0 auto 120px auto;
  padding: 16px;
`

const Media = styled.div`
  position: relative;
  display: block;
  width: 100%;
  max-width: 100%;
  max-height: 66vh;
  background: #000;
  overflow: hidden;
`

const Info = styled.div`
  position: relative;
  display: flex;
  margin: 0;
  background #111;
  box-shadow: 0px 0px 1px 0px #000;
  p {
    margin: 0;
    padding: 0px 8px 8px 8px;
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

export default enhance(Channel)
