// @flow
import type { ErrorModalProps } from './ErrorModal'
import * as React from 'react'
import { cond } from '../enhancers'
import ErrorModal from './ErrorModal'

export type BondErrorModalProps = ErrorModalProps

/** Error modal shown when approve() or bond() transaction fails */
const BondErrorModal: React.ComponentType<BondErrorModalProps> = ({
  action,
  onClose,
  error,
  title,
}) => (
  <ErrorModal title={title} action={action} error={error} onClose={onClose} />
)

export default cond(BondErrorModal)
