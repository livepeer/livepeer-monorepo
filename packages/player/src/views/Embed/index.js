import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { VideoPlayer } from '@livepeer/chroma'

export default class Embed extends Component {
  constructor(props) {
    super(props)
    this.state = { live: null }
  }
  render() {
    const { loading, url, maxWidth = '100%', aspectRatio = '16:9' } = this.props
    const { live } = this.state
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
            <FadeInOut loading={live === null}>
              <p>
                {live === null
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

const Media = styled.div`
  position: relative;
  display: block;
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : '100%')};
  background: #000;
  overflow: hidden;
`

const fadeInOut = keyframes`
  from { opacity: 1; }
  to { opacity: .25; }
`

const FadeInOut = styled.div`
  ${({ loading }) =>
    !loading ? '' : `animation: ${fadeInOut} 2s linear infinite alternate;`};
`
