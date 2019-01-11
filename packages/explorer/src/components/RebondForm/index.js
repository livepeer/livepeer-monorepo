import * as React from 'react'
import { Form } from 'react-final-form'
import Confetti from '../Confetti'
import { withProp } from '../../enhancers'
import Button from '../Button'
import InlineAccount from '../InlineAccount'
import type { RebondFormProps } from './props'

/**
 * Renders a form for token allowance approval
 */
const RebondForm: React.StatelessFunctionalComponent<RebondFormProps> = ({
  amount,
  delegateAddress,
  handleSubmit,
  loading,
  onCancel,
  submitting,
  submitSucceeded,
}) => {
  if (submitSucceeded) {
    return (
      <React.Fragment>
        <Confetti active={submitSucceeded} />
        <p>
          {`Sucess ${amount} LPT are now bonded back to ${delegateAddress}`}
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
      <p style={{ textAlign: 'center' }}>
        {`Rebond ${amount} LPT to the most recent transcoder`}
      </p>
      <InlineAccount address={delegateAddress || ''} truncate={40} />
      <p>
        Note: You can only bond to one transcoder at a time. To bond to a
        different transcoder, bond to this transcoder and then on the
        transcoders page, bond all LPT to a different transcoder
      </p>
      <Button
        disabled={loading || submitting}
        onClick={handleSubmit}
        className="primary"
      >
        {submitting ? 'Rebonding...' : 'Rebond'}
      </Button>
      <Button
        disabled={loading || submitting}
        onClick={onCancel}
        className="mod-btn"
      >
        Cancel
      </Button>
    </React.Fragment>
  )
}
export default withProp('component', RebondForm)(Form)
