// @flow
export type WithdrawProps = {
  bondedAmount: string,
  delegateAddress: string,
  handleSubmit: any => void,
  loading: boolean,
  onCancel: any => void,
  pristine: boolean,
  tokenBalance: string,
  valid: boolean,
  history: object,
  values: {
    amount: string,
    to: string,
  },
}
