// @flow
export type TranscoderStatProps = {|
  decimals?: number,
  label: string,
  symbol?: string,
  type?: 'percentage' | 'token' | 'number',
  unit?: string,
  value: string | number,
  width: string,
  help: string,
  append?: Object,
|}
