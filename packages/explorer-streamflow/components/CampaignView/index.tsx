/** @jsx jsx */
import React from 'react'
import { jsx, Flex } from 'theme-ui'
import * as Utils from 'web3-utils'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Spinner from '../Spinner'
import Card from '../Card'
import { abbreviateNumber } from '../../lib/utils'

const GET_DATA = gql`
  query($account: ID!) {
    delegator(id: $account) {
      id
      pendingStake
      status
      delegate {
        id
      }
    }
    transcoder(id: $account) {
      id
      active
      feeShare
      rewardCut
      status
      active
      totalStake
      pools(first: 30, orderBy: id, orderDirection: desc) {
        rewardTokens
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

  if (data && !data.transcoder) {
    return null
  }

  let callsMade =
    data && data.transcoder.pools.filter(r => r.rewardTokens != null).length
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
        <>
          <div
            sx={{
              display: 'grid',
              gridGap: 2,
              gridTemplateColumns: `repeat(auto-fit, minmax(128px, 1fr))`,
            }}
          >
            <Card
              sx={{ flex: 1, mb: 2 }}
              title="Total Stake"
              subtitle={
                <div
                  sx={{
                    fontSize: 5,
                    color: 'text',
                    lineHeight: 'heading',
                    fontFamily: 'monospace',
                  }}
                >
                  {abbreviateNumber(
                    Utils.fromWei(data.transcoder.totalStake),
                    4,
                  )}
                  <span sx={{ ml: 1, fontSize: 1 }}>LPT</span>
                </div>
              }
            />
            <Card
              sx={{ flex: 1, mb: 2 }}
              title="Reward Cut"
              subtitle={
                <div
                  sx={{
                    fontSize: 5,
                    color: 'text',
                    lineHeight: 'heading',
                    fontFamily: 'monospace',
                  }}
                >
                  {parseInt(data.transcoder.rewardCut, 10) / 10000}%
                </div>
              }
            />
            <Card
              sx={{ flex: 1, mb: 2 }}
              title="Fee Cut"
              subtitle={
                <div
                  sx={{
                    fontSize: 5,
                    color: 'text',
                    lineHeight: 'heading',
                    fontFamily: 'monospace',
                  }}
                >
                  {100 - parseInt(data.transcoder.feeShare, 10) / 10000}%
                </div>
              }
            />
          </div>
          <Card
            sx={{ mb: 2 }}
            title="Reward Calls"
            subtitle={
              <Flex
                sx={{
                  alignItems: 'center',
                  fontSize: 5,
                  color: 'text',
                  lineHeight: 'heading',
                  fontFamily: 'monospace',
                }}
              >
                {/* {callsMade / data.transcoder.pools.length === 1 && (
                  <div
                    sx={{
                      mr: 3,
                      fontSize: 5,
                      color: 'transparent',
                      textShadow: '0 0 0 rgba(255, 255, 255, .87)',
                    }}
                  >
                    💯
                  </div>
                )} */}
                {callsMade}/{data.transcoder.pools.length}
              </Flex>
            }
          />
        </>
      )}
    </div>
  )
}
