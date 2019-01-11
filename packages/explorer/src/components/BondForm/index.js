import * as React from 'react'
import { Form } from 'react-final-form'
import { Field } from 'react-final-form-html5-validation'
import { Link } from 'react-router-dom'
import Confetti from 'react-dom-confetti'
import { withProp } from '../../enhancers'
import { formatBalance, toBaseUnit, MathBN } from '../../utils'
import InlineAccount from '../InlineAccount'
import InlineHint from '../InlineHint'
import Button from '../Button'
import type { BondFormProps } from './props'

/**
 * Renders a form for token bonding.
 */
const BondForm: React.StatelessFunctionalComponent<BondFormProps> = ({
  allowance,
  bondedAmount,
  delegateAddress,
  errors,
  handleSubmit,
  loading,
  max,
  maxEarningsClaimsRounds,
  onCancel,
  onUpdateAllowance,
  reset,
  submitting,
  submitError,
  submitFailed,
  submitSucceeded,
  tokenBalance,
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
  const noAllowance = allowance === '0'
  const noBondedAmount = bondedAmount === '0'
  const cannotBond =
    (noAllowance && noBondedAmount) ||
    (values.amount && MathBN.gt(toBaseUnit(values.amount), allowance))
  if (submitFailed && submitError && !/User denied/.test(submitError)) {
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
    // console.log('rendering bond success')
    return (
      <React.Fragment>
        {confetti}
        <p>
          Congratulations! You successfully bonded your tokens to{' '}
          {delegateAddress}. You may{' '}
          <Link to="/me/delegating">view your delegating dashboard</Link> to see
          more information.
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
      <div>
        <p>
          <strong>Bonding Tips:</strong>
        </p>
        <ul>
          <li>You may only bond to one delegate.</li>
          <li>You may switch delegates any time.</li>
          <li>You do not need to unbond to switch delegates.</li>
          <li>
            You will automatically claim up to {maxEarningsClaimsRounds} rounds
            of unclaimed earnings when bonding.
          </li>
        </ul>
      </div>
      <hr />
      {!(noBondedAmount && noAllowance) ? null : (
        <InlineHint disableHide>
          <p>
            <strong>One last thing:</strong> In order to bond, first, you will
            need to approve a non-zero amount of tokens for transfer:
            <br />
            <br />
            <Button onClick={onUpdateAllowance} style={{ fontWeight: 400 }}>
              Update your transfer allowance
            </Button>
          </p>
        </InlineHint>
      )}
      <p>Delegate</p>
      <InlineAccount border address={delegateAddress} />
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <p>Your Token Balance</p>
          <p style={{ fontWeight: 400, marginBottom: 0 }}>
            {formatBalance(tokenBalance)} LPT
          </p>
        </div>
        <div style={{ width: '50%' }}>
          <p>Your Transfer Allowance</p>
          <p style={{ fontWeight: 400, marginBottom: 0 }}>
            {formatBalance(allowance)} LPT&nbsp;
            <Button onClick={onUpdateAllowance} style={{ marginTop: 0 }}>
              Edit
            </Button>
          </p>
        </div>
      </div>
      {noBondedAmount && noAllowance ? null : (
        <React.Fragment>
          <p style={{ marginTop: 0 }}>Amount to Bond</p>
          {noBondedAmount ? null : (
            <p style={{ fontSize: 14, lineHeight: 1.5 }}>
              <strong>Note:</strong> By entering 0 or leaving this field blank,
              you will transfer your existing bonded amount of{' '}
              {formatBalance(bondedAmount, 18)} LPT the selected delegate.
            </p>
          )}
          <div>
            <Field
              name="amount"
              component="input"
              type="number"
              min="0"
              max={max}
              disabled={loading}
              rangeOverflow={`This amount is too large. Either your token balance is too low or you need to approve a higher transfer allowance.`}
              step="any"
              style={{
                width: '90%',
                height: 48,
                padding: 8,
                fontSize: 16,
              }}
            />{' '}
            LPT
            {errors.amount && (
              <p style={{ fontSize: 12, fontWeight: 400, color: 'red' }}>
                {errors.amount}
              </p>
            )}
          </div>
        </React.Fragment>
      )}
      <div style={{ textAlign: 'right', paddingTop: 24 }}>
        {onCancel && (
          <Button disabled={loading} onClick={onCancel}>
            Cancel
          </Button>
        )}
        {noBondedAmount && noAllowance ? null : (
          <Button
            className="primary"
            disabled={loading || submitting || errors.amount || cannotBond}
            onClick={handleSubmit}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        )}
      </div>
    </React.Fragment>
  )
}

export default withProp('component', BondForm)(Form)
