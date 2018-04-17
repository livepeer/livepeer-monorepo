import * as React from 'react'
import styled from 'styled-components'
import { Form, Field } from 'react-final-form'
import { withProp } from '../enhancers'
import { formatBalance, toBaseUnit } from '../utils'
import InlineAccount from './InlineAccount'
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
  handleSubmit,
  loading,
  onCancel,
  pristine,
  tokenBalance,
  valid,
  values,
}) => (
  <React.Fragment>
    <p>Transcoder Address</p>
    <InlineAccount address={delegateAddress} />
    <p>Amount to Bond</p>
    <div>
      {bondedAmount !== '0' && (
        <p style={{ fontSize: 12 }}>
          You already have a bonded amount of {formatBalance(bondedAmount, 18)}{' '}
          LPT. By entering 0 in the input below, you will transfer your bonded
          amount to the selected transcoder. No approval transaction is required
          in this case.
        </p>
      )}
      <p style={{ fontSize: 12 }}>
        The maximum amount you may bond is&nbsp;
        <span style={{ fontWeight: 400 }}>
          {formatBalance(tokenBalance, 18)} LPT.
        </span>
      </p>
      <Field
        name="amount"
        component="input"
        disabled={loading}
        type="text"
        style={{
          width: '90%',
          height: 48,
          padding: 8,
          fontSize: 16,
        }}
      />{' '}
      LPT
      <p style={{ fontSize: 14, lineHeight: 1.5 }}>
        <strong style={{ fontWeight: 'normal' }}>Note</strong>: By clicking
        "Submit", MetaMask will prompt you twice — first for an approval
        transaction, and then for a bonding transaction. You must submit both in
        order to complete the bonding process.
      </p>
    </div>
    <div style={{ textAlign: 'right', paddingTop: 24 }}>
      {onCancel && (
        <Button disabled={loading} onClick={onCancel}>
          Cancel
        </Button>
      )}
      <Button className="primary" disabled={loading} onClick={handleSubmit}>
        {loading ? 'Submitting...' : 'Submit'}
      </Button>
    </div>
  </React.Fragment>
)

export default withProp('component', BondForm)(Form)
