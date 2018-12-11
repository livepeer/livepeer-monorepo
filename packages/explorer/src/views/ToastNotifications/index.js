// @flow
import * as React from 'react'
import { lifecycle } from 'recompose'
import styled from 'styled-components'
import { Transition, TransitionGroup } from 'react-transition-group'
// import { Toast } from '../../components'
import { connectToasts } from '../../enhancers'
import { notify } from '../../utils'
// import enhance from './enhance'

export type ToastNotificiationsViewProps = {
  toasts: any,
}

const ToastNotificiationsView: React.ComponentType<ToastNotificiationsViewProps> = ({
  toasts,
  ...props
}) => {
  return (
    <ToastNotificationsSection>
      {[...toasts].map(props => (
        <Transition
          key={props.id}
          in
          appear={true}
          timeout={{ enter: 0, exit: 300 }}
        >
          {state => <ToastNotification {...props} className={state} />}
        </Transition>
      ))}
    </ToastNotificationsSection>
  )
}

const ToastNotificationsSection = styled(TransitionGroup)`
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 1;
`

const nativeNotify = lifecycle({
  componentDidMount() {
    const { type, title, body } = this.props
    console.log('notify', this.props)
    if (
      (type !== 'error' && type !== 'success') ||
      typeof title !== 'string' ||
      typeof body !== 'string'
    )
      return
    notify(title, { body })
  },
})

const ToastNotification = nativeNotify(styled(
  ({ body, className, title, type }) => {
    return (
      <div className={className}>
        <h3 className="title">{title}</h3>
        <div className="body">{body}</div>
      </div>
    )
  },
)`
  background: #fff;
  padding: 16px;
  margin-bottom: 16px;
  margin-right: 16px;
  width: 304px;
  box-shadow: 0 1px 2px 0px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  border-left: 5px solid
    ${({ type }) => {
      switch (type) {
        case 'warn':
          return 'orange'
        case 'error':
          return 'red'
        case 'success':
          return 'darkseagreen'
        case 'info':
          return 'cornflowerblue'
        default:
          return '#aaa'
      }
    }};
  transition: all 0.3s linear;
  &.entering,
  &.exiting,
  &.exited {
    opacity: 0;
    transform: translateX(320px);
  }
  &.entered {
    opacity: 1;
    transform: translateX(0);
  }
  > .title {
    margin: 0;
    font-weight: 400;
  }
  > .body {
    max-height: 240px;
    overflow: auto;
  }
`)

export default connectToasts(ToastNotificiationsView)
