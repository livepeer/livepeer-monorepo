/** @jsx jsx */
import React from 'react'
import { jsx, Flex, Styled } from 'theme-ui'
import * as Utils from 'web3-utils'
import Unlink from '../../static/img/unlink.svg'
import { abbreviateNumber } from '../../lib/utils'
import { UnbondingLock } from '../../@types'
import List from '../List'
import ListItem from '../ListItem'
import Restake from '../Restake'
import WithdrawStake from '../WithdrawStake'

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

export default ({ delegator, currentRound, isMyAccount }) => {
  const pendingStakeTransactions: Array<
    UnbondingLock
  > = delegator.unbondingLocks.filter(
    (item: UnbondingLock) =>
      item.withdrawRound && item.withdrawRound > parseInt(currentRound.id, 10),
  )
  const completedStakeTransactions: Array<
    UnbondingLock
  > = delegator.unbondingLocks.filter(
    (item: UnbondingLock) =>
      item.withdrawRound && item.withdrawRound <= parseInt(currentRound.id, 10),
  )
  return (
    <>
      {!!pendingStakeTransactions.length && (
        <List
          sx={{ mb: 6 }}
          header={<Styled.h4>Pending Stake Transactions</Styled.h4>}
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
                  {isMyAccount && <Restake lock={lock} />}
                  <div sx={{ ml: 3 }}>
                    {' '}
                    -{abbreviateNumber(Utils.fromWei(lock.amount), 4)} LPT
                  </div>
                </Flex>
              </Flex>
            </ListItem>
          ))}
        </List>
      )}
      {!!completedStakeTransactions.length && (
        <List header={<Styled.h4>Available For Withdrawal</Styled.h4>}>
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
                      <Restake lock={lock} />
                      <WithdrawStake lock={lock} />
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
    </>
  )
}
