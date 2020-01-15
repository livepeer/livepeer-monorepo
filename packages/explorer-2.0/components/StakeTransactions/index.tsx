/** @jsx jsx */
import React from 'react'
import { jsx, Flex, Styled } from 'theme-ui'
import * as Utils from 'web3-utils'
import Unlink from '../../public/img/unlink.svg'
import { abbreviateNumber } from '../../lib/utils'
import { UnbondingLock } from '../../@types'
import List from '../List'
import ListItem from '../ListItem'
import Restake from '../Restake'
import RestakeFromUnstaked from '../RestakeFromUnstaked'
import WithdrawStake from '../WithdrawStake'

export default ({ delegator, currentRound, isMyAccount }) => {
  const pendingStakeTransactions: Array<UnbondingLock> = delegator.unbondingLocks.filter(
    (item: UnbondingLock) =>
      item.withdrawRound && item.withdrawRound > parseInt(currentRound.id, 10),
  )
  const completedStakeTransactions: Array<UnbondingLock> = delegator.unbondingLocks.filter(
    (item: UnbondingLock) =>
      item.withdrawRound && item.withdrawRound <= parseInt(currentRound.id, 10),
  )
  const isBonded = !!delegator.delegate

  return (
    <>
      {!!pendingStakeTransactions.length && (
        <List
          sx={{ mb: 6 }}
          header={<Styled.h4>Pending Transactions</Styled.h4>}
        >
          {pendingStakeTransactions.map(lock => (
            <ListItem
              key={lock.id}
              avatar={<Unlink sx={{ color: 'primary', mr: 2 }} />}
            >
              <Flex
                sx={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div sx={{ mb: '2px' }}>
                    Unstaking from{' '}
                    {lock.delegate.id.replace(
                      lock.delegate.id.slice(7, 37),
                      '…',
                    )}
                  </div>
                  <div sx={{ color: 'muted', fontSize: 0 }}>
                    Tokens will be available for withdrawal in approximately{' '}
                    {lock.withdrawRound - parseInt(currentRound.id, 10)} days.
                  </div>
                </div>
                <Flex sx={{ alignItems: 'center' }}>
                  {isMyAccount &&
                    (isBonded ? (
                      <Restake lock={lock} />
                    ) : (
                      <RestakeFromUnstaked lock={lock} />
                    ))}
                  <div sx={{ ml: 3 }}>
                    {' '}
                    -
                    <span sx={{ fontFamily: 'monospace' }}>
                      {abbreviateNumber(Utils.fromWei(lock.amount), 4)}
                    </span>{' '}
                    LPT
                  </div>
                </Flex>
              </Flex>
            </ListItem>
          ))}
        </List>
      )}
      {!!completedStakeTransactions.length && (
        <List header={<Styled.h4>Available for Withdrawal</Styled.h4>}>
          {completedStakeTransactions.map(lock => (
            <ListItem
              key={lock.id}
              avatar={<Unlink sx={{ color: 'primary', mr: 2 }} />}
            >
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
                      {isBonded ? (
                        <Restake lock={lock} />
                      ) : (
                        <RestakeFromUnstaked lock={lock} />
                      )}
                      <WithdrawStake lock={lock} />
                    </>
                  )}
                  <div sx={{ ml: 3 }}>
                    {' '}
                    -
                    <span sx={{ fontFamily: 'monospace' }}>
                      {abbreviateNumber(Utils.fromWei(lock.amount), 3)}
                    </span>{' '}
                    LPT
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
