/** @jsx jsx */
import React from 'react'
import { jsx, Flex } from 'theme-ui'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Spinner from '../Spinner'
import Tokenholders from '../Tokenholders'
import InfiniteScroll from 'react-infinite-scroll-component'

const GET_DATA = gql`
  query($account: ID!, $first: Int!, $skip: Int!) {
    transcoder(id: $account) {
      id
      rewardCut
      feeShare
      totalStake
      active
      delegators(
        first: $first
        skip: $skip
        orderBy: bondedAmount
        orderDirection: desc
      ) {
        pendingStake
        bondedAmount
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

  const { data, loading, error, fetchMore, stopPolling } = useQuery(GET_DATA, {
    variables: {
      account: account.toLowerCase(),
      address: account.toLowerCase(),
      first: 10,
      skip: 0,
    },
    ssr: false,
    pollInterval: 5000,
    notifyOnNetworkStatusChange: true,
  })

  if (error) {
    console.error(error)
  }

  if (loading && !data) {
    return (
      <Flex
        sx={{
          pt: 4,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spinner />
      </Flex>
    )
  }

  return (
    <InfiniteScroll
      sx={{ overflow: 'hidden !important' }}
      scrollThreshold={0.8}
      dataLength={data && data.transcoder.delegators.length}
      next={() => {
        stopPolling()
        if (!loading) {
          fetchMore({
            variables: {
              skip: data.transcoder.delegators.length,
            },
            updateQuery: (previousResult: any, { fetchMoreResult }: any) => {
              if (!fetchMoreResult) {
                return previousResult
              }
              return {
                ...previousResult,
                // Append the new posts results to the old one
                transcoder: {
                  ...previousResult.transcoder,
                  delegators: [
                    ...previousResult.transcoder.delegators,
                    ...fetchMoreResult.transcoder.delegators,
                  ],
                },
              }
            },
          })
        }
      }}
      hasMore={true}
    >
      <div sx={{ pt: 4, position: 'relative', pb: 6 }}>
        <Tokenholders
          protocol={data.protocol}
          delegators={data.transcoder.delegators}
        />

        {loading && (
          <Flex
            sx={{
              position: 'absolute',
              transform: 'translateX(-50%)',
              left: '50%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner />
          </Flex>
        )}
      </div>
    </InfiniteScroll>
  )
}
