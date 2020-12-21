import { useState, useEffect } from 'react'
import { Flex, Styled } from 'theme-ui'
import Router from 'next/router'
import Copy from '../../public/img/copy.svg'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Button from '../Button'
import Utils from 'web3-utils'
import { useWeb3React } from '@web3-react/core'
import { gql, useApolloClient, useQuery } from '@apollo/client'
import accountQuery from '../../queries/account.gql'
import { abbreviateNumber } from '../../lib/utils'

const Step4 = ({ goTo, nextStep }) => {
  const client = useApolloClient()
  const context = useWeb3React()
  const [copied, setCopied] = useState(false)
  const { data: dataMyAccount } = useQuery(accountQuery, {
    variables: {
      account: context?.account?.toLowerCase(),
    },
    skip: !context.active,
    ssr: false,
  })

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 4000)
    }
  }, [copied])

  return (
    <div sx={{ pb: 1 }}>
      <Styled.h2 sx={{ mb: 2 }}>Swap ETH for LPT</Styled.h2>
      <div sx={{ lineHeight: 1.5 }}>
        <div sx={{ mb: 2 }}>
          Don't have ETH? Get some on{' '}
          <a
            href="https://coinbase.com"
            target="__blank"
            sx={{
              color: 'rgba(22, 82, 240)',
              textDecoration: 'underline',
            }}
          >
            Coinbase
          </a>{' '}
          and send to your address.
        </div>
        <div>My Address:</div>
        <div
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            fontFamily: 'monospace',
            mb: 3,
          }}
        >
          <CopyToClipboard
            text={context.account}
            onCopy={() => setCopied(true)}
          >
            <Flex sx={{ alignItems: 'center' }}>
              <span sx={{ fontSize: 2, fontFamily: 'monospace', mr: 1 }}>
                {context.account.replace(context.account.slice(7, 37), '…')}
              </span>
              <Copy
                sx={{
                  mr: 1,
                  cursor: 'pointer',
                  width: 14,
                  height: 14,
                  color: 'text',
                }}
              />
            </Flex>
          </CopyToClipboard>
          {copied && <span sx={{ fontSize: 12, color: 'text' }}>Copied</span>}
        </div>
      </div>

      <div sx={{ fontFamily: 'monospace', mb: 1 }}>
        ETH Balance:{' '}
        <span sx={{ fontWeight: 'bold' }}>
          {abbreviateNumber(
            +Utils.fromWei(dataMyAccount?.account?.ethBalance),
            2,
          )}
        </span>
      </div>
      <div sx={{ fontFamily: 'monospace' }}>
        LPT Balance:{' '}
        <span sx={{ fontWeight: 'bold' }}>
          {dataMyAccount?.account &&
            abbreviateNumber(
              +Utils.fromWei(dataMyAccount?.account?.tokenBalance),
              2,
            )}
        </span>
      </div>
      <Button
        disabled={dataMyAccount?.account.tokenBalance === '0'}
        sx={{ position: 'absolute', right: 30, bottom: 16 }}
        onClick={async () => {
          client.writeQuery({
            query: gql`
              query {
                uniswapModalOpen
              }
            `,
            data: {
              uniswapModalOpen: false,
            },
          })
          if (dataMyAccount?.account.allowance === '0') {
            goTo(nextStep)
          } else {
            await Router.push('/')
            goTo(nextStep + 1)
          }
        }}
      >
        Next
      </Button>
    </div>
  )
}

export default Step4
