// @flow
export type BondFormProps = {
  bondedAmount: string,
  delegateAddress: string,
  handleSubmit: any => void,
  loading: boolean,
  maxEarningsClaimsRounds: string,
  onCancel: any => void,
  pristine: boolean,
  tokenBalance: string,
  valid: boolean,
  values: {
    amount: string,
    to: string,
  },
}
