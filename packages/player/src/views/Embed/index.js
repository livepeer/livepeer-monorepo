import React, { Component } from 'react'
import styled from 'styled-components'
import { VideoPlayer } from '@livepeer/chroma'
import LoadingOverlay from '../../components/LoadingOverlay'

export default class Embed extends Component {
  constructor(props) {
    super(props)
    this.state = { live: null }
  }
  render() {
    const { url, maxWidth = '100%', aspectRatio = '16:9' } = this.props
    const { live } = this.state
    return (
      <Media maxWidth={maxWidth}>
        <LoadingOverlay live={live} />
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
          ref={ref => {
            if (!ref) {
              return
            }
            // Mux Data
            if (typeof window.mux !== 'undefined') {
              window.mux.monitor('.video-react-video', {
                debug: true,
                data: {
                  env_key: process.env.REACT_APP_MUX_ENV_KEY,

                  // Metadata
                  player_name: 'Media Player Embed',
                  player_init_time: Date.now(),
                  // video_id: this.props
                  // We can add other metadata here
                },
              })
            }
          }}
        />
      </Media>
    )
  }
}

const Media = styled.div`
  position: relative;
  display: block;
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : '100%')};
  background: #000;
  overflow: hidden;
`
