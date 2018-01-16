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
import {
  formatBalance,
  toBaseUnit,
  promptForArgs,
  openSocket,
} from '../../utils'

/**
 * Components
 */

const withTransactionHandlers = withHandlers({
  onDepositETH: props =>
    async function depositETH(e: Event): void {
      try {
        e.preventDefault()
        const { deposit } = window.livepeer.rpc
        const args = promptForArgs([
          {
            ask: 'How Much ETH would you like to deposit?',
            format: toBaseUnit,
          },
        ]).filter(x => x)
        if (args.length < 1) return console.warn('Aborting transaction...')
        await deposit(...args)
        window.alert('Deposit complete!')
      } catch (err) {
        window.alert(err.message)
      }
    },
})

const query = gql(`
fragment TranscoderFragment on Transcoder {
  id
  active
  status
  lastRewardRound
  blockRewardCut
  feeShare
  pricePerSegment
  pendingBlockRewardCut
  pendingFeeShare
  pendingPricePerSegment
}
query DelegatorQuery(
  $id: String!,
  $me: Boolean!
) {
  me @include(if: $me) {
    id
    transcoder {
      ...TranscoderFragment
    }
  }
  account(id: $id) @skip(if: $me) {
    id
    transcoder {
      ...TranscoderFragment
    }
  }
}
`)

const connectApollo = graphql(query, {
  props: ({ data, ownProps }) => {
    const transcoder = {
      deposit: '',
      withdrawBlock: '',
      jobs: [],
      ...(data.account || {}).transcoder,
      ...(data.me || {}).transcoder,
    }
    return {
      ...ownProps,
      error: data.error,
      refetch: data.refetch,
      fetchMore: data.fetchMore,
      loading: data.loading,
      transcoder,
    }
  },
  options: ({ match }) => {
    return {
      pollInterval: 5000,
      variables: {
        id: match.params.account || '',
        me: !match.params.account,
      },
    }
  },
})

const enhance = compose(connectApollo, withTransactionHandlers)

/**
 * Components
 */

const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
`

const Content = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 672px;
  max-width: 100%;
  margin: 0 auto 120px auto;
  padding: 0 16px;
`

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  margin: 8px;
  background-image: none !important;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  // box-shadow: 0 0 0 1px inset;
  background: none;
  cursor: pointer;
`

const Box = ({ children, width }) => {
  return (
    <OuterBox width={width}>
      <InnerBox>{children}</InnerBox>
    </OuterBox>
  )
}

const OuterBox = styled.div`
  width: ${({ width }) => width || '100%'};
  padding: 16px 8px;
  text-align: center;
`

const InnerBox = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 2px 0px rgba(0, 0, 0, 0.15);
`

const MetricBox = ({ value, subvalue, title, suffix, prefix, children }) => {
  return (
    <Box width="50%">
      <h2
        style={{
          margin: 0,
          padding: 16,
          fontSize: 14,
          textTransform: 'uppercase',
          borderBottom: '1px solid #eee',
          color: '#666',
        }}
      >
        {title}
      </h2>
      <h3
        style={{
          borderBottom: children ? '1px solid #eee' : '',
          margin: 0,
          padding: `${24 + (!subvalue ? 12 : 0)}px 8px`,
        }}
      >
        {prefix}
        <strong style={{ fontWeight: 400 }}>{value}</strong> {suffix}
        <div>
          {subvalue && <span style={{ fontSize: 12 }}>{subvalue}</span>}
        </div>
      </h3>
      <div>{children}</div>
    </Box>
  )
}

type Props = {
  transcoder: {
    // @todo
  },
  loading: boolean,
}

const AccountOverview: React.Component<Props> = ({
  history,
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
  const me = matchPath(history.location.pathname, { path: '/me' })
  return (
    <Wrapper>
      <MetricBox title="Status" value={status} />
      <MetricBox title="Active" value={active ? 'True' : 'False'} />
      <MetricBox
        title="Block Reward Cut"
        suffix="LPT"
        value={formatBalance(blockRewardCut)}
        subvalue={formatBalance(blockRewardCut, 18)}
      />
      <MetricBox
        title="Pending Block Reward Cut"
        suffix="LPT"
        value={formatBalance(pendingBlockRewardCut)}
        subvalue={formatBalance(pendingBlockRewardCut, 18)}
      />
      <MetricBox title="Fee Share" suffix="%" value={feeShare} />
      <MetricBox title="Pending Fee Share" suffix="%" value={pendingFeeShare} />
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

export default enhance(AccountOverview)
