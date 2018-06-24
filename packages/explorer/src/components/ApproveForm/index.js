import * as React from 'react'
import { Form } from 'react-final-form'
import { Field } from 'react-final-form-html5-validation'
import { Link } from 'react-router-dom'
import Confetti from 'react-dom-confetti'
import { withProp } from '../../enhancers'
import { formatBalance } from '../../utils'
import Button from '../Button'
import type { ApproveFormProps } from './props'

/**
 * Renders a form for token allowance approval
 */
const ApproveForm: React.StatelessFunctionalComponent<ApproveFormProps> = ({
  allowance,
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
  let children = null
  if (submitFailed && submitError && !/User denied/.test(submitError)) {
    /**
     * Fail state
     */
    children = (
      <React.Fragment>
        <p>
          There was an error submitting your transaction. See error message
          below for more details:
        </p>
        <pre>
          <textarea disabled readOnly style={{ height: 320, width: '100%' }}>
            {submitError}
          </textarea>
        </pre>
        <p>
          You can also{' '}
          <Link to="/me/overview">view your recent protocol activity</Link> on
          your account overview page.
        </p>
        <div style={{ textAlign: 'right', paddingTop: 24 }}>
          {onCancel && (
            <Button disabled={loading} onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button onClick={reset}>Try Again</Button>
        </div>
      </React.Fragment>
    )
  } else if (submitSucceeded) {
    /**
     * Success state
     */
    children = (
      <React.Fragment>
        <p>
          Congratulations! You successfully updated your allowance to{' '}
          {formatBalance(allowance)} LPT.
        </p>
        <div style={{ textAlign: 'right', paddingTop: 24 }}>
          {onCancel && (
            <Button disabled={loading} onClick={onCancel}>
              Done
            </Button>
          )}
        </div>
      </React.Fragment>
    )
  } else {
    /**
     * Editing / Submitting state
     */
    children = (
      <React.Fragment>
        <p>
          <strong>
            Transfer allowance is the amount of tokens you have approved for
            bonding.
          </strong>{' '}
          It is a security feature built in to all ERC20 tokens.
        </p>
        <p>
          <strong>Transfer Allowance Tips:</strong>
        </p>
        <ul>
          <li>
            You do not lose or gain any token by setting an allowance. You will
            maintain your current token balance.
          </li>
          <li>
            Each time you bond, your allowance is decreased by the amount
            bonded.
          </li>
          <li>Your allowance may be larger than your current token balance.</li>
          <li>
            If you set your allowance high enough, you may bond multiple times
            without increasing your transfer allowance, thus minimizing future
            transaction costs.
          </li>
        </ul>
        <hr />
        <p>Current Transfer Allowance</p>
        <p style={{ fontWeight: 400 }}>{formatBalance(allowance, 18)} LPT</p>
        <p>Updated Transfer Allowance</p>
        <div>
          <Field
            name="amount"
            component="input"
            type="number"
            min="0"
            disabled={loading}
            step="any"
            style={{
              width: '90%',
              height: 48,
              padding: 8,
              fontSize: 16,
            }}
          />{' '}
          LPT
          {errors.allowance && (
            <p style={{ fontSize: 12, fontWeight: 400, color: 'red' }}>
              {errors.allowance}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'right', paddingTop: 24 }}>
          {onCancel && (
            <Button disabled={loading} onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            className="primary"
            disabled={loading || submitting || errors.amount || !values.amount}
            onClick={handleSubmit}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </React.Fragment>
    )
  }
  // Add that confetti! 🎊
  return (
    <React.Fragment>
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
      {children}
    </React.Fragment>
  )
}

export default withProp('component', ApproveForm)(Form)
