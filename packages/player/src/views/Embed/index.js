import React, { Component } from 'react'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { lifecycle } from 'recompose'
import styled, { keyframes } from 'styled-components'
import {
  // Facebook as FacebookIcon,
  // Github as GithubIcon,
  // Link as LinkIcon,
  // Search as SearchIcon,
  // ThumbsUp as ThumbsUpIcon,
  // Twitter as TwitterIcon,
  Video as VideoIcon,
} from 'react-feather'
import { VideoPlayer, Snapshot } from '@livepeer/chroma'
import BasicNavbar from '../../components/BasicNavbar'
import Footer from '../../components/Footer'
import { actions as routingActions } from '../../services/routing'

const { changeChannel } = routingActions

const isAddress = x => x.startsWith('0x') && x.length === 42

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeChannel,
    },
    dispatch,
  )

const connectRedux = connect(
  null,
  mapDispatchToProps,
)

const JobsQuery = gql`
  fragment JobFragment on Job {
    id
    broadcaster
    broadcasterENSName
    streamId
    profiles {
      id
      name
      bitrate
      framerate
      resolution
    }
  }

  query JobsQuery($broadcaster: String, $skip: Int, $limit: Int) {
    jobs(broadcaster: $broadcaster, skip: $skip, limit: $limit) {
      ...JobFragment
    }
  }
`

const connectApollo = graphql(JobsQuery, {
  props: ({ data, ownProps }, state) => {
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

const enhance = compose(
  connectRedux,
  connectApollo,
)

class Channel extends Component {
  state = {
    url: '',
    live: null,
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
    const {
      jobs,
      loading,
      match,
      history,
      changeChannel,
      updateJob,
    } = this.props
    const { live, url } = this.state
    const [latestJob] = jobs
    const { streamId, broadcaster = match.params.channel } = latestJob || {}
    const searchParams = new URLSearchParams(history.location.search)
    const maxWidth = searchParams.get('maxWidth') || '100%'
    const aspectRatio = searchParams.get('aspectRatio') || '16:9'
    return (
      <Media maxWidth={maxWidth}>
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
          aspectRatio={aspectRatio}
          onLive={() => {
            this.setState({ live: true })
          }}
          onDead={() => {
            this.setState({ live: false })
          }}
        />
      </Media>
    )
  }
}

const ChannelStatus = styled.span`
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
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : '100%')};
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

export default enhance(Channel)
