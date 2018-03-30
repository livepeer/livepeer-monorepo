import { Component } from 'react'
import { createPortal } from 'react-dom'

export default class Modal extends Component {
  root = document.getElementById('modal-root')
  el = document.createElement('div')
  componentDidMount() {
    document.body.style.overflow = 'hidden'
    this.root.appendChild(this.el)
  }
  componentWillUnmount() {
    document.body.style.overflow = 'unset'
    this.root.removeChild(this.el)
  }
  render() {
    const { props, el } = this
    return createPortal(props.children, el)
  }
}
