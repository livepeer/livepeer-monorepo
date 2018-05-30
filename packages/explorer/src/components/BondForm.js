import * as React from 'react'
import styled from 'styled-components'
import { Form } from 'react-final-form'
import { Field } from 'react-final-form-html5-validation'
import { Link } from 'react-router-dom'
import Confetti from 'react-dom-confetti'
import { withProp } from '../enhancers'
import { formatBalance, toBaseUnit } from '../utils'
import InlineAccount from './InlineAccount'
import InlineHint from './InlineHint'
import Button from './Button'

type BondFormProps = {
  bondedAmount: string,
  delegateAddress: string,
  handleSubmit: any => void,
  loading: boolean,
  onCancel: any => void,
  pristine: boolean,
  tokenBalance: string,
  valid: boolean,
  values: {
    amount: string,
    to: string,
  },
}

/**
 * Renders a form for approval and bonding.
 */
const BondForm: React.StatelessFunctionalComponent<BondFormProps> = ({
  bondedAmount,
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
  const max = formatBalance(tokenBalance, 18)
  console.log(submitSucceeded, valid, errors, props)
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
      <InlineHint flag="bond-modal" disableHide>
        <p>
          <strong>Note:</strong> You may only bond to a single delegate at a
          time, but you may switch between delegates without unbonding as often
          as you please.
        </p>
      </InlineHint>
      <p>You are about to bond to the following delegate</p>
      <InlineAccount border address={delegateAddress} />
      <p>Your Token Balance</p>
      <p style={{ fontWeight: 400 }}>{max} LPT</p>
      <p>Amount to Bond</p>
      <div>
        <Field
          name="amount"
          component="input"
          type="number"
          min="0"
          max={max}
          disabled={loading}
          rangeOverflow={`The maximum amount you may bond is ${max} LPT`}
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
        <p style={{ fontSize: 14, lineHeight: 1.5 }}>
          {bondedAmount !== '0' ? (
            <span>
              You already have a bonded amount of{' '}
              {formatBalance(bondedAmount, 18)} LPT. By entering an amount of 0
              LPT or leaving the input empty, you will transfer this bonded
              amount to the selected delegate. No approval transaction is
              required in this case. Otherwise, by clicking "Submit", MetaMask
              will prompt you twice — first for an approval transaction, and
              then for a bonding transaction. You must submit both in order to
              complete the bonding process.
            </span>
          ) : (
            <span>
              By clicking "Submit", MetaMask will prompt you twice — first for
              an approval transaction, and then for a bonding transaction. You
              must submit both in order to complete the bonding process.
            </span>
          )}
        </p>
      </div>
      <div style={{ textAlign: 'right', paddingTop: 24 }}>
        {onCancel && (
          <Button disabled={loading} onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          className="primary"
          disabled={loading || submitting || errors.amount}
          onClick={handleSubmit}
        >
          {submitting
            ? 'Submitting...'
            : (values.amount || '').replace(/0|\./g, '')
              ? 'Approve & Bond'
              : 'Bond'}
        </Button>
      </div>
    </React.Fragment>
  )
}

export default withProp('component', BondForm)(Form)
