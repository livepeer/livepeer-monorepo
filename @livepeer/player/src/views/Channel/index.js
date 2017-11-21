import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { VideoPlayer, Snapshot } from '@livepeer/chroma'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {
  actions as jobsActions,
  selectors as jobsSelectors,
} from '../../services/jobs'

const { updateJob } = jobsActions
const { getLiveJobsByChannel, getLiveJobsByBroadcaster } = jobsSelectors

const mapStateToProps = (state, ownProps) => {
  const { channel } = ownProps.match.params
  const isAddress = channel.length === 42
  return {
    jobs: isAddress
      ? getLiveJobsByBroadcaster(channel)(state)
      : getLiveJobsByChannel(channel)(state),
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateJob,
    },
    dispatch,
  )

const enhance = connect(mapStateToProps, mapDispatchToProps)

const Channel = ({ jobs, match, updateJob }) => {
  const [mostRecentJob] = jobs
  const { jobId, streamId, broadcaster, live, poster } = mostRecentJob || {}
  return (
    <div>
      <Navbar>
        <Nav>
          <Link to="/" style={{ lineHeight: 0, padding: '8px 0' }}>
            <img src="/wordmark.svg" height="24" />
          </Link>
          <input
            type="search"
            placeholder="Search by broadcaster address or stream ID"
            style={{
              width: '50%',
              height: 32,
              padding: '0 16px',
              background: 'rgba(255,255,255,.2)',
              color: '#fff',
              outline: 0,
              border: 'none',
              borderRadius: 4,
            }}
          />
        </Nav>
      </Navbar>
      <Content>
        <Media>
          <VideoPlayer
            autoPlay={false}
            poster={poster}
            src={`http://www.streambox.fr/playlists/x36xhzz/${streamId}.m3u8`}
            style={{ maxHeight: '100%' }}
          />
          {!poster && (
            <Snapshot
              at={1}
              defaultSrc="/wordmark.svg"
              url={`http://www.streambox.fr/playlists/x36xhzz/${streamId}.m3u8`}
              width={640}
              height={360}
              style={{ display: 'none' }}
              onSnapshotReady={src => {
                updateJob({
                  jobId,
                  poster: src,
                })
              }}
            />
          )}
        </Media>
        <Info>
          <Snapshot
            at={1}
            defaultSrc="/wordmark.svg"
            url={`http://www.streambox.fr/playlists/x36xhzz/${streamId}.m3u8`}
            width={72}
            height={72}
            style={{
              backgroundColor: '#ccc',
              borderRadius: '2px',
              boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            }}
          />
          <div>
            {live && (
              <LiveBadge>
                <span>•</span>live
              </LiveBadge>
            )}
            <p>
              Broadcaster:<br />
              <span>{broadcaster}</span>
            </p>
            <p>
              Stream ID:<br />
              <span>{streamId}</span>
            </p>
          </div>
        </Info>
        <div>
          <p
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: '100%',
              fontSize: 12,
              color: '#888',
            }}
          >
            Share:&nbsp;
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    width: 24,
                    height: 24,
                    marginRight: 8,
                    background: '#ccc',
                    borderRadius: 4,
                  }}
                />
              ))}
          </p>
        </div>
        <br />
        <br />
        <div>
          <h3 style={{ color: '#555' }}>Streaming Now</h3>
          <hr style={{ border: 0, borderTop: '1px solid #eee' }} />
          <div style={{ display: 'inline-flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
            {Array(7)
              .fill(null)
              .map((_, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    width: 80,
                    height: 80,
                    margin: 'auto',
                    background: '#ccc',
                    borderRadius: 4,
                  }}
                />
              ))}
          </div>
          <p style={{ textAlign: 'right', padding: '0 8px' }}><a href="#">See more</a></p>
        </div>
      </Content>
      <Footer>
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100vw',
            background: '#fff',
            boxShadow: '0 0 2px 0 rgba(0,0,0,.1)',
          }}
        >
          <div
            style={{
              width: 640,
              maxWidth: '100%',
              margin: '0 auto',
              padding: 16,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                flexFlow: 'row-wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <p style={{ width: '75%', margin: 0 }}>
                Enjoying the show? Show your appreciation.<br />
                <a href="#">Learn more</a>
              </p>
              <p style={{ margin: 0 }}>
                <button
                  style={{
                    background: '#03a678',
                    color: '#fff',
                    outline: 0,
                    border: 'none',
                    borderRadius: 4,
                    margin: 0,
                    padding: '8px 12px',
                    fontSize: 12,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  ♥ &nbsp;&nbsp;Leave a tip
                </button>
              </p>
            </div>
          </div>
        </div>
      </Footer>
    </div>
  )
}

const Nav = styled.nav`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  margin-bottom: 24px;
  padding: 16px 24px;
  background: #03a678;
  & *::placeholder {
    color: #fff;
  }
  & > a {
    text-decoration: none;
    font-size: 16px;
    color: #fff;
  }
`

const LiveBadge = styled.span`
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
    color: red;
  }
`

const Content = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  max-width: 672px;
  margin: 0 auto;
  padding: 0 16px;
`

const Media = styled.div`
  display: inline-flex;
  align-items: flex-start;
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

export default enhance(Channel)
