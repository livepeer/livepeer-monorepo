// @flow
export type UnbondFormProps = {
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
