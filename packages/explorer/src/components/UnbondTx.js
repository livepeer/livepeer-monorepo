import * as React from 'react'
import { Button, Tooltip } from './index'
import { formatBalance, formatRoundsToDate } from '../utils'
const UnbondTx = ({
  amount,
  currentRound,
  withdrawRound,
  history,
  accountId,
  id,
  processRebond,
  processWithdraw,
}) => {
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
        {withdrawRound <= currentRound ? (
          <h3>
            <strong>{formatBalance(amount)} LPT</strong> <br />{' '}
            <span style={{ fontSize: 12 }}>
              The unbonding period has completed and you can withdraw your LPT.
            </span>
          </h3>
        ) : (
          <h3>
            <strong>{formatBalance(amount)} LPT</strong> <br />{' '}
            <span style={{ fontSize: 12, marginTop: '-10px' }}>
              You will be able to unbond approximately on{' '}
              {formatRoundsToDate(withdrawRound - currentRound)}.
            </span>
          </h3>
        )}
      </div>
      <div
        style={{
          minWidth: '40%',
          justifyContent: 'flex-start',
        }}
      >
        {withdrawRound <= currentRound ? (
          <Tooltip text="You can withdraw now">
            <Button
              onClick={() =>
                processWithdraw({ hash: `#/withdraw/${id}`, accountId })
              }
            >
              Withdraw
            </Button>
          </Tooltip>
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
    </div>
  )
}

export default UnbondTx
