// @flow
import { Container } from 'unstated'

export class ToastNotification {
  body: string
  icon: string
  id: string
  onClose: any => void
  onHide: any => void
  title: string
  type: 'info' | 'success' | 'warn' | 'error'
  type = this.type || 'none'
  constructor(props: Object) {
    for (const key in props) {
      // @flow-ignore
      this[key] = props[key]
    }
    if (!this.id) this.id = `${Date.now()}`
  }
}

export type ToastNotificationState = {
  [id: string]: ToastNotification,
}

export class ToastNotificationContainer extends Container<
  ToastNotificationState,
> {
  state = {}
  push = (props: Object, timeout: number = 8000) => {
    const toast = new ToastNotification(props)
    const timerKey = `${toast.id}:timer`
    if (this[timerKey]) {
      clearTimeout(this[timerKey])
    }
    this.setState({
      [toast.id]: toast,
    })
    this[timerKey] = setTimeout(() => {
      this.delete(toast.id)
      clearTimeout(this[timerKey])
    }, Math.max(1000, timeout))
  }
  delete = (id: string) => {
    delete this.state[id]
    this.setState(this.state)
  };
  // @flow-ignore
  *[Symbol.iterator]() {
    const { state } = this
    for (const key in state) {
      yield state[key]
    }
  }
}
