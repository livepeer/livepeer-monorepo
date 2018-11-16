// @flow
import * as React from 'react'
import styled from 'styled-components'
import Tooltip from '../Tooltip'
import { formatBalance, formatPercentage } from '../../utils'
import type { TranscoderStatProps } from './props'

/** Displays a numeric or string-based transcoder stat */
const TranscoderStat: React.ComponentType<TranscoderStatProps> = styled(
  ({ append, className, help, label, type, value, width, ...props }) => {
    let formattedValue = value
    switch (type) {
      case 'percentage': {
        const { decimals = 2 } = props
        formattedValue = formatPercentage(value, decimals) + '%'
        break
      }
      case 'token': {
        const { decimals = 0, symbol = 'WEI', unit = 'wei' } = props
        formattedValue = formatBalance(value, decimals, unit) + ` ${symbol}`
        break
      }
      case 'number': {
        formattedValue = value
        break
      }
      default:
        formattedValue = 'NA'
        break
    }
    return (
      <div className={className}>
        <Tooltip text={help}>
          <div className="label">{label}</div>
        </Tooltip>
        <div className="value">
          {formattedValue} {append}
        </div>
      </div>
    )
  },
)`
  display: inline-block;
  margin: 0 16px;
  width: ${({ width }) => (width ? width : '100%')};
  .value {
    font-size: 14px;
  }
  .label {
    margin-bottom: 4px;
    font-size: 11px;
    cursor: help;
    border-bottom: 1px dashed #ccc;
  }
`

export default TranscoderStat
