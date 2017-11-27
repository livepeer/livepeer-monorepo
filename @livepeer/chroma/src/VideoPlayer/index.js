import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Player, BigPlayButton } from 'video-react'
import injectStyles from './styles'
import Hls from 'hls.js'

// @TODO:
//   1. Brand video player with <Logo>
//   2. Add nice empty state :)

const getSourceType = src => {
  const types = [
    ['.m3u8', 'application/x-mpegURL'],
    ['.mov', 'video/quicktime'],
    ['.mp4', 'video/mp4'],
    ['.ogm', 'video/ogg'],
    ['.ogv', 'video/ogg'],
    ['.ogg', 'video/ogg'],
    ['.webm', 'video/webm'],
  ]
  for (const [end, type] of types) {
    if (src && src.endsWith(end)) return type
  }
  console.warn(`Could not determine type for src "${src}"`)
  return ''
}

const isHLS = x => x === 'application/x-mpegURL'

export default class VideoPlayer extends Component {
  componentDidMount = injectStyles
  render() {
    const { src, ...props } = this.props
    return (
      <Player playsInline {...props}>
        <BigPlayButton position="center" />
        <Source
          isVideoChild
          autoPlay={props.autoPlay}
          src={src}
          type={getSourceType(src)}
        />
      </Player>
    )
  }
}

export class Source extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    type: PropTypes.string,
    video: PropTypes.object,
  }
  updateSource = () => {
    const { src, type, video, autoPlay } = this.props
    // remove old listeners
    if (this.hls) {
      this.hls.off(Hls.Events.MANIFEST_PARSED, this.onManifestParsed)
    }
    this.hls = new Hls()
    // load hls video source base on hls.js
    if (isHLS(type) && Hls.isSupported()) {
      this.hls.loadSource(src)
      this.hls.attachMedia(video)
      this.hls.on(Hls.Events.MANIFEST_PARSED, this.onManifestParsed)
    }
  }
  onManifestParsed = () => {
    this.hls.off(Hls.Events.MANIFEST_PARSED, this.onManifestParsed)
    delete this.hls
    if (!this.props.autoPlay) return
    this.props.video.play()
  }
  componentDidMount() {
    this.updateSource()
  }
  componentWillReceiveProps(nextProps) {
    const a = this.props.src
    const b = nextProps.src
    if (a === b) return
    // if the src changed, update the video player
    this.updateSource()
  }
  render() {
    return (
      <source
        src={this.props.src}
        type={this.props.type || 'application/x-mpegURL'}
      />
    )
  }
}
