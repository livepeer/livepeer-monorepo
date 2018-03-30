// @flow
import type { ErrorModalProps } from './ErrorModal'
import * as React from 'react'
import { cond } from '../enhancers'
import ErrorModal from './ErrorModal'

export type UnbondErrorModalProps = ErrorModalProps

/**
 * Error modal shown when the claimEarnings() transaction fails
 */
const UnbondErrorModal: React.ComponentType<
  UnbondErrorModalProps,
> = ({ action, onClose, error, title }) => (
  <ErrorModal title={title} action={action} error={error} onClose={onClose} />
)

export default cond(UnbondErrorModal)
