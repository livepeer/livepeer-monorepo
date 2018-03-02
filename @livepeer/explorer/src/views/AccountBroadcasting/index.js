import React, { ReactElement } from 'react'
import { matchPath } from 'react-router'
import { compose } from 'recompose'
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
import { formatBalance, pathInfo } from '../../utils'
import { Button, Content, MetricBox, Wrapper } from '../../components'
import enhance from './enhance'

type AccountBroadcastingProps = {
  broadcaster: Broadcaster,
  history: History,
  loading: boolean,
  match: Match,
}

const AccountBroadcasting: React.ComponentType<AccountBroadcastingProps> = ({
  broadcaster,
  history,
  loading,
  match,
}) => {
  const { deposit, jobs, withdrawBlock } = broadcaster
  const me = pathInfo.isMe(match.path)
  return (
    <Wrapper>
      {/** ETH Deposit */}
      <MetricBox
        title="Deposit"
        suffix="ETH"
        value={formatBalance(deposit)}
        subvalue={formatBalance(deposit, 18)}
      />
      {/** Withdraw Block */}
      <MetricBox title="Withdraw Block" value={withdrawBlock} />
      <Content>
        <h3>Job History</h3>
        {!jobs.length && <div>There are no jobs for this account</div>}
        <div>{jobs.map(props => <JobCard key={props.id} {...props} />)}</div>
      </Content>
    </Wrapper>
  )
}

const JobCard = ({ id, broadcaster, profiles, streamId }) => {
  return (
    <div
      style={{
        background: '#fff',
        marginBottom: 16,
        borderRadius: 2,
        padding: 16,
        boxShadow: '0 1px 2px 0px rgba(0, 0, 0, 0.15)',
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <VideoIcon size={24} />
        <span style={{ padding: 4 }}>#{id}</span>
      </div>
      <div>
        <strong
          style={{
            display: 'block',
            fontWeight: 400,
            padding: '16px 0',
          }}
        >
          Manifest ID
        </strong>
        <input
          readOnly
          value={streamId.substr(0, 68 + 64)}
          onFocus={e => e.target.select()}
          style={{
            // height: 32,
            fontSize: 12,
            width: '100%',
            padding: 8,
          }}
        />
      </div>
      <div>
        <strong
          style={{
            display: 'block',
            fontWeight: 400,
            padding: '16px 0',
          }}
        >
          Profiles
        </strong>
        <div style={{ display: 'flex', flexFlow: 'row' }}>
          {profiles.map(props => (
            <JobProfileItem key={props.name} {...props} />
          ))}
        </div>
      </div>
    </div>
  )
}

const JobProfileItem = ({ name, bitrate, framerate, resolution }) => {
  return (
    <div
      key={name}
      style={{
        display: 'inline-block',
        width: '50%',
        padding: 8,
        margin: 10,
        border: '1px solid #eee',
        fontSize: 14,
      }}
    >
      Name: {name}
      <br />
      Bitrate: {bitrate}
      <br />
      Framerate: {framerate}
      <br />
      Resolution: {resolution}
      <br />
    </div>
  )
}

export default enhance(AccountBroadcasting)
