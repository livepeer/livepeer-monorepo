import React, { Component, ReactChildren, ReactElement } from 'react'
import PropTypes from 'prop-types'
import { Player, BigPlayButton, ControlBar } from 'video-react'
import GlobalStyles from './styles'
import Hls from 'hls.js'

/**
 * A playlist loader class that implements custom logic
 * for requesting playlists via hls.js
 */
class pLoader extends Hls.DefaultConfig.loader {
  /**
   * Original (default) playlist load method
   * @param {Object} ctx - loading context
   * @param {Object} config - loading config
   * @param {Object} callbacks - loading callbacks
   */
  _load = this.load.bind(this)
  /**
   * Modified playlist load method
   * Mostly just adds some extra logging whenever a manifest is requested
   * @param {Object} ctx - loading context
   * @param {Object} config - loading config
   * @param {Object} callbacks - loading callbacks
   */
  load = (ctx, config, cbs) => {
    const { type, url } = ctx
    if (type === 'manifest') console.log(`Manifest ${url} will be loaded.`)
    else console.log('loading', url)
    const loader = new ctx.loader(config)
    const _ctx = { ...ctx, loader }
    const _cbs = {
      ...cbs,
      onSuccess: (res, stats, ctx) => {
        // we can also add in some extra success logging here if desired
        cbs.onSuccess(res, stats, ctx)
      },
    }
    this._load(_ctx, config, _cbs)
  }
}

/**
 * Gets the mimeType for a given video file extension
 * @param {string} src - the video filename or url
 * @return {string} the mimeType, if found
 */
