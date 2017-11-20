import React, { Component } from 'react'
import Hls from 'hls.js'

export default class Snapshot extends Component {
  static defaultProps = {
    as: 'img',
    at: 0,
    defaultSrc: '',
    maxWidth: 100,
    maxHeight: 100,
    crop: true,
  }
  state = {
    src: '',
  }
  canvas = document.createElement('canvas')
  video = document.createElement('video')
  setThumbnailDataURL = () => {
    const { canvas, ctx, props, video } = this
    const { videoWidth, videoHeight } = video
    const { crop, maxWidth, maxHeight } = props
    const wScale = maxWidth / videoWidth
    const hScale = maxHeight / videoHeight
    const scale = Math[crop ? 'max' : 'min'](wScale, hScale)
    canvas.width = maxWidth
    canvas.height = maxHeight
    ctx.drawImage(
      video,
      0,
      0,
      videoWidth,
      videoHeight,
      (maxWidth - videoWidth * scale) / 2,
      (maxHeight - videoHeight * scale) / 2,
      videoWidth * scale,
      videoHeight * scale,
    )
    this.setState({ src: canvas.toDataURL() })
    this.video.removeEventListener('canplay', this.setThumbnailDataURL)
    this.hls.destroy()
  }
  updateThumbnail = () => {
    const { canvas, video, props } = this
    const parent = document.createElement('div')
    parent.appendChild(canvas)
    parent.appendChild(video)
    this.hls = new Hls()
    this.ctx = canvas.getContext('2d')
    this.hls.loadSource(props.url)
    this.hls.attachMedia(video)
    video.currentTime = props.at
    this.video.addEventListener('canplay', this.setThumbnailDataURL)
  }
  componentDidMount() {
    this.updateThumbnail()
  }
  componentWillUnmount() {
    this.video.removeEventListener('canplay', this.setThumbnailDataURL)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.url === this.props.url) return
    this.updateThumbnail()
  }
  render() {
    const {
      as,
      at,
      crop,
      defaultSrc,
      maxWidth,
      maxHeight,
      ...props
    } = this.props
    const { src } = this.state
    return React.createElement(as, { ...props, src: src || defaultSrc })
  }
}
