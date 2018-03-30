// @flow
import * as React from 'react'
import {
  DownloadCloud as DownloadCloudIcon,
  Plus as PlusIcon,
  Send as SendIcon,
} from 'react-feather'
import { formatBalance } from '../../utils'
import { Button, MetricBox, Wrapper } from '../../components'
import enhance from './enhance'

type AccountOverviewProps = {
  account: GraphQLProps<Account>,
  match: Match,
  onDepositETH: (e: Event) => void,
  onRequestETH: (e: Event) => void,
  onRequestLPT: (e: Event) => void,
  onTransferLPT: (e: Event) => void,
}

const AccountOverview: React.ComponentType<AccountOverviewProps> = ({
  account,
  match,
  onDepositETH,
  onRequestETH,
  onRequestLPT,
  onTransferLPT,
}) => {
  const { ethBalance, id, tokenBalance } = account.data
  return (
    <React.Fragment>
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
        >
          {!match.params.accountId && (
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
          {!match.params.accountId && (
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
