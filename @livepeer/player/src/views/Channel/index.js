import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { VideoPlayer, Snapshot } from '@livepeer/chroma'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import {
  // actions as jobsActions,
  selectors as jobsSelectors,
} from '../../services/jobs'

// const { ... } = jobsActions
const { getLiveJobsByChannel } = jobsSelectors

const mapStateToProps = (state, ownProps) => ({
  jobs: getLiveJobsByChannel(ownProps.match.params.channel)(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch)

const enhance = connect(mapStateToProps, mapDispatchToProps)

const Nav = styled.nav`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  background: #222;
  padding: 24px;
  & > a {
    color: #fff;
    text-decoration: none;
    font-size: 16px;
  }
`

const LiveBadge = styled.span`
  padding: 8px 12px;
  background: green;
  border-radius: 8px;
`

const Channel = ({ jobs, match }) => {
  const [mostRecentJob] = jobs
  const { streamId, broadcaster, live } = mostRecentJob || {}
  return (
    <div>
      <Navbar>
        <Nav>
          <Link to="/">&lsaquo; back</Link>
          <LiveBadge>{live ? 'live!' : 'offline'}</LiveBadge>
        </Nav>
      </Navbar>
      <VideoPlayer
        autoPlay={false}
        poster="/wordmark.svg"
        src={`http://www.streambox.fr/playlists/x36xhzz/${streamId}.m3u8`}
      />
      <p>
        thumbnail:
        <br />
        <Snapshot
          at={10}
          src={`http://www.streambox.fr/playlists/x36xhzz/${streamId}.m3u8`}
          width="100"
          height="56.25"
          onError={e => (e.target.src = '/wordmark.svg')}
          style={{ backgroundColor: '#ccc' }}
        />
      </p>
      <p>channel id: {match.params.channel}</p>
      <p>stream id: {streamId}</p>
      <p>broadcaster: {broadcaster}</p>
      <button>tip the broadcaster (TODO)</button>
      <Footer>footer!</Footer>
    </div>
  )
}

export default enhance(Channel)
