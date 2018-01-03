import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Player, BigPlayButton } from 'video-react'
import injectStyles from './styles'
import Hls from 'hls.js'

const pLoader = function(config) {
  const loader = new Hls.DefaultConfig.loader(config)
  this.abort = () => loader.abort()
  this.destroy = () => loader.destroy()
  this.load = (context, config, callbacks) => {
    let { type, url } = context
    if (type === 'manifest') {
      console.log(`Manifest ${url.split('/')[4]} will be loaded.`)
    }
    loader.load(context, config, callbacks)
  }
}

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
    const { src, onLive, onDead, ...props } = this.props
    return (
      <Player playsInline {...props}>
        <BigPlayButton position="center" />
        <Source
          isVideoChild
          onLive={onLive}
          onDead={onDead}
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
  static defaultProps = {
    onLive: () => {},
    onDead: () => {},
  }
  hls = new Hls({ pLoader })
  // resumes play if the video player is already playing when a stream dies
  resumePlay
  // latest sequence (.ts) id
  endSNs = []
  // if frag level endSN is the same n times in a row, the stream will be considered "dead"
  endSNThreshold = 4
  updateSource = () => {
    const { actions, src, type, video } = this.props
    // remove old listeners
    if (this.hls) {
      this.hls.destroy()
      this.hls = new Hls({ pLoader })
    }
    // load hls video source base on hls.js
    if (isHLS(type) && Hls.isSupported()) {
      this.hls.loadSource(src)
      this.hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        console.log('end segment:', data.details.endSN)
        if (this.endSNs.length >= this.endSNThreshold) this.endSNs.shift()
        this.endSNs.push(data.details.endSN)
        const END_SNS = new Set(this.endSNs)
        if (END_SNS.size > 1 && !this.hls.media) {
          console.log(`
            ***************
            STREAM IS LIVE!
            ***************
            Attaching media
          `)
          this.hls.attachMedia(video)
          this.props.onLive()
          if (this.props.autoPlay || this.resumePlay) {
            delete this.resumePlay
            video.play().then(() => {
              actions.handlePlay()
            })
          }
        }
        if (this.endSNs.length >= this.endSNThreshold && END_SNS.size <= 1) {
          console.log(`
            ***************
            STREAM IS DEAD!
            ***************
            Detaching media
          `)
          this.resumePlay = !video.paused
          this.hls.stopLoad()
          this.hls.detachMedia()
          this.props.onDead()
        }
      })
      this.hls.on(Hls.Events.ERROR, (event, data) => {
        console.log(event, data)
      })
    }
  }
  componentDidMount() {
    this.updateSource()
  }
  componentWillReceiveProps(nextProps) {
    const a = this.props.src
    const b = nextProps.src
    if (a === b) return
    console.log('Will resume play?', this.resumePlay)
    if (this.resumePlay === undefined) {
      this.resumePlay = !nextProps.video.paused
    }
    // if the src changed, update the video player
    setTimeout(() => this.updateSource())
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
