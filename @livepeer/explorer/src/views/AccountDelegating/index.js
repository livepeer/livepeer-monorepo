import React, { ReactElement } from 'react'
import { matchPath } from 'react-router'
import { Link } from 'react-router-dom'
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
  openSocket,
  pathInfo,
  promptForArgs,
  toBaseUnit,
} from '../../utils'
import { Button, MetricBox, Wrapper } from '../../components'
import enhance from './enhance'

type Props = {
  delegtor: {
    status: string,
    delegateAddress: string,
    bondedAmount: string,
    fees: string,
    delegatedAmount: string,
    lastClaimRound: string,
    startRound: string,
    withdrawRound: string,
  },
  loading: boolean,
  match: Function,
}

const AccountDelegating: React.Component<Props> = ({
  delegator,
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
  const me = pathInfo.isMe(match.path)
  return (
    <Wrapper>
      <MetricBox title="Status" value={status} />
      <MetricBox
        title="Delegate Address"
        value={
          !delegateAddress ? (
            'N/A'
          ) : (
            <Link to={`/accounts/${delegateAddress}`}>View Account</Link>
          )
        }
        subvalue={delegateAddress}
      />
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
      <MetricBox title="Last Claim Round" value={lastClaimRound} />
      <MetricBox title="Start Round" value={startRound} />
      <MetricBox title="Withdraw Round" value={withdrawRound} />
    </Wrapper>
  )
}

export default enhance(AccountDelegating)
