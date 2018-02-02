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
} from 'react-feather'
import { formatBalance, pathInfo } from '../../utils'
import { Button, MetricBox, Wrapper } from '../../components'
import enhance from './enhance'

type Account = {
  id: string,
  ethBalance: string,
  tokenBalance: string,
}

type Props = {
  account: Account,
  loading: boolean,
  me: boolean,
  match: { path: string },
  onDepositETH: (e: Event) => void,
  onRequestETH: (e: Event) => void,
  onRequestLPT: (e: Event) => void,
  onTransferLPT: (e: Event) => void,
}

const AccountOverview: React.Component<Props> = ({
  account,
  history,
  loading,
  match,
  onDepositETH,
  onRequestETH,
  onRequestLPT,
  onTransferLPT,
}: Props): ReactElement => {
  const { ethBalance, tokenBalance } = account
  const me = pathInfo.isMe(match.path)
  return (
    <React.Fragment>
      <Wrapper>
        <MetricBox
          title="ETH Address"
          width="100%"
          subvalue={<code style={{ fontSize: 16 }}>{account.id}</code>}
        />
      </Wrapper>
      <Wrapper>
        {/** ETH */}
        <MetricBox
          title="ETH Balance"
          suffix="ETH"
          value={formatBalance(ethBalance)}
          subvalue={formatBalance(ethBalance, 18)}
        >
          {me && (
            <React.Fragment>
              {/** request */}
              <Button onClick={onRequestETH}>
                <DownloadCloudIcon size={12} />
                <span style={{ marginLeft: 8 }}>request</span>
              </Button>
              {/** deposit */}
              <Button onClick={onDepositETH}>
                <PlusIcon size={12} />
                <span style={{ marginLeft: 8 }}>deposit</span>
              </Button>
            </React.Fragment>
          )}
        </MetricBox>
        {/** LPT */}
        <MetricBox
          title="Token Balance"
          suffix="LPT"
          value={formatBalance(tokenBalance)}
          subvalue={formatBalance(tokenBalance, 18)}
        >
          {me && (
            <React.Fragment>
              {/** request */}
              <Button onClick={onRequestLPT}>
                <DownloadCloudIcon size={12} />
                <span style={{ marginLeft: 8 }}>request</span>
              </Button>
              {/** transfer */}
              <Button onClick={onTransferLPT}>
                <SendIcon size={12} />
                <span style={{ marginLeft: 8 }}>transfer</span>
              </Button>
            </React.Fragment>
          )}
        </MetricBox>
      </Wrapper>
    </React.Fragment>
  )
}

export default enhance(AccountOverview)
