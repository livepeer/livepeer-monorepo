// @flow
import * as React from 'react'
import { Form, Field } from 'react-final-form'
import { Link } from 'react-router-dom'
import Confetti from 'react-dom-confetti'
import { withProp } from '../../enhancers'
import { MathBN } from '../../utils'
import InlineHint from '../InlineHint'
import Button from '../Button'
import type { ClaimEarningsFormProps } from './props'

/**
 * Renders a form for claiming earnings
 */
const ClaimEarningsForm: React.ComponentType<ClaimEarningsFormProps> = ({
  diff,
  from,
  handleSubmit,
  loading,
  min,
  max,
  onCancel,
  pristine,
  reset,
  submitting,
  submitError,
  submitFailed,
  submitSucceeded,
  to,
  valid,
  values,
  ...props
}) => {
  const lastClaimRound = MathBN.sub(from, '1')
  const currentRound = MathBN.add(lastClaimRound, max)
  const endRound = MathBN.add(values.numRounds, lastClaimRound)
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
  // console.log(props)
  if (submitFailed && submitError && !/User denied/.test(submitError)) {
    // console.log('rendering claimEarnings fail')
    return (
      <React.Fragment>
        {confetti}
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
  }
  if (submitSucceeded) {
    // console.log('rendering claimEarnings success')
    return (
      <React.Fragment>
        {confetti}
        <p>
          Congratulations! You successfully claimed your earnings through round
          #{lastClaimRound}. You now have {diff} rounds of earnings left to
          claim.
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
  }
  return (
    <React.Fragment>
      {confetti}
      {max === '20' && (
        <InlineHint flag="claim-earnings-max" disableHide>
          <p>
            <strong>Note:</strong> You may claim up to 20 rounds at a time.
          </p>
        </InlineHint>
      )}
      <p>
        You have {diff} rounds of earnings left to claim. Please select the
        range of rounds you would like to claim:
      </p>
      <div style={{ border: '1px solid #eee', padding: '0 16px 16px 16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ display: 'inline-block', textAlign: 'left' }}>#{from}</p>
          <p>. . .</p>
          <p
            style={{
              display: 'inline-block',
              textAlign: 'right',
            }}
          >
            #{currentRound}
          </p>
        </div>
        <div>
          <Field
            name="numRounds"
            component="input"
            type="range"
            disabled={loading || submitting}
            min={min}
            max={max}
            style={{
              width: '100%',
            }}
          />
        </div>
      </div>
      <p>
        You are about to claim {values.numRounds} round(s)&nbsp;
        <small>
          (#{from} - #{endRound})
        </small>
      </p>
      <div style={{ textAlign: 'right', paddingTop: 24 }}>
        {onCancel && <Button onClick={onCancel}>Cancel</Button>}
        <Button
          className="primary"
          disabled={loading || submitting}
          onClick={handleSubmit}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </React.Fragment>
  )
}
export default withProp('component', ClaimEarningsForm)(Form)
