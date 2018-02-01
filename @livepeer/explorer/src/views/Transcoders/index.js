import React, { ReactElement } from 'react'
import { matchPath } from 'react-router'
import { Link } from 'react-router-dom'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { queries } from '@livepeer/graphql-sdk'
import styled from 'styled-components'
import {
  DownloadCloud as DownloadCloudIcon,
  Plus as PlusIcon,
  Send as SendIcon,
  Zap as VideoIcon,
} from 'react-feather'
import { formatBalance, formatPercentage, pathInfo } from '../../utils'
import {
  Avatar,
  Banner,
  BasicNavbar,
  Button,
  Content,
  MetricBox,
  ScrollToTopOnMount,
  Wrapper,
} from '../../components'
import enhance from './enhance'

type Transcoder = {
  id: string,
  active: boolean,
  status: string,
  lastRewardRound: string,
  blockRewardCut: string,
  feeShare: string,
  pricePerSegment: string,
  pendingBlockRewardCut: string,
  pendingFeeShare: string,
  pendingPricePerSegment: string,
  totalStake: string,
}

type Props = {
  transcoders: Array<Transcoder>,
  loading: boolean,
}

const TranscodersView = ({ error, history, loading, transcoders }) => {
  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <BasicNavbar onSearch={x => history.push(`/accounts/${x}`)} />
      <Banner height="128px">
        <h1 style={{ margin: '0 auto' }}>Transcoders</h1>
      </Banner>
      <Content>
        {transcoders.length ? (
          <br />
        ) : (
          <p style={{ textAlign: 'center' }}>
            {loading && 'Loading transcoder data...'}
            {!loading && 'There are no transcoders'}
          </p>
        )}
        {transcoders.map(props => <TranscoderCard key={props.id} {...props} />)}
      </Content>
    </React.Fragment>
  )
}

const TranscoderCard = props => {
  const { active, id, status, ...stats } = props
  return (
    <TranscoderCardContainer>
      <TranscoderCardBasicInfo id={id} status={status} active={active} />
      <TranscoderStats {...stats} />
      {/*<span style={{ fontSize: 10 }}>{JSON.stringify(props)}</span>*/}
    </TranscoderCardContainer>
  )
}

const TranscoderCardContainer = styled.div`
  display: inline-flex;
  flex-flow: row wrap;
  background: #fff;
  margin-bottom: 16px;
  border-radius: 2px;
  padding: 16px;
  overflow: auto;
  box-shadow: 0 1px 2px 0px rgba(0, 0, 0, 0.15);
`

const TranscoderCardBasicInfo = ({ active, id, status }) => {
  return (
    <div
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        width: 240,
      }}
    >
      <Link to={`/accounts/${id}/transcoding`}>
        <Avatar id={id} size={32} />
      </Link>
      <div
        style={{
          display: 'inline-block',
          width: 128,
          padding: 7,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        <Link
          to={`/accounts/${id}/transcoding`}
          style={{ color: '#000', textDecoration: 'none' }}
        >
          {id.substr(0, 10)}...
        </Link>
      </div>
      <div
        style={{
          padding: 7,
          display: 'inline-block',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          color: active ? 'darkseagreen' : 'orange',
        }}
      >
        {active ? 'active' : 'inactive'}
      </div>
    </div>
  )
}

const TranscoderStats = ({
  blockRewardCut,
  feeShare,
  pricePerSegment,
  totalStake,
}) => {
  return (
    <div style={{ display: 'inline-block', minWidth: 320 }}>
      <div style={{ display: 'inline-block', margin: '0 16px', width: 64 }}>
        <div style={{ marginBottom: 4, fontSize: 11 }}>Reward Cut</div>
        <div style={{ fontSize: 14 }}>
          {formatPercentage(blockRewardCut, 2)}%
        </div>
      </div>
      <div style={{ display: 'inline-block', margin: '0 16px', width: 64 }}>
        <div style={{ marginBottom: 4, fontSize: 11 }}>Fee Share</div>
        <div style={{ fontSize: 14 }}>{formatPercentage(feeShare, 2)}%</div>
      </div>
      <div style={{ display: 'inline-block', margin: '0 16px', width: 80 }}>
        <div style={{ marginBottom: 4, fontSize: 11 }}>Price</div>
        <div style={{ fontSize: 14 }}>{pricePerSegment} LPTU</div>
      </div>
      <div style={{ display: 'inline-block', margin: '0 16px', width: 128 }}>
        <div style={{ marginBottom: 4, fontSize: 11 }}>Total Stake</div>
        <div style={{ fontSize: 14 }}>{formatBalance(totalStake, 2)} LPT</div>
      </div>
    </div>
  )
}

export default enhance(TranscodersView)
