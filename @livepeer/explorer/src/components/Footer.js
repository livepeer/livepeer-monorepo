import { Component } from 'react'
import { createPortal } from 'react-dom'
export default class Footer extends Component {
  root = document.getElementById('footer-root')
  el = document.createElement('div')
  componentDidMount() {
    this.root.appendChild(this.el)
  }
  componentWillUnmount() {
    this.root.removeChild(this.el)
  }
  render() {
    const { props, el } = this
    return createPortal(props.children, el)
  }
}
