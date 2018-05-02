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
  PageHeading,
  ScrollToTopOnMount,
  TranscoderCard,
  Wrapper,
} from '../../components'
import enhance from './enhance'

type TranscodersViewProps = {
  bondTo: string => void,
  currentRound: GraphQLProps<Array<Round>>,
  history: History,
  match: Match,
  me: GraphQLProps<Account>,
  unbondFrom: string => void,
  transcoders: GraphQLProps<Array<Transcoder>>,
  toasts: any,
}

/**
 * Displays a list of transcoders and allows authenticated users to sort and bond/unbond from them
 */
const TranscodersView: React.ComponentType<TranscodersViewProps> = ({
  bondTo,
  history,
  match,
  me,
  toasts,
  transcoders,
  unbondFrom,
}) => {
  const {
    delegator: { bondedAmount, delegateAddress, status },
    tokenBalance,
  } = me.data
  const isBonding = status === 'Pending'
  const isBonded = status === 'Bonded'
  const isUnbonding = status === 'Unbonding'
  const isUnbonded = status === 'Unbonded'
  const searchParams = new URLSearchParams(history.location.search)
  const TOUR_ENABLED = !!searchParams.get('tour')
  const sort = searchParams.get('sort') || 'totalStake'
  const order = searchParams.get('order') || 'desc'
  const asc = order === 'asc'
  const total = transcoders.data.length
  const compareFn = createCompareFunction(asc, sort)
  return (
    <React.Fragment>
      <ScrollToTopOnMount />
      <BasicNavbar onSearch={x => history.push(`/accounts/${x}`)} />
      <Banner height="128px">
        <PageHeading className="page-heading">
          <CpuIcon size={32} />&nbsp;Transcoders
        </PageHeading>
      </Banner>
      <Content>
        {!total ? null : (
          <InlineHint flag="transcoders-list">
            <h3>Transcoder Delegation</h3>
            <p>
              As a token holder, you can participate in the network by staking
              towards a Transcoder and earn additional fees and LPT rewards.
              Read our Delegator Guide for a comprehensive overview, tutorials,
              and a FAQ.<br />
              <br />
              <Button
                style={{ margin: 0 }}
                onClick={() =>
                  window.open(
                    'https://github.com/livepeer/wiki/wiki/Delegating',
                  )
                }
              >
                View Delegator Guide
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
            }}
          >
            <p>
              Showing 1 - {total} of {total}
            </p>
            <div
              style={{
                display: 'inline-flex',
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <div style={{ marginLeft: 16 }}>
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: 11,
                    letterSpacing: 1,
                  }}
                >
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
                  }}
                >
                  <option value="totalStake">Total Stake</option>
                  <option value="rewardCut">Reward Cut</option>
                  <option value="feeShare">Fee Share</option>
                  <option value="pricePerSegment">Price</option>
                </select>
              </div>
              <div style={{ marginLeft: 16 }}>
                <span
                  style={{
                    textTransform: 'uppercase',
                    fontSize: 11,
                    letterSpacing: 1,
                  }}
                >
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
                  }}
                >
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
          const canBond = myId && (canRebond || isUnbonded)
          const canUnbond = myId && isBonded && isMyDelegate
          return (
            <TranscoderCard
              {...props}
              key={id}
              bonded={isMyDelegate}
              className="transcoder-card"
              onBond={canBond ? bondTo(id) : undefined}
              onUnbond={canUnbond ? unbondFrom(id) : undefined}
            />
          )
        })}
      </Content>
      {TOUR_ENABLED && (
        <Joyride
          callback={({ step }) => {
            if (step && 'sortingOptions' === step.name) {
              window.scrollTo(0, 0)
            }
          }}
          debug={false}
          locale={{
            back: <span>Back</span>,
            close: <span>Okay</span>,
            last: <span>Done</span>,
            next: <span>Next</span>,
            skip: <span>Skip</span>,
          }}
          run={!transcoders.loading}
          showOverlay={true}
          showSkipButton={false}
          showStepsProgress={true}
          steps={[
            {
              name: 'transcoderOverview',
              position: 'right',
              selector: '.page-heading',
              text:
                'As a delegator, you earn additional Livepeer token when you stake towards transcoders. Let us show you around and help you delegate. If you’re not already, Sign in to your web3 wallet to access your Livepeer token.',
              title: 'Transcoders List',
              type: 'click',
            },
            {
              name: 'transcoderCard',
              position: 'bottom',
              selector: '.transcoder-card',
              text:
                'Clicking on a transcoder ETH address lets you learn more about a specific transcoder.',
              title: 'Transcoder',
              type: 'click',
            },
            {
              name: 'transcoderCardActions',
              position: 'bottom',
              selector: '.actions-placeholder',
              text:
                'Once you’re ready to choose a transcoder, you can bond by clicking the bond button.',
              title: 'Bond Your Token',
              type: 'click',
            },
            // {
            //   name: 'sortingOptions',
            //   position: 'top-right',
            //   selector: '.filter-sort',
            //   text:
            //     'Lorem ipsum dolor sit amet, et arcu viverra elit. Velit sapien odio sollicitudin, in neque magna, orci pede, vel eleifend urna.',
            //   title: 'Sorting Options',
            //   type: 'click',
            // },
          ]}
          type="continuous"
        />
      )}
    </React.Fragment>
  )
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
