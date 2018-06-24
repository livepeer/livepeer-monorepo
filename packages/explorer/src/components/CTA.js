import { Component } from 'react'
import { createPortal } from 'react-dom'

export default class CTA extends Component {
  root = document.getElementById('cta-root')
  el = document.createElement('div')

  componentDidMount() {
    this.el.style.position = 'fixed'
    this.el.style.bottom = 0
    this.el.style.left = 0
    this.el.style.right = 0
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
