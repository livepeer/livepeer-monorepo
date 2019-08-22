import * as React from 'react'
import { Form } from 'react-final-form'
import { Field } from 'react-final-form-html5-validation'
import { Link } from 'react-router-dom'
import { X as XIcon } from 'react-feather'
import Confetti from '../Confetti'
import { withProp } from '../../enhancers'
import { formatBalance, toBaseUnit, MathBN } from '../../utils'
import InlineAccount from '../InlineAccount'
import InlineHint from '../InlineHint'
import Button, { EditButton } from '../Button'
import { H1 } from '../HTags'
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
  handleChange,
  loading,
  max,
  maxEarningsClaimsRounds,
  me,
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
  const { delegator } = me.data
  const noAllowance = allowance === '0'
  const noBondedAmount = bondedAmount === '0'
  const cannotBond =
    (noAllowance && noBondedAmount) ||
    (values.amount && MathBN.gt(toBaseUnit(values.amount), allowance))
  const noZero = delegator.delegateAddress === delegateAddress
  if (submitFailed && submitError && !/User denied/.test(submitError)) {
    return (
      <React.Fragment>
        <H1>Failed</H1>
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
        <Confetti active={submitSucceeded} />
        <H1 style={{ marginTop: 0 }}>Success!</H1>
        <p>
          Congratulations! You successfully bonded your tokens to{' '}
          {delegateAddress}. <br /> <br />
          👉
          <Link to={`/accounts/${delegator.id}/delegating#/staking-alerts`}>
            Sign up
          </Link>{' '}
          to receive email alerts with your earnings and keep tabs on how your
          transcoder is performing.
        </p>
        <div
          style={{
            cursor: 'pointer',
            position: 'absolute',
            right: 16,
            top: 16,
          }}
        >
          {onCancel && (
            <XIcon disabled={loading} onClick={onCancel} size={24} />
          )}
        </div>
      </React.Fragment>
    )
  }
  return (
    <React.Fragment>
      <H1>Bond Your Token</H1>
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
            <EditButton onClick={onUpdateAllowance} style={{ marginTop: 0 }}>
              Edit
            </EditButton>
          </p>
        </div>
      </div>
      {noBondedAmount && noAllowance ? null : (
        <React.Fragment>
          <p style={{ marginTop: 0 }}>Amount to Bond</p>
          {noBondedAmount ? null : (
            <p style={{ fontSize: 14, lineHeight: 1.5 }}>
              <strong>Note:</strong>
              {noZero
                ? ` You cannot bond 0 LPT to a delegate you are already bonded to.`
                : ` By entering 0 or leaving this field blank,
                  you will transfer your existing bonded amount of
                  ${formatBalance(
                    bondedAmount,
                    18,
                  )} LPT the selected delegate.`}
            </p>
          )}
          <div>
            <Field
              component="input"
              disabled={loading}
              max={max}
              maxLength={20}
              min={noZero ? Math.pow(10, -18).toString() : '0'}
              minLength={1}
              name="amount"
              rangeOverflow={`This amount is too large. Either your token balance is too low or you need to approve a higher transfer allowance.`}
              step="any"
              type="number"
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
