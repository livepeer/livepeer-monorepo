// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { MoreHorizontal as MoreHorizontalIcon } from 'react-feather'
import { formatBalance, formatPercentage } from '../utils'
import Avatar from './Avatar'
import Button from './Button'

type TranscoderCardProps = {|
  active: boolean,
  bonded: boolean,
  id: string,
  feeShare: string,
  lastRewardRound: string,
  onBond?: any => void,
  onUnbond?: any => void,
  pendingRewardCut: string,
  pendingFeeShare: string,
  pendingPricePerSegment: string,
  pricePerSegment: string,
  rewardCut: string,
  status: string,
  totalStake: string,
|}

/** Used when displaying Transcoder struct data in a list */
const TranscoderCard: React.ComponentType<TranscoderCardProps> = styled(
  ({
    active,
    bonded,
    className,
    id,
    status,
    onBond,
    onUnbond,
    feeShare,
    pricePerSegment,
    rewardCut,
    totalStake,
  }) => (
    <div className={className}>
      {/* Basic Info */}
      <div className="basic-info">
        <Link to={`/accounts/${id}/transcoding`}>
          <Avatar id={id} size={32} />
        </Link>
        <div className="address">
          <Link
            to={`/accounts/${id}/transcoding`}
            style={{ color: '#000', textDecoration: 'none' }}
          >
            {id.substr(0, 10)}...
          </Link>
        </div>
        <div className="status">{active ? 'active' : 'inactive'}</div>
      </div>
      {/* Stats */}
      <div className="stats">
        <TranscoderStat
          decimals={2}
          label="Reward Cut"
          type="percentage"
          value={rewardCut}
          width="64px"
        />
        <TranscoderStat
          decimals={2}
          label="Fee Share"
          type="percentage"
          value={feeShare}
          width="64px"
        />
        <TranscoderStat
          label="Price"
          symbol="WEI"
          type="token"
          unit="wei"
          value={pricePerSegment}
          width="80px"
        />
        <TranscoderStat
          decimals={2}
          label="Total Stake"
          symbol="LPT"
          type="token"
          unit="ether"
          value={totalStake}
          width="128px"
        />
      </div>
      {/* Actions */}
      {(onBond || onUnbond) && (
        <React.Fragment>
          <div className="actions-placeholder">
            <MoreHorizontalIcon size={32} color="rgba(0, 0, 0, .25)" />
          </div>
          <div className="actions-buttons">
            {onBond && <Button onClick={onBond}>Bond</Button>}
            {onUnbond && <Button onClick={onUnbond}>Unbond</Button>}
          </div>
        </React.Fragment>
      )}
    </div>
  ),
)`
  position: relative;
  display: inline-flex;
  align-items: center;
  flex-flow: row wrap;
  background: ${({ bonded }) => (bonded ? 'cornsilk' : 'white')};
  margin-bottom: 16px;
  border-radius: 2px;
  padding: 16px;
  overflow: auto;
  box-shadow: 0 1px 2px 0px rgba(0, 0, 0, 0.15);
  > a:hover {
    text-decoration: underline !important;
  }
  > .basic-info {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 240px;
    & > .address {
      display: inline-block;
      width: 128px;
      padding: 7px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 14px;
    }
    & > .status {
      padding: 7px;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 14px;
      color: ${({ active }) => (active ? 'darkseagreen' : 'orange')};
    }
  }
  > .stats {
    display: inline-block;
    min-width: 320px;
  }
  > .actions-placeholder {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 32px;
    margin: auto;
    display: block;
    height: 32px;
    pointer-events: none;
  }
  > .actions-buttons {
    display: inline-block;
    flex-grow: 1;
    text-align: right;
    background: inherit;
    opacity: 0;
    transition: all 0.2s linear;
    & > ${Button} {
      margin-left: 8px;
      &:first-child: {
        margin-left: 0;
      }
    }
  }
  :hover {
    & > .actions-buttons {
      opacity: 1;
    }
    & > .actions-placeholder {
      opacity: 0;
    }
  }
`

type TranscoderStatProps = {|
  decimals?: number,
  label: string,
  symbol?: string,
  type?: 'percentage' | 'token',
  unit?: string,
  value: string | number,
  width: string,
|}

/** Displays a numeric or string-based transcoder stat */
export const TranscoderStat: React.ComponentType<TranscoderStatProps> = styled(
  ({ className, label, type, value, width, ...props }) => {
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
    }
    return (
      <div className={className}>
        <div className="label">{label}</div>
        <div className="value">{formattedValue}</div>
      </div>
    )
  },
)`
  display: inline-block;
  margin: 0 16px;
  width: ${({ width }) => (width ? width : '100%')};
  > .label {
    margin-bottom: 4px;
    font-size: 11px;
  }
  > .value {
    font-size: 14px;
  }
`

export default TranscoderCard
