// @flow
export type WithdrawProps = {
  bondedAmount: string,
  delegateAddress: string,
  accountId: string,
  handleSubmit: any => void,
  loading: boolean,
  onCancel: any => void,
  pristine: boolean,
  valid: boolean,
  history: object,
}
