// @flow
import * as React from 'react'
import {
  Zap as VideoIcon,
  Minus as MinusIcon,
  Plus as PlusIcon,
} from 'react-feather'
import { formatBalance, MathBN } from '../../utils'
import {
  Button,
  Content,
  EmptyMessage,
  MetricBox,
  Wrapper,
} from '../../components'
import enhance from './enhance'

type AccountBroadcastingProps = {
  broadcaster: GraphQLProps<Broadcaster>,
  coinbase: GraphQLProps<Coinbase>,
  match: Match,
  onDepositETH: (e: Event) => void,
  onWithdrawDeposit: (e: Event) => void,
}

const AccountBroadcasting: React.ComponentType<AccountBroadcastingProps> = ({
  broadcaster,
  coinbase,
  match,
  onDepositETH,
  onWithdrawDeposit,
}) => {
  const isMe = match.params.accountId === coinbase.data.coinbase
  const { deposit, jobs, withdrawBlock } = broadcaster.data
  return (
    <Wrapper>
      {/*<InlineHint flag="account-broadcasting">
        <h3>Lorem Ipsum</h3>
        <p>
          Lorem ipsum dolor sit amet, et arcu viverra elit. Velit sapien odio
          sollicitudin, in neque magna, orci pede, vel eleifend urna.
        </p>
  </InlineHint>*/}
      {/** ETH Deposit */}
      <MetricBox
        help="The amount of Ethereum deposited by this account to pay transcoding fees"
        title="Broadcasting Funds"
        suffix="ETH"
        value={formatBalance(deposit, 18)}
        subvalue={
          withdrawBlock !== '0'
            ? `These funds may not be withdrawn until block #${withdrawBlock}`
            : ''
        }
      >
        {isMe && (
          <React.Fragment>
            {/** withdraw */}
            <Button
              disabled={!MathBN.gt(deposit, '0')}
              onClick={onWithdrawDeposit}
            >
              <MinusIcon size={12} />
              <span style={{ marginLeft: 8 }}>withdraw</span>
            </Button>
            {/** deposit */}
            <Button onClick={onDepositETH}>
              <PlusIcon size={12} />
              <span style={{ marginLeft: 8 }}>deposit</span>
            </Button>
          </React.Fragment>
        )}
      </MetricBox>
      {/* Jobs List */}
      <Content>
        <h3>Job History</h3>
        {!jobs.length && (
          <EmptyMessage>
            <h2>This account has no broadcast history</h2>
          </EmptyMessage>
        )}
        <div>
          {jobs.map(props => (
            <JobCard key={props.id} {...props} />
          ))}
        </div>
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
        <div style={{ display: 'flex', flexFlow: 'row', flexWrap: 'wrap' }}>
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
        width: 'calc(50% - 20px)',
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