const getSourceType = (src: string): string => {
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

/**
 * Whether a mimeType represents an HLS file (.m3u8)
 * @param {string} x - a mimeType
 */
const isHLS = (x: string): boolean => x === 'application/x-mpegURL'

/**
 * Quality picker controller for HLS multibitrate videos
 */
export class QualityPicker extends Component {
  static propTypes = {
    actions: PropTypes.object,
    player: PropTypes.object,
    video: PropTypes.object,
    levels: PropTypes.array,
    currentLevel: PropTypes.number,
  }

  constructor(props, context) {
    super(props, context)
    this.createResOptions = this.createResOptions.bind(this)
    this.state = {
      visible: false,
    }
  }
  /**
   * toggles menu visibility
   */
  toggleMenu() {
    this.setState({ visible: !this.state.visible })
  }

  /**
   * change current Resolution
   * @param  {event} ev button HTML event object
   */
  handleQualityChange(ev) {
    let { video } = this.props
    if (video) {
      video.loadLevel(parseInt(ev.target.dataset['id']))
    } else {
      console.error(`ev: this.video is null ${this.video}`)
    }
  }

  /**
   * create the single resolution items in the res list
   * @return {Array} returns an array of items.
   */
  createResOptions(levels, video) {
    levels = levels || this.props.levels
    let res = []
    let currentLevel = this.props.currentLevel || -1
    if (levels && levels.length >= 1 && levels[0].attrs) {
      for (let i = levels.length - 1; i >= 0; i--) {
        res.push(
          this.generateListItem(currentLevel, i, levels[i].attrs.RESOLUTION),
        )
      }
    }

    res.push(this.generateListItem(currentLevel, -1, 'auto'))
    return res
  }

  /**
   * generate a single item on the resolution menu
   * @param  {Number} currentLevel index of the current level
   * @param  {number} i            index of the level being generated
   * @param  {string} resolution   resolution string (1920x1080 or 1080p .. whatever)
   * @return {object}              HTML List element
   */
  generateListItem(currentLevel, i, resolution) {
    return (
      <li key={i}>
        <button
          className={currentLevel === i ? 'active' : ''}
          data-id={i}
          onClick={this.handleQualityChange.bind(this)}
        >
          {resolution}
        </button>
      </li>
    )
  }

  render() {
    const { levels, video } = this.props
    return (
      <div className={'video-react-control'}>
        <div
          className={'menu-container'}
          style={{
            display: !this.state.visible ? 'none' : 'block',
          }}
        >
          <ul>{this.createResOptions(levels, video)}</ul>
        </div>
        <button
          ref={c => {
            this.button = c
          }}
          className={
            'video-react-icon video-react-control video-react-button video-react-icon-settings'
          }
          tabIndex="0"
          onClick={this.toggleMenu.bind(this)}
        />
      </div>
    )
  }
}

/**
 * A VideoPlayer class that extends the functionality of `video-react`'s default player
 * Additional features include updated styles and HLS support
 */
export default class VideoPlayer extends Component {
  static propTypes = {
    // video-react props (https://video-react.js.org/components/player/)
    actions: PropTypes.object,
    player: PropTypes.object,
    children: PropTypes.any,
    startTime: PropTypes.number,
    loop: PropTypes.bool,
    muted: PropTypes.bool,
    autoPlay: PropTypes.bool,
    playsInline: PropTypes.bool,
    src: PropTypes.string,
    poster: PropTypes.string,
    className: PropTypes.string,
    preload: PropTypes.oneOf(['auto', 'metadata', 'none']),
    crossOrigin: PropTypes.string,
    onLoadStart: PropTypes.func,
    onWaiting: PropTypes.func,
    onCanPlay: PropTypes.func,
    onCanPlayThrough: PropTypes.func,
    onPlaying: PropTypes.func,
    onEnded: PropTypes.func,
    onSeeking: PropTypes.func,
    onSeeked: PropTypes.func,
    onPlay: PropTypes.func,
    onPause: PropTypes.func,
    onProgress: PropTypes.func,
    onDurationChange: PropTypes.func,
    onError: PropTypes.func,
    onSuspend: PropTypes.func,
    onAbort: PropTypes.func,
    onEmptied: PropTypes.func,
    onStalled: PropTypes.func,
    onLoadedMetadata: PropTypes.func,
    onLoadedData: PropTypes.func,
    onTimeUpdate: PropTypes.func,
    onRateChange: PropTypes.func,
    onVolumeChange: PropTypes.func,
    onResize: PropTypes.func,
    // custom props
    onLive: PropTypes.func,
    onDead: PropTypes.func,
  }
  static defaultProps = {
    preload: 'auto',
    onLive: () => {},
    onDead: () => {},
  }

  constructor(props) {
    super(props)

    this.state = {
      levels: [],
      currentLevel: -1,
    }

    // this.onLevels = this.onLevels.bind(this)
  }

  /**
   * get all available bitrates
   * @return {Array} array of res objects
   */
  getLevels() {
    if (this.source) {
      return this.source.getLevels()
    } else {
      return []
    }
  }

  /**
   * get Current level playing
   * @return {Number} returns level index
   */
  getCurrentLevel() {
    if (this.source) {
      let x = this.source.getCurrentLevel()
      return x
    } else {
      return -1
    }
  }

  /**
   * immediate change to a new resolution
   * @param  {Number} level index of the level
   */
  loadLevel(level) {
    if (this.source) {
      this.source.loadLevel(level)
      this.setState({ currentLevel: level })
    }
  }

  onLive(...args) {
    this.setState({
      levels: args[0].levels,
      currentLevel: this.getCurrentLevel(),
    })
    // pass it along to onLive (check @livepeer/player/src/Channel/index.js)
    this.props.onLive(...args)
  }

  render() {
    const {
      src,
      onLive,
      onDead,
      autoPlay,
      hlsOptions,
      videoOptions,
      ...props
    } = this.props
    return (
      <Player muted autoPlay={autoPlay} playsInline {...props}>
        <BigPlayButton position="center" />
        <ControlBar autoHide={false}>
          <QualityPicker
            order={7}
            video={this}
            levels={this.state.levels}
            currentLevel={this.state.currentLevel}
          />
        </ControlBar>
        <Source
          ref={instance => {
            this.source = instance
          }}
          isVideoChild
          onLive={this.onLive.bind(this)}
          onDead={onDead}
          autoPlay={autoPlay}
          src={src}
          type={getSourceType(src)}
          hlsOptions={{
            ...Source.defaultProps.hlsOptions,
            ...hlsOptions,
          }}
          videoOptions={{
            ...Source.defaultProps.videoOptions,
            ...videoOptions,
          }}
        />
      </Player>
    )
  }
}

/**
 * Custom <source> element for handling HLS live streams (.m3u8)
 */
export class Source extends Component {
  static propTypes = {
    /** Start video automatically (desktop-only) */
    autoPlay: PropTypes.bool,
    /** hls.js config options (https://github.com/video-dev/hls.js/blob/master/doc/API.md#fine-tuning) */
    hlsOptions: PropTypes.shape({
      autoStartLoad: PropTypes.bool,
      startPosition: PropTypes.number,
      capLevelToPlayerSize: PropTypes.bool,
      debug: PropTypes.bool,
      defaultAudioCodec: PropTypes.string,
      initialLiveManifestSize: PropTypes.number,
      maxBufferLength: PropTypes.number,
      maxMaxBufferLength: PropTypes.number,
      maxBufferSize: PropTypes.number,
      maxBufferHole: PropTypes.number,
      lowBufferWatchdogPeriod: PropTypes.number,
      highBufferWatchdogPeriod: PropTypes.number,
      nudgeOffset: PropTypes.number,
      nudgeMaxRetry: PropTypes.number,
      maxFragLookUpTolerance: PropTypes.number,
      liveSyncDurationCount: PropTypes.number,
      liveMaxLatencyDurationCount: PropTypes.number,
      enableWorker: PropTypes.bool,
      enableSoftwareAES: PropTypes.bool,
      manifestLoadingTimeOut: PropTypes.number,
      manifestLoadingMaxRetry: PropTypes.number,
      manifestLoadingRetryDelay: PropTypes.number,
      manifestLoadingMaxRetryTimeout: PropTypes.number,
      startLevel: PropTypes.number,
      levelLoadingTimeOut: PropTypes.number,
      levelLoadingMaxRetry: PropTypes.number,
      levelLoadingRetryDelay: PropTypes.number,
      levelLoadingMaxRetryTimeout: PropTypes.number,
      fragLoadingTimeOut: PropTypes.number,
      fragLoadingMaxRetry: PropTypes.number,
      fragLoadingRetryDelay: PropTypes.number,
      fragLoadingMaxRetryTimeout: PropTypes.number,
      startFragPrefetch: PropTypes.bool,
      appendErrorMaxRetry: 3,
      loader: PropTypes.func,
      fLoader: PropTypes.func,
      pLoader: PropTypes.func,
      xhrSetup: PropTypes.func,
      fetchSetup: PropTypes.func,
      abrController: PropTypes.object,
      timelineController: PropTypes.object,
      enableWebVTT: PropTypes.bool,
      enableCEA708Captions: PropTypes.bool,
      stretchShortVideoTrack: PropTypes.bool,
      maxAudioFramesDrift: PropTypes.number,
      forceKeyFrameOnDiscontinuity: PropTypes.bool,
      abrEwmaFastLive: PropTypes.number,
      abrEwmaSlowLive: PropTypes.number,
      abrEwmaFastVoD: PropTypes.number,
      abrEwmaSlowVoD: PropTypes.number,
      abrEwmaDefaultEstimate: PropTypes.number,
      abrBandWidthFactor: PropTypes.number,
      abrBandWidthUpFactor: PropTypes.number,
      minAutoBitrate: PropTypes.number,
    }),
    /** Native <video> element options */
    videoOptions: PropTypes.shape({
      /** Maximum number of times to retry requesting the same stream (Should probably be set very high for offline situations) */
      maxRetries: PropTypes.number,
      /** If stuck buffering, wait this many milliseconds before caling onDead() */
      waitingTimeout: PropTypes.number,
    }),
    /** Called when video is ready to start */
    onLive: PropTypes.func,
    /** Called when it is determiend the video is unable to play */
    onDead: PropTypes.func,
  }
  static defaultProps = {
    autoPlay: true,
    hlsOptions: {
      // custom playlist loader
      pLoader,
      // verbose logging of what's going on under-the-hood
      debug: true,
    },
    videoOptions: {
      maxRetries: 100,
      waitingTimeout: 20 * 1000, // 20s
    },
    onLive: () => {},
    onDead: () => {},
  }
  retries: number = 0
  maxRetries: number = this.props.videoOptions.maxRetries
  waitingTimeout: number = this.props.videoOptions.waitingTimeout
  /**
   * Logs things to the console if props.debug === true
   */
  debug = (...args): void => {
    if (this.props.hlsOptions.debug) console.info('[debug]', ...args)
  }
  /**
   * Updates the <source> element with the latest src and type attributes
   * Also reinitializes hls.js (if applicable) and any event listeners
   */
  updateSource = (): void => {
    const { hlsOptions, src, video } = this.props
    const canPlayHLS = video.canPlayType('application/vnd.apple.mpegurl')
    const useHLSJS = Hls.isSupported() && !canPlayHLS
    this.debug('updating src ->', src)
    if (!src) return
    if (useHLSJS) {
      // Handle m3u8 playback with hls.js
      if (this.hls) {
        // stop load and destroy old instance
        this.hls.stopLoad()
        this.hls.destroy()
      }
      // create new hls.js instance
      this.hls = new Hls(hlsOptions)
      this.hls.on(Hls.Events.MEDIA_ATTACHED, this.onMediaAttached)
      this.hls.on(Hls.Events.MANIFEST_PARSED, this.onManifestParsed)
      this.hls.on(Hls.Events.ERROR, this.onError)
      // console.info('modded chroma2')
      this.debug('attaching media')
      this.hls.attachMedia(video)
    } else if (canPlayHLS) {
      // Handle m3u8 playback natively
      video.removeEventListener('canplay', this.onVideoCanPlay)
      video.removeEventListener('waiting', this.onVideoWaiting)
      video.removeEventListener('error', this.onVideoError)
      video.addEventListener('canplay', this.onVideoCanPlay)
      video.addEventListener('waiting', this.onVideoWaiting)
      video.addEventListener('error', this.onVideoError)
      video.src = src
    }
  }

  /**
   * get HLS.js bitrate levels
   */
  getLevels = (): Array<Mixed> => {
    if (this.hls) {
      let levels = this.hls.levels
      return levels
    } else {
      return []
    }
  }

  /**
   * get currentl playing resolution index
   */
  getCurrentLevel = (): Number => {
    if (!this.hls) {
      return -1
    }
    return this.hls.currentLevel
  }

  /**
   * change resolution
   */
  loadLevel = (level: Number): void => {
    this.hls.currentLevel = level
  }

  /**
   * Event handler that is fired when native 'canplay' event is triggered on <video>
   * @note This handler is only bound when HLS is natively supported
   * @param {Event} e - event object
   */
  onVideoCanPlay = async (e: Event): Promise<void> => {
    this.debug('video can play!')
    const { onLive } = this.props
    this.retries = 0
    // no autoplay on mobile safari
    // if not muted, playback must be started by user-initiated event
    // https://webkit.org/blog/6784/new-video-policies-for-ios/
    // we can enable, if desired, but video would have to be muted during initial playback
    onLive()
  }
  /**
   * Event handler that is fired when native 'waiting' event is triggered on <video>
   * @note This handler is only bound when HLS is natively supported
   * @param {Event} e - event object
   */
  onVideoWaiting = (e: Event): void => {
    const { currentTime, buffered } = e.target
    if (!buffered.length) return // nothing was loaded
    const duration = buffered.end(0)
    const aMins = parseInt(currentTime / 60, 10)
    const aSecs = `${Math.round(currentTime % 60)}`.padStart(2, 0)
    const bMins = parseInt(duration / 60, 10)
    const bSecs = `${Math.round(duration % 60)}`.padStart(2, 0)
    this.debug('Playback waiting at', `${aMins}:${aSecs}/${bMins}:${bSecs}`)
    // Check if playback is still buffering after `waitingTimeout` ms
    setTimeout(() => {
      const { currentTime: c, buffered: b } = this.props.video
      // console.log(b.length)
      // console.log('currentTime:', currentTime, c)
      // console.log('duration:', duration, b.end(0))
      if (currentTime === c && duration === b.end(0)) {
        this.debug('Wait exceeded maximum duration; stream appears to be dead')
        this.props.onDead()
        this.retryUpdateSource()
      }
    }, this.waitingTimeout)
  }
  /**
   * Event handler that is fired when native 'error' event is triggered on <video>
   * @note This handler is only bound when HLS is natively supported
   * @param {Event} e - event object
   */
  onVideoError = async (e: Event): void => {
    const { onDead } = this.props
    const { error } = e.target
    const errorCodes = {
      1: 'MEDIA_ERR_ABORTED',
      2: 'MEDIA_ERR_NETWORK',
      3: 'MEDIA_ERR_DECODE',
      4: 'MEDIA_ERR_SRC_NOT_SUPPORTED',
      5: 'MEDIA_ERR_ENCRYPTED',
    }
    console.error(`MediaError code ${error.code}`, errorCodes[error.code])
    onDead(error)
    if (error.code === 4 && this.retries < 4)
      setImmediate(this.retryUpdateSource)
  }
  /**
   * Calls updateSource() and increments retries
   * Used for retry logic in environments with native HLS support
   */
  retryUpdateSource = (): void => {
    this.retries++
    this.debug(
      `Retry update src (${this.retries}/${this.maxRetries})`,
      this.props.src,
    )
    this.updateSource()
  }
  /**
   * Called when Hls.Events.MEDIA_ATTACHED is triggered
   * @param {string} e - event name
   * @param {Object} data - event data
   */
  onMediaAttached = (e: string, data: Object): void => {
    const { src } = this.props
    this.debug('loading src', src)
    this.hls.loadSource(src)
  }
  /**
   * Called when Hls.Events.MANIFEST_PARSED is triggered
   * @param {string} e - event name
   * @param {Object} data - event data
   */
  onManifestParsed = async (e: string, data): void => {
    const { autoPlay, onLive, video } = this.props
    this.debug(
      'manifest loaded, found levels\n',
      data.levels.map(x => x.url.toString()).join('\n'),
      data.levels,
    )
    // onLevels(data.levels)
    // this.getLevels()
    this.debug('will load level', this.hls.loadLevel)
    this.hls.startLoad()
    if (autoPlay) await video.play()
    onLive(data)
  }
  /**
   * Called when Hls.Events.ERROR is triggered
   * @param {string} e - event name
   * @param {Object} data - event data
   */
  onError = (e: string, data): void => {
    const { onDead } = this.props
    this.debug(e, data)
    if (!data.fatal) return
    switch (data.details) {
      case Hls.ErrorDetails.INTERNAL_EXCEPTION:
        this.updateSource()
        break
      default:
        this.hls.stopLoad()
        onDead(data)
        break
    }
  }
  /**
   * If props.src is set, calls updateSource()
   */
  componentDidMount(): void {
    this.debug('mounting', this.props)
    if (this.props.src) this.updateSource()
  }
  /**
   * Destroys hls.js or removes native <video> event listeners
   */
  componentWillUnmount(): void {
    if (this.hls) this.hls.destroy()
    else {
      video.removeEventListener('canplay', this.onVideoCanPlay)
      video.removeEventListener('waiting', this.onVideoWaiting)
      video.removeEventListener('error', this.onVideoError)
    }
  }
  /**
   * Checks if a new props.src has been set and updates source or stops playback
   * @param {Object} nextProps - the incoming props object
   */
  componentWillReceiveProps(nextProps: Object): void {
    if (nextProps.src === this.props.src) return
    this.retries = 0
    if (nextProps.src) {
      this.debug('received new source', nextProps.src)
      requestAnimationFrame(this.updateSource)
    } else if (this.hls) {
      this.hls.stopLoad()
    }
  }
  /**
   * Renders the <source> element
   */
  render(): ReactElement {
    const { src, type } = this.props
    return (
      <React.Fragment>
        <GlobalStyles />
        <source src={src} type={type} />
      </React.Fragment>
    )
  }
}
