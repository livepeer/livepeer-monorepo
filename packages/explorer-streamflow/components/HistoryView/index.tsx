/** @jsx jsx */
import { jsx, Flex, Styled } from 'theme-ui'
import * as Utils from 'web3-utils'
import { abbreviateNumber } from '../../lib/utils'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Spinner from '../../components/Spinner'
import List from '../List'
import ListItem from '../ListItem'

const GET_DATA = gql`
  query($account: String!) {
    transactions(orderBy: timestamp, where: { from: $account }) {
      hash
      timestamp
      ... on BondEvent {
        __typename
        delegator {
          id
        }
        newDelegate {
          id
        }
        oldDelegate {
          id
        }
        round {
          id
        }
        additionalAmount
      }
      ... on UnbondEvent {
        __typename
        round {
          id
        }
        delegate {
          id
        }
      }
      ... on RebondEvent {
        __typename
        delegate {
          id
        }
        amount
        round {
          id
        }
      }
      ... on TranscoderUpdatedEvent {
        __typename
        pendingRewardCut
        pendingFeeShare
        round {
          id
        }
      }
      ... on RewardEvent {
        __typename
        rewardTokens
        round {
          id
        }
      }
      ... on ClaimEarningsEvent {
        __typename
        startRound
        endRound {
          id
        }
        rewardTokens
        fees
        round {
          id
        }
      }
      ... on WithdrawStakeEvent {
        __typename
        amount
        round {
          id
        }
      }
      ... on WithdrawFeesEvent {
        __typename
        amount
        round {
          id
        }
      }
      ... on ApprovalEvent {
        __typename
        round {
          id
        }
        amount
      }
      ... on InitializeRoundEvent {
        __typename
        round {
          id
        }
      }
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
    },
    ssr: false,
    pollInterval: 10000,
  })

  if (error) {
    console.error(error)
  }

  if (loading) {
    return (
      <Flex
        sx={{
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
    <>
      <List sx={{ mb: 6 }}>
        {data.transactions.map((transaction, i: number) => (
          <ListItem key={i}>
            <Flex
              sx={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {transaction.__typename}
            </Flex>
          </ListItem>
        ))}
      </List>
    </>
  )
}
