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

const HlsConfig = {
  pLoader,
  // liveDurationInfinity: true,
  // debug: true,
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
    const { src, onLive, onDead, autoPlay, ...props } = this.props
    return (
      <Player playsInline muted={true} {...props}>
        <BigPlayButton position="center" />
        <Source
          isVideoChild
          onLive={onLive}
          onDead={onDead}
          autoPlay={autoPlay}
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
  hls = new Hls(HlsConfig)
  // resumes play if the video player is already playing when a stream dies
  autoPlay = this.props.autoPlay
  // latest sequence (.ts) id
  endSNs = []
  // if frag level endSN is the same n times in a row, the stream will be considered "dead"
  endSNThreshold = 4
  updateSource = () => {
    const { actions, src, type, video } = this.props
    // remove old listeners
    if (this.hls) {
      this.hls.destroy()
      this.hls = new Hls(HlsConfig)
    }
    // load hls video source base on hls.js
    if (src && isHLS(type)) {
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
          `)
          if (Hls.isSupported()) {
            // Desktop
            console.log('Attaching media')
            this.hls.attachMedia(video)
          } else {
            // iOS
            console.log('setting src attr')
            video.src = src
            this.hls.media = video
          }
          this.props.onLive()
          if (this.autoPlay) {
            delete this.autoPlay
            video
              .play()
              .catch(console.error)
              .then(actions.handlePlay)
          }
        }
        if (this.endSNs.length >= this.endSNThreshold && END_SNS.size <= 1) {
          console.log(`
            ***************
            STREAM IS DEAD!
            ***************
          `)
          this.autoPlay = !video.paused
          this.hls.stopLoad()
          if (Hls.isSupported()) {
            // Desktop
            console.log('Detaching media')
            this.hls.detachMedia()
          } else {
            // iOS
            console.log('unsetting src attr')
            video.src = ''
            this.hls.media = null
          }
          this.props.onDead()
        }
      })
      this.hls.on(Hls.Events.ERROR, (event, data) => {
        // Log errors to console to help with debugging
        console.log(event, data)
        switch (data.details) {
          case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
          case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT: {
            this.props.onDead()
          }
        }
      })
    }
    // else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    //   video.src = src
    //   video.addEventListener('canplay', () => {
    //     video.play()
    //   })
    // }
  }
  componentDidMount() {
    this.updateSource()
  }
  componentWillReceiveProps(nextProps) {
    const a = this.props.src
    const b = nextProps.src
    if (a === b) return
    console.log('Will resume play?', this.autoPlay)
    if (this.autoPlay === undefined) {
      this.autoPlay = !nextProps.video.paused
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
