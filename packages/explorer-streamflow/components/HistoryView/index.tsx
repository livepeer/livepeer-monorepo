/** @jsx jsx */
import { jsx, Flex, Box } from 'theme-ui'
import React from 'react'
import Utils from 'web3-utils'
import { abbreviateNumber } from '../../lib/utils'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Spinner from '../../components/Spinner'
import List from '../List'
import ListItem from '../ListItem'
import Unlink from '../../static/img/unlink.svg'
import Link from '../../static/img/link.svg'
import Claim from '../../static/img/claim.svg'
import LPT from '../../static/img/lpt.svg'
import Approve from '../../static/img/approve.svg'
import Play from '../../static/img/play.svg'
import moment from 'moment'

const GET_DATA = gql`
  query($account: String!) {
    transactions(
      orderBy: timestamp
      orderDirection: desc
      where: { from: $account }
    ) {
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
        amount
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
        startRound {
          id
        }
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
    <>
      <List sx={{ mb: 6 }}>
        {data.transactions.map((transaction: any, i: number) =>
          renderSwitch(transaction, i),
        )}
      </List>
    </>
  )
}

function renderSwitch(transaction: any, i: number) {
  switch (transaction.__typename) {
    case 'ApprovalEvent':
      return (
        <ListItem key={i} avatar={<Approve sx={{ color: 'primary', mr: 2 }} />}>
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>Approved LPT for Staking</Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {' '}
              <span sx={{ fontFamily: 'monospace' }}>
                {transaction.amount ==
                '10000000000000000000000000000000000000000000000000000000000'
                  ? 'Approved'
                  : abbreviateNumber(Utils.fromWei(transaction.amount), 3) +
                    ' LPT'}
              </span>{' '}
            </div>
          </Flex>
        </ListItem>
      )
    case 'BondEvent':
      return (
        <ListItem key={i} avatar={<Link sx={{ color: 'primary', mr: 2 }} />}>
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>
                Bonded to{' '}
                {transaction.newDelegate.id.replace(
                  transaction.newDelegate.id.slice(7, 37),
                  '…',
                )}
              </Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {' '}
              <span sx={{ fontFamily: 'monospace' }}>
                +
                {abbreviateNumber(
                  Utils.fromWei(transaction.additionalAmount),
                  3,
                )}
              </span>{' '}
              LPT
            </div>
          </Flex>
        </ListItem>
      )
    case 'ClaimEarningsEvent':
      return (
        <ListItem
          key={i}
          avatar={
            <Claim sx={{ width: 16, height: 16, color: 'primary', mr: 2 }} />
          }
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>Claimed Earnings</Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ textAlign: 'right', fontSize: 1, ml: 3 }}>
              <Box>
                <span sx={{ fontFamily: 'monospace' }}>
                  {abbreviateNumber(Utils.fromWei(transaction.rewardTokens), 3)}
                </span>{' '}
                LPT
              </Box>
              <Box>
                <span sx={{ fontFamily: 'monospace' }}>
                  {abbreviateNumber(Utils.fromWei(transaction.fees), 3)}
                </span>{' '}
                ETH
              </Box>
            </div>
          </Flex>
        </ListItem>
      )
    case 'InitializeRoundEvent':
      return (
        <ListItem
          key={i}
          avatar={
            <Play sx={{ width: 20, height: 20, color: 'primary', mr: 2 }} />
          }
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>Initialized round</Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              Round #
              <span sx={{ fontFamily: 'monospace' }}>
                {transaction.round.id}
              </span>
            </div>
          </Flex>
        </ListItem>
      )
    case 'RebondEvent':
      return (
        <ListItem key={i} avatar={<Link sx={{ color: 'primary', mr: 2 }} />}>
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>
                Rebonded to{' '}
                {transaction.delegate.id.replace(
                  transaction.delegate.id.slice(7, 37),
                  '…',
                )}
              </Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {' '}
              <span sx={{ fontFamily: 'monospace' }}>
                +{abbreviateNumber(Utils.fromWei(transaction.amount), 3)}
              </span>{' '}
              LPT
            </div>
          </Flex>
        </ListItem>
      )
    case 'UnbondEvent':
      return (
        <ListItem key={i} avatar={<Unlink sx={{ color: 'primary', mr: 2 }} />}>
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>
                Unbonded from{' '}
                {transaction.delegate.id.replace(
                  transaction.delegate.id.slice(7, 37),
                  '…',
                )}
              </Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {' '}
              <span sx={{ fontFamily: 'monospace' }}>
                -{abbreviateNumber(Utils.fromWei(transaction.amount), 3)}
              </span>{' '}
              LPT
            </div>
          </Flex>
        </ListItem>
      )
    case 'RewardEvent':
      return (
        <ListItem
          key={i}
          avatar={
            <LPT sx={{ width: 20, height: 20, color: 'primary', mr: 2 }} />
          }
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>Claimed Inflationary Token Reward</Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {' '}
              <span sx={{ fontFamily: 'monospace' }}>
                +{abbreviateNumber(Utils.fromWei(transaction.rewardTokens), 3)}
              </span>{' '}
              LPT
            </div>
          </Flex>
        </ListItem>
      )
    case 'TranscoderUpdatedEvent':
      return (
        <ListItem
          key={i}
          avatar={
            <LPT sx={{ width: 20, height: 20, color: 'primary', mr: 2 }} />
          }
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>Updated Orchestrator Cut</Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ textAlign: 'right', fontSize: 1, ml: 3 }}>
              <Box>
                <span sx={{ fontFamily: 'monospace' }}>
                  {transaction.pendingRewardCut / 10000}% R
                </span>{' '}
              </Box>
              <Box>
                <span sx={{ fontFamily: 'monospace' }}>
                  {(100 - transaction.pendingFeeShare / 10000)
                    .toFixed(2)
                    .replace(/[.,]00$/, '')}
                  % F
                </span>{' '}
              </Box>
            </div>
          </Flex>
        </ListItem>
      )
    case 'WithdrawFeesEvent':
      return <ListItem key={i}>WithdrawFeesEvent</ListItem>
    case 'WithdrawStakeEvent':
      return (
        <ListItem
          key={i}
          avatar={
            <LPT sx={{ width: 20, height: 20, color: 'primary', mr: 2 }} />
          }
        >
          <Flex
            sx={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Box>Withdrew Unstaked Tokens</Box>
              <Box sx={{ fontSize: 12, color: 'muted' }}>
                {moment
                  .unix(transaction.timestamp)
                  .format('MM/DD/YYYY h:mm:ss a')}{' '}
                -- Round #{transaction.round.id}
              </Box>
            </Box>
            <div sx={{ fontSize: 1, ml: 3 }}>
              {' '}
              <span sx={{ fontFamily: 'monospace' }}>
                +{abbreviateNumber(Utils.fromWei(transaction.amount), 3)}
              </span>{' '}
              LPT
            </div>
          </Flex>
        </ListItem>
      )
    default:
      return null
  }
}
