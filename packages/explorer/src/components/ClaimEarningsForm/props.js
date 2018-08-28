// @flow
export type ClaimEarningsFormProps = {
  diff: string,
  from: string,
  handleSubmit: any => void,
  loading: boolean,
  max: string,
  min: string,
  onCancel: any => void,
  pristine: boolean,
  reset: any => void,
  submitError: ?string,
  submitFailed: boolean,
  submitSucceeded: boolean,
  submitting: boolean,
  to: string,
  valid: boolean,
  values: {
    numRounds: string,
  },
}
