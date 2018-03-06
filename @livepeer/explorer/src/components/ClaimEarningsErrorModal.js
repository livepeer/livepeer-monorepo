// @flow
import type { ErrorModalProps } from './ErrorModal'
import * as React from 'react'
import { cond } from '../enhancers'
import ErrorModal from './ErrorModal'

export type ClaimEarningsErrorModalProps = ErrorModalProps

/**
 * Error modal shown when the claimEarnings() transaction fails
 */
const ClaimEarningsErrorModal: React.ComponentType<
  ClaimEarningsErrorModalProps,
> = ({ action, onClose, error, title }) => (
  <ErrorModal title={title} action={action} error={error} onClose={onClose} />
)

export default cond(ClaimEarningsErrorModal)
