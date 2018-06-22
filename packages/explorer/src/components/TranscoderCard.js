// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { MoreHorizontal as MoreHorizontalIcon } from 'react-feather'
import { formatBalance, formatPercentage, MathBN } from '../utils'
import Avatar from './Avatar'
import Button from './Button'
import Tooltip from './Tooltip'

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
    bondedAmount,
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
          <Tooltip id={id} text={id} type="nowrap">
            <Link
              to={`/accounts/${id}/transcoding`}
              style={{ color: '#000', textDecoration: 'none' }}
            >
              {id.substr(0, 10)}...
            </Link>
          </Tooltip>
        </div>
        <Tooltip text="Today, only Transcoders with the top 10 most stake will be able to do work in the next round.">
          <div className="status">{active ? 'active' : 'inactive'}</div>
        </Tooltip>
      </div>
      {/* Stats */}
      <div className="stats">
        <TranscoderStat
          decimals={2}
          label="Reward Cut"
          type="percentage"
          value={rewardCut}
          width="64px"
          help="The percent of the newly minted token that the Transcoder will KEEP from the round’s inflation distribution. The remainder gets distributed across all bonded nodes by how much you bond relative to others."
        />
        <TranscoderStat
          decimals={2}
          label="Fee Share"
          type="percentage"
          value={feeShare}
          width="64px"
          help="How much the you as the delegator receive of the Price/segment. For example if Fee Share is 25%, If a transcoder were to charge 100WEI in fees per segment, they would pay 25WEI to the bonded nodes."
        />
        <TranscoderStat
          label="Price"
          symbol="GWEI"
          type="token"
          unit="gwei"
          decimals={9}
          value={pricePerSegment}
          width="128px"
          help="The amount the Transcoder will charge broadcasters per segment. Wei is the base unit of ethereum, which is 10^18 Wei = 1 ETH. The price illustrated is based on a segment of video, which is 4 seconds"
        />
        <TranscoderStat
          decimals={2}
          label="Total Stake"
          symbol="LPT"
          type="token"
          unit="ether"
          value={totalStake}
          width="128px"
          help="Total amount of LPT staked towards this node, including the transcoders own stake."
        />
        {bonded &&
          bondedAmount && (
            <TranscoderStat
              decimals={2}
              label="Your Stake"
              symbol="LPT"
              type="token"
              unit="ether"
              value={bondedAmount}
              append={
                <span style={{ fontSize: 10 }}>{`(${MathBN.toBig(
                  MathBN.div(bondedAmount + '00', totalStake),
                ).toFixed(2)}%)`}</span>
              }
              width="128px"
              help="Amount of LPT you have staked towards this node."
            />
          )}
      </div>
      {/* Actions */}
      {(onBond || onUnbond) && (
        <React.Fragment>
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
  background: #fff;
  margin-bottom: 16px;
  border-radius: 2px;
  padding: 16px;
  overflow: auto;
  box-shadow: ${({ bonded }) =>
    bonded
      ? '0px 0px 0px 2px var(--primary)'
      : '0px 1px 2px 0px rgba(0, 0, 0, 0.15)'};
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
    display: flex;
    align-items: flex-start;
    min-width: 320px;
  }
  > .actions-buttons {
    display: inline-block;
    flex-grow: 1;
    text-align: right;
    background: inherit;
    transition: all 0.2s linear;
    & > ${Button} {
      margin: 0;
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
  @media (max-width: 640px) {
    padding: 0;
    > .basic-info {
      width: 100%;
      padding: 16px;
      > .address {
        font-size: 16px;
      }
      > .status {
        float: right;
        font-size: 16px;
      }
    }
    > .stats {
      width: 100%;
      overflow: auto;
      white-space: nowrap;
      padding: 16px 0;
      box-shadow: 0 0 0 1px #eee;
      .label,
      .value {
        font-size: 14px;
      }
    }
    > .actions-placeholder {
      opacity: 0 !important;
    }
    > .actions-buttons {
      margin-top: 1px;
      padding: 16px;
      opacity: 1;
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

export default TranscoderCard
