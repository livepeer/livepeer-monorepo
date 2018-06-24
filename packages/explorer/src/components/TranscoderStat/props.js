// @flow
export type TranscoderStatProps = {|
  decimals?: number,
  label: string,
  symbol?: string,
  type?: 'percentage' | 'token',
  unit?: string,
  value: string | number,
  width: string,
|}
