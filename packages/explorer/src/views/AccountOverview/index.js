// @flow
import * as React from 'react'
import {
  DownloadCloud as DownloadCloudIcon,
  Plus as PlusIcon,
  Send as SendIcon,
} from 'react-feather'
import { formatBalance } from '../../utils'
import { Button, InlineHint, MetricBox, Wrapper } from '../../components'
import enhance from './enhance'

type AccountOverviewProps = {
  account: GraphQLProps<Account>,
  coinbase: GraphQLProps<Coinbase>,
  match: Match,
  onDepositETH: (e: Event) => void,
  onRequestETH: (e: Event) => void,
  onRequestLPT: (e: Event) => void,
  onTransferLPT: (e: Event) => void,
}

const AccountOverview: React.ComponentType<AccountOverviewProps> = ({
  account,
  coinbase,
  match,
  onDepositETH,
  onRequestETH,
  onRequestLPT,
  onTransferLPT,
}) => {
  const isMe = match.params.accountId === coinbase.data.coinbase
  const { ethBalance, id, tokenBalance } = account.data
  const IS_MAINNET = window.web3 && `${window.web3.version.network}` === '1'
  return (
    <React.Fragment>
      {/*<InlineHint flag="account-overview">
        <h3>Account Overview</h3>
        <p>The overview shows ETH and LPT balances in an account's wallet</p>
  </InlineHint>*/}
      <Wrapper>
        <MetricBox
          title="ETH Address"
          width="100%"
          subvalue={<code style={{ fontSize: 16 }}>{id}</code>}
        />
      </Wrapper>
      <Wrapper>
        {/** ETH */}
        <MetricBox
          title="ETH Balance"
          suffix="ETH"
          value={formatBalance(ethBalance)}
          subvalue={formatBalance(ethBalance, 18)}
        />
        {/** LPT */}
        <MetricBox
          title="Token Balance"
          suffix="LPT"
          value={formatBalance(tokenBalance)}
          subvalue={formatBalance(tokenBalance, 18)}
        >
          {isMe && (
            <React.Fragment>
              {/** request */}
              {!IS_MAINNET && (
                <Button onClick={onRequestLPT}>
                  <DownloadCloudIcon size={12} />
                  <span style={{ marginLeft: 8 }}>request</span>
                </Button>
              )}
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
