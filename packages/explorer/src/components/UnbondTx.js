import * as React from 'react'
import { Button, Tooltip } from './index'

const UnbondTxComponent = ({
  amount,
  currentRound,
  withdrawRound,
  history,
  id,
  accountId,
}) => (
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
        <strong>{amount / 10e17} LPT</strong> <br />{' '}
        <span style={{ fontSize: 12, marginTop: '-10px' }}>
          you can withdraw at round #{withdrawRound}
        </span>
      </h3>
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
            onClick={e => {
              e.preventDefault()
              history.push({ hash: `#/withdraw/${id}`, state: { accountId } })
            }}
          >
            Withdraw
          </Button>
        </Tooltip>
      ) : (
        <Tooltip text="The unbonding period is 7 days you will be able to withdraw later">
          <Button disabled>Withdraw</Button>
        </Tooltip>
      )}

      <Button
        className="bond-token primary"
        onClick={e => {
          e.preventDefault()
          history.push({ hash: `#/rebond/${id}`, state: { accountId } })
        }}
      >
        <span>rebond</span>
        <span style={{ marginLeft: 8 }}>&rarr;</span>
      </Button>
    </div>
  </div>
)

export default UnbondTxComponent
