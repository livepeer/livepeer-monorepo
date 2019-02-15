// @flow
export type WithdrawProps = {
  accountId: string,
  bondedAmount: string,
  delegateAddress: string,
  handleSubmit: any => void,
  history: object,
  loading: boolean,
  onCancel: any => void,
  pristine: boolean,
  valid: boolean,
}
