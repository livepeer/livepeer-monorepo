// @flow
import * as React from 'react'
import styled, { keyframes } from 'styled-components'
import { Zap as VideoIcon } from 'react-feather'
import { formatBalance } from '../../utils'
import {
  Button,
  Content,
  InlineHint,
  MetricBox,
  Wrapper,
} from '../../components'
import enhance from './enhance'

type AccountBroadcastingProps = {
  broadcaster: GraphQLProps<Broadcaster>,
}

const AccountBroadcasting: React.ComponentType<AccountBroadcastingProps> = ({
  broadcaster,
}) => {
  const { deposit, jobs, withdrawBlock } = broadcaster.data
  return (
    <Wrapper>
      <InlineHint flag="account-broadcasting">
        <h3>Lorem Ipsum</h3>
        <p>
          Lorem ipsum dolor sit amet, et arcu viverra elit. Velit sapien odio
          sollicitudin, in neque magna, orci pede, vel eleifend urna.
        </p>
      </InlineHint>
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
