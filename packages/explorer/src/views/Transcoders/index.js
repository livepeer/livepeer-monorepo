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
  Content,
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
  const isBonded =
    status === 'Pending' || status === 'Bonded' || status === 'Unbonding'
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
        <PageHeading>
          <CpuIcon size={32} />&nbsp;Transcoders
        </PageHeading>
      </Banner>
      <Content>
        {/** Empty State */ !total && (
          <p style={{ textAlign: 'center' }}>
            {transcoders.loading && 'Loading transcoder data...'}
            {!transcoders.loading && 'There are no transcoders'}
          </p>
        )}
        {/** Toolbar */ !total ? null : (
          <div style={{ display: 'flex' }}>
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
          const myId = me.data.id
          const { id } = props
          const bonded = isBonded && id === delegateAddress
          const canBond = myId && (!delegateAddress || id === delegateAddress)
          const canUnbond = isBonded && myId && id === delegateAddress
          const onBond = (canBond && bondTo(id)) || undefined
          const onUnbond = (canUnbond && unbondFrom(id)) || undefined
          return (
            <TranscoderCard
              key={id}
              {...props}
              bonded={bonded}
              onBond={onBond}
              onUnbond={onUnbond}
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
          showOverlay={false}
          showSkipButton={false}
          showStepsProgress={true}
          steps={[
            {
              name: 'transcoderOverview',
              position: 'right',
              selector: '.sc-gqjmRU',
              text:
                'Lorem ipsum dolor sit amet, et arcu viverra elit. Velit sapien odio sollicitudin, in neque magna, orci pede, vel eleifend urna.',
              title: 'Transcoders List',
              type: 'click',
            },
            {
              name: 'transcoderCard',
              position: 'bottom',
              selector: '.sc-jTzLTM',
              text:
                'Lorem ipsum dolor sit amet, et arcu viverra elit. Velit sapien odio sollicitudin, in neque magna, orci pede, vel eleifend urna.',
              title: 'Transcoder',
              type: 'click',
            },
            {
              name: 'sortingOptions',
              position: 'top-right',
              selector: '.sc-ifAKCX',
              text:
                'Lorem ipsum dolor sit amet, et arcu viverra elit. Velit sapien odio sollicitudin, in neque magna, orci pede, vel eleifend urna.',
              title: 'Sorting Options',
              type: 'click',
            },
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
