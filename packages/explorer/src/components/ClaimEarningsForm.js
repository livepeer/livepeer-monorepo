// @flow
import * as React from 'react'
import { Form, Field } from 'react-final-form'
import { withProp } from '../enhancers'
import { formatBalance, toBaseUnit, MathBN } from '../utils'
import InlineAccount from './InlineAccount'
import Button from './Button'

export type ClaimEarningsFormProps = {
  diff: string,
  from: string,
  handleSubmit: any => void,
  loading: boolean,
  max: string,
  min: string,
  onCancel: any => void,
  pristine: boolean,
  to: string,
  valid: boolean,
  values: {
    numRounds: string,
  },
}

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
  to,
  valid,
  values,
}) => (
  <React.Fragment>
    <p>
      You have {diff} rounds of earnings left to claim. You may claim earnings
      from up to {max} rounds at a time.
    </p>
    <p>Please select the number of rounds you'd like to claim:</p>
    <div style={{ display: 'flex' }}>
      <p style={{ display: 'inline-block', width: 32, textAlign: 'left' }}>
        {min}
      </p>
      <Field
        name="numRounds"
        component="input"
        disabled={loading}
        min={min}
        max={max}
        type="range"
        style={{
          width: '100%',
        }}
      />
      <p
        style={{
          display: 'inline-block',
          width: 32,
          textAlign: 'right',
        }}
      >
        {max}
      </p>
    </div>
    <p>
      You are about to claim {values.numRounds} round(s)&nbsp;
      <small>
        (#{from} - #{MathBN.add(values.numRounds, MathBN.sub(from, '1'))})
      </small>
    </p>
    <div style={{ textAlign: 'right', paddingTop: 24 }}>
      {onCancel && (
        <Button disabled={loading} onClick={onCancel}>
          Cancel
        </Button>
      )}
      <Button disabled={loading} onClick={handleSubmit}>
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </div>
  </React.Fragment>
)

export default withProp('component', ClaimEarningsForm)(Form)
