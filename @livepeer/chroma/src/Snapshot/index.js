import React, { Component } from 'react'
import Hls from 'hls.js'

export default class Snapshot extends Component {
  static defaultProps = {
    as: 'img',
    at: 10, // Sometimes videos are blank for the first few secs
  }
  state = {
    src: '',
  }
  canvas = document.createElement('canvas')
  video = document.createElement('video')
  setThumbnailDataURL = () => {
    const { canvas, ctx, video } = this
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
    this.setState({
      src: canvas.toDataURL(),
    })
    this.video.removeEventListener('canplay', this.setThumbnailDataURL)
    this.hls.destroy
  }
  updateThumbnail = () => {
    const { canvas, video, props } = this
    const parent = document.createElement('div')
    parent.style.position = 'fixed'
    parent.style.bottom = 0
    parent.style.right = 0
    parent.style.transform = `translateX(99999vw)`
    document.body.appendChild(parent)
    parent.appendChild(canvas)
    parent.appendChild(video)
    this.hls = new Hls()
    this.ctx = canvas.getContext('2d')
    this.hls.loadSource(props.src)
    this.hls.attachMedia(video)
    video.currentTime = props.at
    this.video.addEventListener('canplay', this.setThumbnailDataURL)
  }
  componentDidMount() {
    this.updateThumbnail()
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.src === this.props.src) return
    this.updateThumbnail()
  }
  render() {
    const { as: El, at, ...props } = this.props
    const { src } = this.state
    return React.createElement(El, { ...props, src })
  }
}
