/** @jsx jsx */
import React from 'react'
import { jsx, Flex, Styled } from 'theme-ui'
import * as Utils from 'web3-utils'
import { abbreviateNumber } from '../../lib/utils'
import { useWeb3Context } from 'web3-react'
import { useRouter } from 'next/router'
import List from '../../components/List'
import ListItem from '../../components/ListItem'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Spinner from '../../components/Spinner'
import Card from '../../components/Card'
import Unlink from '../../static/img/unlink.svg'
import { UnbondingLock } from '../../@types'
import Button from '../../components/Button'

const GET_DATA = gql`
  query($account: ID!) {
    delegator(id: $account) {
      id
      pendingStake
      bondedAmount
      status
      principal
      unbonded
      delegate {
        id
      }
      unbondingLocks {
        id
        amount
        withdrawRound
        delegate {
          id
        }
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
  const context = useWeb3Context()
  const isMyAccount = account == context.account

  const { data, loading, error } = useQuery(GET_DATA, {
    variables: {
      account: account.toLowerCase(),
    },
    notifyOnNetworkStatusChange: true,
    ssr: false,
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

  const pendingStakeTransactions: Array<
    UnbondingLock
  > = data.delegator.unbondingLocks.filter(
    (item: UnbondingLock) =>
      item.withdrawRound &&
      item.withdrawRound > parseInt(data.currentRound[0].id, 10),
  )
  const completedStakeTransactions: Array<
    UnbondingLock
  > = data.delegator.unbondingLocks.filter(
    (item: UnbondingLock) =>
      item.withdrawRound &&
      item.withdrawRound <= parseInt(data.currentRound[0].id, 10),
  )

  const LinkIcon = (
    <Flex
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1000,
        color: 'primary',
        bg: 'surface',
        width: 30,
        height: 30,
        mr: 2,
        border: '1px solid',
        borderColor: 'border',
      }}
    >
      <Unlink />
    </Flex>
  )

  return (
    <>
      <Card
        sx={{ mb: 2 }}
        title="Staked Towards"
        subtitle={
          <div
            sx={{
              fontSize: 5,
              fontWeight: 'text',
              color: 'text',
              lineHeight: 'heading',
            }}
          >
            {data.delegator.delegate.id.replace(
              data.delegator.delegate.id.slice(7, 37),
              '…',
            )}
          </div>
        }
      />
      <div
        sx={{
          display: 'grid',
          gridGap: 2,
          gridTemplateColumns: `repeat(auto-fit, minmax(128px, 1fr))`,
          mb: 5,
        }}
      >
        <Card
          sx={{ flex: 1, mb: 2 }}
          title="Total Staked"
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
                Math.max(
                  Utils.fromWei(data.delegator.bondedAmount),
                  Utils.fromWei(data.delegator.pendingStake),
                ),
                4,
              )}
              <span sx={{ ml: 1, fontSize: 1 }}>LPT</span>
            </div>
          }
        >
          <div sx={{ mt: 3 }}>
            <Flex sx={{ fontSize: 1, mb: 1, justifyContent: 'space-between' }}>
              Principal:{' '}
              <span sx={{ fontFamily: 'monospace' }}>
                {abbreviateNumber(Utils.fromWei(data.delegator.principal), 3)}
              </span>
            </Flex>
            <Flex sx={{ fontSize: 1, mb: 1, justifyContent: 'space-between' }}>
              Unstaked:{' '}
              <span sx={{ fontFamily: 'monospace' }}>
                {abbreviateNumber(
                  data.delegator.unbonded
                    ? Utils.fromWei(data.delegator.unbonded)
                    : 0,
                  3,
                )}
              </span>
            </Flex>
            <Flex sx={{ fontSize: 1, justifyContent: 'space-between' }}>
              Rewards:{' '}
              <span sx={{ fontFamily: 'monospace' }}>
                +
                {abbreviateNumber(
                  Utils.fromWei(data.delegator.pendingStake) -
                    (Utils.fromWei(data.delegator.principal) -
                      (data.delegator.unbonded
                        ? Utils.fromWei(data.delegator.unbonded)
                        : 0)),
                  3,
                )}
              </span>
            </Flex>
          </div>
        </Card>
        <Card
          sx={{ flex: 1, mb: 2 }}
          title="Equity"
          subtitle={
            <div
              sx={{
                fontSize: 5,
                color: 'text',
                lineHeight: 'heading',
                fontFamily: 'monospace',
              }}
            >
              {(
                (Utils.fromWei(data.delegator.pendingStake) /
                  Utils.fromWei(data.protocol.totalBondedToken)) *
                100
              ).toPrecision(2)}
              %
            </div>
          }
        ></Card>
      </div>
      {!!pendingStakeTransactions.length && (
        <List
          sx={{ mb: 6 }}
          header={<Styled.h4>Pending Unstake Transactions</Styled.h4>}
        >
          {pendingStakeTransactions.map(lock => (
            <ListItem key={lock.id} avatar={LinkIcon}>
              <Flex
                sx={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  Unstaking from{' '}
                  {lock.delegate.id.replace(lock.delegate.id.slice(7, 37), '…')}
                </div>
                <Flex sx={{ alignItems: 'center' }}>
                  {isMyAccount && (
                    <>
                      <Button
                        sx={{ py: 1, mr: 2, variant: 'buttons.secondary' }}
                      >
                        Rebond
                      </Button>
                    </>
                  )}
                  <div sx={{ ml: 3 }}>
                    {' '}
                    -{abbreviateNumber(Utils.fromWei(lock.amount), 3)} LPT
                  </div>
                </Flex>
              </Flex>
            </ListItem>
          ))}
        </List>
      )}
      <List header={<Styled.h4>Completed Unstake Transactions</Styled.h4>}>
        {!completedStakeTransactions.length && (
          <div sx={{ fontSize: 1, mt: 2 }}>No History</div>
        )}
        {completedStakeTransactions.map(lock => (
          <ListItem key={lock.id} avatar={LinkIcon}>
            <Flex
              sx={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                Unstaked from{' '}
                {lock.delegate.id.replace(lock.delegate.id.slice(7, 37), '…')}
              </div>

              <Flex sx={{ alignItems: 'center' }}>
                {isMyAccount && (
                  <>
                    <Button sx={{ py: 1, mr: 2, variant: 'buttons.secondary' }}>
                      Rebond
                    </Button>

                    <Button sx={{ py: 1, variant: 'buttons.secondary' }}>
                      Withdraw
                    </Button>
                  </>
                )}
                <div sx={{ ml: 3 }}>
                  {' '}
                  -{abbreviateNumber(Utils.fromWei(lock.amount), 3)} LPT
                </div>
              </Flex>
            </Flex>
          </ListItem>
        ))}
      </List>
    </>
  )
}
