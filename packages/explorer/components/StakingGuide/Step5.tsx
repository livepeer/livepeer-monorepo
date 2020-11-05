import { useEffect, useContext } from 'react'
import { Styled } from 'theme-ui'
import Button from '../Button'
import { usePageVisibility, useWeb3Mutation } from '../../hooks'
import Router from 'next/router'
import { MAXIUMUM_VALUE_UINT256 } from '../../lib/utils'
import { useWeb3React } from '@web3-react/core'
import { MutationsContext } from '../../contexts'
import { useQuery } from '@apollo/react-hooks'
import accountQuery from '../../queries/account.gql'

export default ({ goTo, nextStep }) => {
  const context = useWeb3React()
  const isVisible = usePageVisibility()
  const pollInterval = 20000
  const { approve }: any = useContext(MutationsContext)
  const { data: dataMyAccount, startPolling, stopPolling } = useQuery(
    accountQuery,
    {
      variables: {
        account: context?.account?.toLowerCase(),
      },
      pollInterval,
      skip: !context.active, // skip this query if wallet not connected
      ssr: false,
    },
  )

  useEffect(() => {
    if (!isVisible) {
      stopPolling()
    } else {
      startPolling(pollInterval)
    }
  }, [isVisible])

  useEffect(() => {
    async function goToNextStep() {
      if (dataMyAccount?.account?.allowance !== '0') {
        await Router.push('/')
        goTo(nextStep)
      }
    }
    goToNextStep()
  }, [dataMyAccount?.account?.allowance])

  return (
    <div sx={{ py: 1 }}>
      <Styled.h2 sx={{ mb: 2 }}>Unlock Livepeer Tokens</Styled.h2>
      <Styled.p>
        Allow Livepeer smart contracts to transfer Livepeer tokens on your
        behalf?
      </Styled.p>

      <Button
        onClick={async () => {
          try {
            await approve({
              variables: {
                type: 'bond',
                amount: MAXIUMUM_VALUE_UINT256,
              },
            })
          } catch (e) {
            return {
              error: e.message.replace('GraphQL error: ', ''),
            }
          }
        }}
        sx={{ position: 'absolute', right: 30, bottom: 16 }}
      >
        Unlock LPT
      </Button>
    </div>
  )
}
