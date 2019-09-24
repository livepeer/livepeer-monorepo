/** @jsx jsx */
import React from 'react'
import { jsx, Flex } from 'theme-ui'
import * as Utils from 'web3-utils'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import CircularProgress from '@material-ui/core/CircularProgress'
import Card from '../../components/Card'
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
      rewardCut
      feeShare
      totalStake
      active
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

  if (!data.transcoder) {
    return null
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
          <div sx={{ color: 'primary' }}>
            <CircularProgress size={24} color="inherit" />
          </div>
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
            title="Reward Calls Made"
            subtitle={
              <div
                sx={{
                  fontSize: 5,
                  color: 'text',
                  lineHeight: 'heading',
                  fontFamily: 'monospace',
                }}
              >
                30/30
              </div>
            }
          />
        </>
      )}
    </div>
  )
}
