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
fragment DelegatorFragment on Delegator {
  id
  status
  delegateAddress
  bondedAmount
  fees
  delegatedAmount
  lastClaimRound
  startRound
  withdrawRound
}
query DelegatorQuery(
  $id: String!,
  $me: Boolean!
) {
  me @include(if: $me) {
    id
    delegator {
      ...DelegatorFragment
    }
  }
  account(id: $id) @skip(if: $me) {
    id
    delegator {
      ...DelegatorFragment
    }
  }
}
`)

const connectApollo = graphql(query, {
  props: ({ data, ownProps }) => {
    const delegator = {
      deposit: '',
      withdrawBlock: '',
      jobs: [],
      ...(data.account || {}).delegator,
      ...(data.me || {}).delegator,
    }
    return {
      ...ownProps,
      error: data.error,
      refetch: data.refetch,
      fetchMore: data.fetchMore,
      loading: data.loading,
      delegator,
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
  delegtor: {
    // @todo
  },
  loading: boolean,
}

const AccountOverview: React.Component<Props> = ({
  delegator,
  history,
  loading,
  match,
}: Props): ReactElement => {
  const {
    status,
    delegateAddress,
    bondedAmount,
    fees,
    delegatedAmount,
    lastClaimRound,
    startRound,
    withdrawRound,
  } = delegator
  const me = matchPath(history.location.pathname, { path: '/me' })
  return (
    <Wrapper>
      <MetricBox title="Status" value={status} />
      <MetricBox title="Delegate Address" value={delegateAddress || 'N/A'} />
      <MetricBox
        title="Bonded Amount"
        suffix="LPT"
        value={formatBalance(bondedAmount)}
        subvalue={formatBalance(bondedAmount, 18)}
      />
      <MetricBox
        title="Fees"
        suffix="LPT"
        value={formatBalance(fees)}
        subvalue={formatBalance(fees, 18)}
      />
      <MetricBox
        title="Delegated Amount"
        suffix="LPT"
        value={formatBalance(delegatedAmount)}
        subvalue={formatBalance(delegatedAmount, 18)}
      />
      <MetricBox
        title="Last Claim Round"
        value={formatBalance(lastClaimRound)}
      />
      <MetricBox title="Start Round" value={formatBalance(startRound)} />
      <MetricBox title="Withdraw Round" value={formatBalance(withdrawRound)} />
    </Wrapper>
  )
}

export default enhance(AccountOverview)
