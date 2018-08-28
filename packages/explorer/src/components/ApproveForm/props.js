// @flow
export type ApproveFormProps = {
  allowance: string,
  errors: {},
  handleSubmit: any => void,
  loading: boolean,
  onCancel: any => void,
  pristine: boolean,
  reset: any => void,
  submitting: boolean,
  submitError: ?string,
  submitFailed: boolean,
  submitSucceeded: boolean,
  valid: boolean,
  values: {
    amount: string,
  },
}
