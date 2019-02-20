import React, { Component } from 'react'
import styled from 'styled-components'
import { VideoPlayer } from '@livepeer/chroma'
import LoadingOverlay from '../../components/LoadingOverlay'
import BasicNavbar from '../../components/BasicNavbar'

export default class Demo extends Component {
  constructor(props) {
    super(props)
    this.state = { live: null }
  }
  render() {
    const { maxWidth = '100%', aspectRatio = '16:9' } = this.props
    const { live } = this.state
    return (
      <div>
        <BasicNavbar />
        <DemoBox>
          <StatsPane />
          <Media maxWidth={maxWidth}>
            <LoadingOverlay live={live} />
            <VideoPlayer
              autoPlay={true}
              poster=""
              src="http://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8"
              aspectRatio={aspectRatio}
              onLive={() => {
                this.setState({ live: true })
              }}
              onDead={() => {
                this.setState({ live: false })
              }}
            />
          </Media>
        </DemoBox>
      </div>
    )
  }
}

const DemoBox = styled.div`
  display: flex;
`

const StatsPane = styled.div`
  flex-basis: 0px;
  flex-grow: 1;
`

const Media = styled.div`
  position: relative;
  flex-grow: 2;
  flex-basis: 0px;
  display: block;
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : '100%')};
  background: #000;
  overflow: hidden;
`
