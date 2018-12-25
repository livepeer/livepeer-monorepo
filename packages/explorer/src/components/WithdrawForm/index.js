import * as React from 'react'
import { Form } from 'react-final-form'
import Confetti from 'react-dom-confetti'
import { withProp } from '../../enhancers'
import { formatBalance } from '../../utils'
import Button from '../Button'
import type { WithdrawProps } from './props'

const Withdraw: React.StatelessFunctionalComponent<WithdrawProps> = ({
  amount,
  history,
  accountId,
  delegateAddress,
  errors,
  handleSubmit,
  loading,
  onCancel,
  pristine,
  reset,
  submitting,
  submitError,
  submitFailed,
  submitSucceeded,
  valid,
  values,
  ...props
}) => {
  const confetti = (
    <Confetti
      active={submitSucceeded}
      config={{
        angle: 90,
        spread: 197,
        startVelocity: 45,
        elementCount: 50,
        decay: 0.9,
      }}
    />
  )
  if (submitSucceeded) {
    return (
      <React.Fragment>
        {confetti}
        <p>{`Sucessfully withdrawn ${formatBalance(amount)} LPT`}</p>
        <div style={{ textAlign: 'right', paddingTop: 24 }}>
          {onCancel && (
            <Button
              className="primary"
              disabled={loading}
              onClick={e => history.push(`/accounts/${accountId}/overview`)}
            >
              View
            </Button>
          )}
        </div>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <h1 style={{ textAlign: 'center' }}>{formatBalance(amount || 0)} LPT</h1>
      <div style={{ textAlign: 'center' }}>
        <Button
          disabled={loading || submitting}
          onClick={onCancel}
          className="mod-btn"
        >
          Cancel
        </Button>
        <Button
          disabled={loading || submitting}
          onClick={handleSubmit}
          className="primary"
        >
          {submitting ? 'Withdraw...' : 'Withdraw'}
        </Button>
      </div>
    </React.Fragment>
  )
}

export default withProp('component', Withdraw)(Form)
