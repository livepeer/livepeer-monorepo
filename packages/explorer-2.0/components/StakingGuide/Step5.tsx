import { useEffect, useContext } from 'react'
import { Styled } from 'theme-ui'
import Button from '../Button'
import { useWeb3Mutation } from '../../hooks'
import Spinner from '../Spinner'
import { Flex } from 'theme-ui'
import Router from 'next/router'
import gql from 'graphql-tag'
import { MAXIUMUM_VALUE_UINT256 } from '../../lib/utils'
import { useWeb3React } from '@web3-react/core'
import { MutationsContext } from '../../contexts'
import { useQuery } from '@apollo/react-hooks'

export default ({ goTo, nextStep }) => {
  const accountQuery = require('../../queries/account.gql')
  const context = useWeb3React()
  const { approve }: any = useContext(MutationsContext)
  const { data: dataMyAccount } = useQuery(accountQuery, {
    variables: {
      account: context?.account?.toLowerCase(),
    },
    pollInterval: 10000,
    skip: !context.active, // skip this query if wallet not connected
    ssr: false,
  })

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
