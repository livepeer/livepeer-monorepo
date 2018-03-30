// @flow
import * as React from 'react'
import styled from 'styled-components'
import BasicModal from './BasicModal'
import Button from './Button'

export type ErrorModalProps = {|
  action: string,
  onClose: any => void,
  error?: Error,
  title: string,
|}

/**
 * Displays an error message in a modal
 */
const ErrorModal: React.ComponentType<ErrorModalProps> = ({
  title,
  action,
  error = new Error('An unknown error ocurred'),
  onClose,
}) => (
  <BasicModal title={title} onClose={onClose}>
    <p>
      Sorry, it looks like we encountered an error while attempting to {action}.
      Here are the details:
    </p>
    <ErrorSection>
      <code>{error.message}</code>
    </ErrorSection>
    <div style={{ textAlign: 'right', paddingTop: 24 }}>
      <Button onClick={onClose}>OK</Button>
    </div>
  </BasicModal>
)

const ErrorSection: React.ComponentType<any> = styled.pre`
  white-space: initial;
  overflow: auto;
  max-height: 300px;
`

export default ErrorModal
