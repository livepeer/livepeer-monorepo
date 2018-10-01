// @flow
import * as React from 'react'
import { matchPath } from 'react-router-dom'
import BN from 'bn.js'
import { Cpu as CpuIcon } from 'react-feather'
import Joyride from 'react-joyride'
import {
  Avatar,
  Banner,
  BasicNavbar,
  Button,
  Content,
  InlineHint,
  LockedWallet,
  PageHeading,
  ScrollToTopOnMount,
  TranscoderCard,
  Wrapper,
} from '../../components'
import { MathBN } from '../../utils'
import enhance from './enhance'

type TranscodersViewProps = {
  bond: ({ id: string }) => void,
  currentRound: GraphQLProps<Round>,
  history: History,
  match: Match,
  me: GraphQLProps<Account>,
  unbond: ({ id: string }) => void,
  transcoders: GraphQLProps<Array<Transcoder>>,
}

/**
 * Displays a list of transcoders and allows authenticated users to sort and bond/unbond from them
 */
const TranscodersView: React.ComponentType<TranscodersViewProps> = ({
  bond,
  history,
  match,
  me,
  transcoders,
  unbond,
}) => {
  const {
    delegator: { bondedAmount, delegateAddress, pendingStake, status },
    tokenBalance,
  } = me.data
  const totalStake = MathBN.max(bondedAmount, pendingStake)
  const isBonding = status === 'Pending'
  const isBonded = status === 'Bonded'
  const isUnbonding = status === 'Unbonding'
  const isUnbonded = status === 'Unbonded'
  const isTranscoder = me.data.transcoder.status === 'Registered'
  const searchParams = new URLSearchParams(history.location.search)
  const TOUR_ENABLED = !!searchParams.get('tour')
  const sort = searchParams.get('sort') || 'totalStake'
  const order = searchParams.get('order') || 'desc'
  const asc = order === 'asc'
  const total = transcoders.data.length
  const compareFn = createCompareFunction(asc, sort)
  const locked = window.livepeer.config.accounts.length <= 0
  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <BasicNavbar onSearch={x => history.push(`/accounts/${x}`)} />
      <Banner height="128px">
        <PageHeading className="page-heading">
          <CpuIcon size={32} />&nbsp;Transcoders
        </PageHeading>
      </Banner>
    {
      locked && (
        <LockedWallet />
      )
    }
      <Content>
        {!total ? null : (
          <InlineHint flag="transcoders-list">
            <h3>Transcoder Delegation</h3>
            <p>
              As a token holder, you can participate in the network by staking
              towards a Transcoder and earn additional fees and LPT rewards.
              Read our Delegator Guide for a comprehensive overview, tutorials,
              and a FAQ. You can learn more about each transcoder on the forum
              by checking out their social campaign on the Livepeer forum.<br />
              <br />
              <Button
                style={{ margin: 0 }}
                onClick={() =>
                  window.open(
                    'https://github.com/livepeer/wiki/wiki/Delegating',
                  )
                }>
                Read the Delegator Guide
              </Button>
              <Button
                style={{ margin: '0 0 0 16px' }}
                onClick={() =>
                  window.open(
                    'https://forum.livepeer.org/c/transcoders/transcoder-campaign',
                  )
                }>
                View Transcoder Campaigns
              </Button>
            </p>
          </InlineHint>
        )}
        {/** Empty State */ !total && (
          <div style={{ textAlign: 'center' }}>
            {transcoders.loading && <h2>Loading transcoders...</h2>}
            {!transcoders.loading && <h2>There are no transcoders</h2>}
          </div>
        )}
        {/** Toolbar */ !total ? null : (
          <div
            className="filter-sort"
            style={{
              display: 'flex',
              marginBottom: 16,
              padding: '0 8px',
              borderBottom: '1px solid #ddd',
            }}>
            <p>
              Showing 1 - {total} of {total}
            </p>
            <div
              style={{
                display: 'inline-flex',
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <div style={{ marginLeft: 16 }}>
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: 11,
                    letterSpacing: 1,
                  }}>
                  sort by: &nbsp;
                </span>
                <select
                  defaultValue={sort}
                  onChange={e => {
                    const { value } = e.target
                    searchParams.set('sort', value)
                    const queryString = searchParams.toString()
                    const url = `${match.path}?${queryString}`
                    history.replace(url)
                  }}>
                  <option value="totalStake">Total Stake</option>
                  <option value="pendingRewardCut">Reward Cut</option>
                  <option value="pendingFeeShare">Fee Share</option>
                  <option value="pendingPricePerSegment">Price</option>
                </select>
              </div>
              <div style={{ marginLeft: 16 }}>
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: 11,
                    letterSpacing: 1,
                  }}>
                  order by: &nbsp;
                </span>
                <select
                  defaultValue={order}
                  onChange={e => {
                    const { value } = e.target
                    searchParams.set('order', value)
                    const queryString = searchParams.toString()
                    const url = `${match.path}?${queryString}`
                    history.replace(url)
                  }}>
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
            </div>
          </div>
        )}
        {/* Results */ [...transcoders.data].sort(compareFn).map(props => {
          const myId = me.data.id // delegator id
          const { id } = props // transcoder id
          const isMyDelegate = id === delegateAddress
          const canRebond = isMyDelegate && (isBonded || isBonding)
          const canBond =
            myId && (!isTranscoder || (isTranscoder && id === myId))
          const canUnbond = myId && isBonded && isMyDelegate
          return (
            <TranscoderCard
              {...props}
              key={id}
              bonded={isMyDelegate}
              bondedAmount={totalStake}
              className="transcoder-card"
              onBond={canBond ? () => bond({ id }) : undefined}
              onUnbond={canUnbond ? () => unbond({ id }) : undefined}
            />
          )
        })}
      </Content>
      {TOUR_ENABLED && (
        <Tour
          // callback={({ step }) => {
          //   if (step && 'sortingOptions' === step.name) {
          //     window.scrollTo(0, 0)
          //   }
          // }}
          continuous={true}
          locale={{
            back: 'Back',
            close: 'Okay',
            last: 'Done',
            next: 'Next',
            skip: 'Skip',
          }}
          run={transcoders.data.length > 0 && !me.loading}
          disableOverlay={false}
          showProgress={true}
          steps={[
            {
              content:
                'Transcoders play a critical role in the Livepeer ecosystem. They are the ones who are taking an input stream and converting it into many different formats in a timely manner for low latency distribution.',
              placement: 'right',
              target: '.page-heading',
            },
            {
              content: `These cards display protocol metrics relating to each transcoder. These numbers can help you understand which transcoder you would like to bond to.`,
              placement: 'bottom',
              target: '.transcoder-card',
            },
            me.data.id && {
              content:
                'You can earn additional Livepeer token by bonding towards transcoders. You will need to be signed into your web3 wallet in order to bond.',
              placement: 'bottom-end',
              target: '.actions-buttons button',
            },
          ].filter(Boolean)}
        />
      )}
    </React.Fragment>
  )
}

class Tour extends React.Component {
  shouldComponentUpdate(nextProps) {
    // Don't update if already running (causes beacon/tooltips to blink)
    return !this.props.run
  }
  render() {
    return <Joyride {...this.props} />
  }
}

const createCompareFunction = (asc: boolean, sort: string) => (
  a: Transcoder,
  b: Transcoder,
): number => {
  const _a = new BN(a[sort], 10)
  const _b = new BN(b[sort], 10)
  const mul = asc ? 1 : -1
  return _a.cmp(_b) * mul
}

export default enhance(TranscodersView)
