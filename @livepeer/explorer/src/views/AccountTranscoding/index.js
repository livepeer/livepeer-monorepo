import React, { ReactElement } from 'react'
import { matchPath } from 'react-router'
import { compose, withHandlers } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { queries } from '@livepeer/graphql-sdk'
import styled, { keyframes } from 'styled-components'
import {
  DownloadCloud as DownloadCloudIcon,
  Plus as PlusIcon,
  Send as SendIcon,
  Zap as VideoIcon,
} from 'react-feather'
import { formatBalance, formatPercentage, pathInfo } from '../../utils'
import { Button, MetricBox, Wrapper } from '../../components'
import enhance from './enhance'

type Transcoder = {
  active: boolean,
  status: string,
  lastRewardRound: string,
  blockRewardCut: string,
  feeShare: string,
  pricePerSegment: string,
  pendingBlockRewardCut: string,
  pendingFeeShare: string,
  pendingPricePerSegment: string,
}

type Props = {
  transcoder: Transcoder,
  loading: boolean,
  match: { path: string },
}

const AccountdTranscoding: React.Component<Props> = ({
  transcoder,
  loading,
  match,
}: Props): ReactElement => {
  const {
    active,
    status,
    lastRewardRound,
    blockRewardCut,
    feeShare,
    pricePerSegment,
    pendingBlockRewardCut,
    pendingFeeShare,
    pendingPricePerSegment,
  } = transcoder
  const me = pathInfo.isMe(match.path)
  return (
    <Wrapper>
      <MetricBox title="Status" value={status} />
      <MetricBox title="Active" value={active ? 'True' : 'False'} />
      <MetricBox
        title="Block Reward Cut"
        suffix="%"
        value={formatPercentage(blockRewardCut)}
      />
      <MetricBox
        title="Pending Block Reward Cut"
        suffix="%"
        value={formatPercentage(pendingBlockRewardCut)}
      />
      <MetricBox
        title="Fee Share"
        suffix="%"
        value={formatPercentage(feeShare)}
      />
      <MetricBox
        title="Pending Fee Share"
        suffix="%"
        value={formatPercentage(pendingFeeShare)}
      />
      <MetricBox
        title="Price Per Segment"
        suffix="ETH"
        value={formatBalance(pricePerSegment)}
        subvalue={formatBalance(pricePerSegment, 18)}
      />
      <MetricBox
        title="Pending Price Per Segment"
        suffix="ETH"
        value={formatBalance(pendingPricePerSegment)}
        subvalue={formatBalance(pendingPricePerSegment, 18)}
      />
      <MetricBox title="Last Reward Round" value={lastRewardRound} />
    </Wrapper>
  )
}

export default enhance(AccountdTranscoding)
