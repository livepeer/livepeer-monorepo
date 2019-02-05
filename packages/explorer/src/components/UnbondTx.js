import * as React from 'react'
import { Button, Tooltip } from './index'
import { formatBalance, formatRoundsToDate } from '../utils'
const UnbondTx = ({
  accountId,
  amount,
  currentRound,
  history,
  id,
  isMe,
  processRebond,
  processWithdraw,
  withdrawRound,
}) => {
  const canWithdraw = withdrawRound <= currentRound
  return (
    <div
      style={{
        display: 'flex',
        margin: 0,
        paddingLeft: 20,
        textAlign: 'left',
        minWidth: '100%',
        justifyContent: 'flex-start',
        flexFlow: 'row wrap',
      }}
    >
      <div
        style={{
          textAlign: 'left',
          minWidth: '60%',
          justifyContent: 'flex-start',
        }}
      >
        <h3>
          <strong>{formatBalance(amount)} LPT</strong> <br />{' '}
          <span
            style={{ fontSize: 12, marginTop: canWithdraw ? '0px' : '-10px' }}
          >
            {canWithdraw
              ? `The unbonding period has completed${
                  isMe
                    ? ' and you can withdraw your LPT'
                    : ' for this amount of LPT'
                }.`
              : isMe
              ? `You will be able to withdraw approximately on
                 ${formatRoundsToDate(withdrawRound - currentRound)}.`
              : `This amount of LPT can be withdrawn on
                  ${formatRoundsToDate(withdrawRound - currentRound)}.`}
          </span>
        </h3>
      </div>
      {isMe && (
        <div
          style={{
            minWidth: '40%',
            justifyContent: 'flex-start',
          }}
        >
          {withdrawRound <= currentRound ? (
            <Button
              onClick={() =>
                processWithdraw({ hash: `#/withdraw/${id}`, accountId })
              }
            >
              Withdraw
            </Button>
          ) : (
            <Tooltip
              text={`The unbonding period is 7 days. You will be
                     able to withdraw on ${formatRoundsToDate(
                       withdrawRound - currentRound,
                     )}`}
            >
              <span>
                <Button className="disabled">Withdraw</Button>
              </span>
            </Tooltip>
          )}

          <Button
            className="bond-token primary"
            onClick={() => processRebond({ hash: `#/rebond/${id}`, accountId })}
          >
            <span>rebond</span>
            <span style={{ marginLeft: 8 }}>&rarr;</span>
          </Button>
        </div>
      )}
    </div>
  )
}

export default UnbondTx
