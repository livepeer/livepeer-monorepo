import React, { Component } from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import {
  Code as CodeIcon,
  // Facebook as FacebookIcon,
  // GitHub as GitHubIcon,
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
import * as qs from 'query-string'
import { Switch } from 'rmwc/Switch'
import LoadingOverlay from '../../components/LoadingOverlay'

const { changeURL } = routingActions

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeURL,
    },
    dispatch,
  )

const connectRedux = connect(
  null,
  mapDispatchToProps,
)

const enhance = compose(connectRedux)

class Channel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      live: null,
      modal: '', // link | embed
      didCopy: false,
      bannerOpen: true,
      allowFullscreen: true,
    }
  }

  closeBanner = () => {
    this.setState({ bannerOpen: false })
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

  render() {
    const { changeURL, url } = this.props
    const { live, modal, didCopy, bannerOpen, allowFullscreen } = this.state
    const embedLink = `<iframe width="640" height="360" src="${
      window.location.origin
    }/embed?${qs.stringify({
      url,
      maxWidth: '100%',
      aspectRatio: '16:9',
    })}" ${allowFullscreen ? 'allowfullscreen' : ''}></iframe>`
    return (
      <div>
        <BasicNavbar onSearch={changeURL} />
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
              readOnly
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
            readOnly
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

          <Switch
            checked={this.state.allowFullscreen}
            onChange={evt =>
              this.setState({ allowFullscreen: evt.target.checked })
            }
          >
            Allow Fullscreen
          </Switch>

          {document.queryCommandSupported('copy') && (
            <p style={{ textAlign: 'right' }}>
              <Button onClick={this.copyToClipboard}>
                {didCopy ? 'Copied!' : 'Copy'}
              </Button>
            </p>
          )}
        </Modal>
        {/*
         * Video Player
         */}
        <Media>
          <LoadingOverlay live={live} />
          <VideoPlayer
            autoPlay={true}
            poster=""
            src={url}
            aspectRatio="16:9"
            style={{ paddingTop: 'calc(100% - 56.25%)' }}
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
                Stream URL:
                <br />
                <span title={url}>{url || 'N/A'}</span>
              </p>
            </div>
          </Info>
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
                  const message = `Check out this live stream on the Livepeer Media Player\n${
                    window.location
                  }\n#livepeer #eth #decentralized`
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
              display: bannerOpen ? 'block' : 'none',
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

                  <Button
                    style={{ margin: '0 16px 0 16px' }}
                    onClick={() => {
                      this.closeBanner()
                    }}
                  >
                    x
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
  // max-height: 56.25vw;
  // padding-top: 56.25%;
  background: #000;
  overflow: hidden;
  .video-react {
    padding-top: calc(100% - 56.25%) !important;
  }
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

export default enhance(Channel)
