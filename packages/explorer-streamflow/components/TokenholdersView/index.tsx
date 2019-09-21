/** @jsx jsx */
import React from 'react'
import { jsx, Flex } from 'theme-ui'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Spinner from '../Spinner'
import Tokenholders from '../Tokenholders'

const GET_DATA = gql`
  query($account: ID!) {
    transcoder(id: $account) {
      id
      rewardCut
      feeShare
      totalStake
      active
      delegators {
        pendingStake
        id
      }
    }
    protocol {
      totalTokenSupply
      totalBondedToken
    }
    currentRound: rounds(first: 1, orderBy: timestamp, orderDirection: desc) {
      id
    }
  }
`

export default () => {
  const router = useRouter()
  const query = router.query
  const account = query.account as string

  const { data, loading, error } = useQuery(GET_DATA, {
    variables: {
      account: account.toLowerCase(),
      address: account.toLowerCase(),
    },
    notifyOnNetworkStatusChange: true,
  })

  if (error) {
    console.error(error)
  }

  return (
    <div>
      {loading ? (
        <Flex
          sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner />
        </Flex>
      ) : (
        !!data.transcoder.delegators.length && (
          <Tokenholders
            protocol={data.protocol}
            delegators={data.transcoder.delegators}
          />
        )
      )}
    </div>
  )
}
