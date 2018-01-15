import React, { ReactElement } from 'react'
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
  onRequestETH: props =>
    async function requestETH(e: Event): void {
      try {
        e.preventDefault()
        const socket = await openSocket('ws://52.14.204.154/api')
        // handle error
        socket.onerror = (e: Event): void => {
          window.alert(e.message)
        }
        // handle success
        socket.onmessage = (e: Event): void => {
          const data = JSON.parse(e.data)
          if (data.requests) {
            data.requests.forEach(({ account: addr, time }) => {
              if (addr.toLowerCase() !== props.account.id.toLowerCase()) return
              const t1 = Date.now()
              const t2 = +new Date(time)
              const t = t1 - t2
              const waitTime = 270 * 60 * 1000
              const timeRemaining = waitTime - t
              if (timeRemaining > 0) {
                window.alert(
                  `You may tap the ETH faucet again in ${msToTime(
                    waitTime - t,
                  )}`,
                )
              } else {
                window.alert('Got some ETH from the faucet! :)')
              }
            })
          }
          function msToTime(duration: number): string {
            let milliseconds = parseInt((duration % 1000) / 100),
              seconds = parseInt((duration / 1000) % 60),
              minutes = parseInt((duration / (1000 * 60)) % 60),
              hours = parseInt((duration / (1000 * 60 * 60)) % 24)

            hours = hours < 10 ? '0' + hours : hours
            minutes = minutes < 10 ? '0' + minutes : minutes
            seconds = seconds < 10 ? '0' + seconds : seconds

            return hours + 'h ' + minutes + 'min ' + seconds + 's'
          }
        }
        // send request
        socket.send(`{"url":"${props.account.id}","tier":2}`)
      } catch (err) {
        window.alert(err.message)
      }
    },
  onRequestLPT: props =>
    async function requestLPT(e: Event): void {
      try {
        e.preventDefault()
        const { tapFaucet } = window.livepeer.rpc
        await tapFaucet()
        window.alert('Got LPT!')
      } catch (err) {
        window.alert(err.message)
      }
    },
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
  onTransferLPT: props =>
    async function transferLPT(e: Event): void {
      try {
        e.preventDefault()
        const { transferToken } = window.livepeer.rpc
        const args = promptForArgs([
          {
            ask: 'Who would you like to transfer LPT to?',
          },
          {
            ask: 'How Much LPT would you like to transfer?',
            format: toBaseUnit,
          },
        ])
        if (args.length < 2) return console.warn('Aborting transaction...')
        await transferToken(...args)
        window.alert('Transfer complete!')
      } catch (err) {
        window.alert(err.message)
      }
    },
})

const query = gql(`
fragment AccountFragment on Account {
  id
  ethBalance
  tokenBalance
}
query MeOrAccountQuery(
  $id: String!,
  $me: Boolean!
) {
  me @include(if: $me) {
    ...AccountFragment
  }
  account(id: $id) @skip(if: $me) {
    ...AccountFragment
  }
}
`)

const connectApollo = graphql(query, {
  props: ({ data, ownProps }) => {
    // console.log(data)
    return {
      ...ownProps,
      error: data.error,
      refetch: data.refetch,
      fetchMore: data.fetchMore,
      loading: data.loading,
      account: data.me || data.account || {},
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

const TokenBox = ({ balance, type, children }) => {
  return (
    <Box width="50%">
      <h3
        style={{
          borderBottom: children ? '1px solid #eee' : '',
          margin: 0,
          padding: '24px 8px',
        }}
      >
        <strong style={{ fontWeight: 400 }}>{formatBalance(balance)}</strong>{' '}
        {type}
        <div>
          <span style={{ fontSize: 12 }}>{formatBalance(balance, 18)}</span>
        </div>
      </h3>
      <div>{children}</div>
    </Box>
  )
}

type Props = {
  account: {
    id?: string,
    ethBalance?: string,
    tokenBalance?: string,
  },
  loading: boolean,
  me: boolean,
  onDepositETH: (e: Event) => void,
  onRequestETH: (e: Event) => void,
  onRequestLPT: (e: Event) => void,
  onTransferLPT: (e: Event) => void,
}

const AccountOverview: React.Component<Props> = ({
  account,
  loading,
  match,
  onDepositETH,
  onRequestETH,
  onRequestLPT,
  onTransferLPT,
}: AccountOverviewProps): ReactElement => {
  const { ethBalance, tokenBalance } = account
  const me = !match.params.account
  return (
    <Wrapper>
      {/** ETH */}
      <TokenBox type="ETH" balance={ethBalance}>
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
      </TokenBox>
      {/** LPT */}
      <TokenBox type="LPT" balance={tokenBalance}>
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
      </TokenBox>
    </Wrapper>
  )
}

export default enhance(AccountOverview)
