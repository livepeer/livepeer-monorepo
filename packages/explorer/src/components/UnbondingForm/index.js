import * as React from 'react'
import { Form } from 'react-final-form'
import { Field } from 'react-final-form-html5-validation'
import { Link } from 'react-router-dom'
import Confetti from 'react-dom-confetti'
import { withProp } from '../../enhancers'
import { formatBalance } from '../../utils'
import Button from '../Button'
import type { BondFormProps } from './props'

/**
 * Renders a form for token bonding.
 */
const UnbondForm: React.StatelessFunctionalComponent<BondFormProps> = ({
  allowance,
  bondedAmount,
  delegateAddress,
  errors,
  handleSubmit,
  loading,
  onCancel,
  onUpdateAllowance,
  reset,
  submitting,
  submitError,
  submitFailed,
  submitSucceeded,
  values,
  view,
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
  const max = formatBalance(bondedAmount, 18)
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
    return (
      <React.Fragment>
        {confetti}
        <h3>Success: The Unbonding Process Has Begun</h3>
        <p>
          It will take 7 days (the unbonding period) in order to be able to
          withdraw your token.
        </p>
        <p>
          Go to Account &rarr; Delegating and scroll to "Pending LPT" to see
          pending requests.
        </p>
        <p>After 7 days, the "Withdraw" Button will be clickable</p>
        <div style={{ textAlign: 'right', paddingTop: 24 }}>
          {onCancel && (
            <Button disabled={loading} onClick={view}>
              View
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
          <strong>How to Unbond</strong>
        </p>
        <ul>
          <li>
            <strong>Unbonding Definition.</strong> Unbonding allows you to
            withdraw your token by releasing the token from the deposit with its
            Transcoder.
          </li>
          <li>
            <strong>Unbonding Period.</strong> Once you unbond, it takes 7 days
            (the unbonding period) in order to be able to withdraw your token.
          </li>
          <li>
            <strong>Amount.</strong> You may unbond ALL or PARTIAL amoiunt of
            your LPT. Enter the amount of LPT you wish to unbond in the box
            below.
          </li>
          <li>
            <strong>View Unbonding Transactions.</strong> View unbonding
            transactions on the Staking page. Go to Account &rarr; Staking and
            scroll to "Pending LPT."
          </li>
          <li>
            <strong>Multiple Unbonding Transactions.</strong> Each time you
            Unbond a partial amount of token, a transaction is created and must
            be withdrawn or rebonded separataely.
          </li>
          <li>
            <strong>Change your mind?</strong> If you have initiated the
            Unbonding process but wish to rebond your LPT, you do not need to
            wait for the period to end. Go to the Staking page on your account
            and click "Rebond".
          </li>
        </ul>
      </div>
      <hr />
      <p style={{ textAlign: 'center' }}>
        You have {formatBalance(bondedAmount, 18)} LPT bonded
      </p>
      <hr />
      {noBondedAmount && noAllowance ? null : (
        <React.Fragment>
          <div>
            <label
              style={{
                width: '15%',
              }}
            >
              <strong>Amount</strong>{' '}
            </label>
            <Field
              id="ubondTxt"
              name="amount"
              component="input"
              type="number"
              min="0"
              max={max}
              disabled={loading}
              rangeOverflow={`This amount is too large. Either your token balance is too low or you need to approve a higher transfer allowance.`}
              step="any"
              placeholder="Amount"
              style={{
                width: '70%',
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
          {noBondedAmount ? null : (
            <p style={{ fontSize: 14, lineHeight: 1.5 }}>
              <strong>Note:</strong> By entering 0 or leaving this field blank,
              you will unbond your existing bonded amount of{' '}
              {formatBalance(bondedAmount, 18)} LPT.
            </p>
          )}
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
            disabled={loading || submitting || errors.amount}
            onClick={handleSubmit}
          >
            {submitting ? 'Submitting...' : 'Unbond'}
          </Button>
        )}
      </div>
    </React.Fragment>
  )
}

export default withProp('component', UnbondForm)(Form)
