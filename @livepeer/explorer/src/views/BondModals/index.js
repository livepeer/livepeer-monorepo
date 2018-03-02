import * as React from 'react'
import {
  BondErrorModal,
  BondSuccessModal,
  BondTransactionModal,
} from '../../components'
import enhance from './enhance'
import { sleep } from '../../utils'

const BondModalsView = ({ transactions: tx, approve, bond, bindToStatus }) => {
  const status =
    tx.findWhere({
      active: true,
      type: 'BondStatus',
    }) || tx.empty('BondStatus')
  const bondedAmount = '999'
  const tokenBalance = '999'
  const mockBond = async () => {
    await sleep(1000)
    // throw new Error('Bond Fail!')
    return {
      transaction: {
        hash: '0xf00',
      },
    }
  }
  const onClose = () => tx.delete(status)
  const onBond = bindToStatus(mockBond, status)
  return (
    <React.Fragment>
      <BondErrorModal
        action="bond"
        error={status.error}
        onClose={onClose}
        test={status.active && status.error}
        title="Bond Failed"
      />
      <BondSuccessModal
        delegateAddress={status.id}
        onClose={onClose}
        test={status.active && status.done && !status.error}
        title="Bonding Complete"
      />
      <BondTransactionModal
        bondedAmount={bondedAmount}
        delegateAddress={status.id}
        loading={status.submitted}
        onBond={onBond}
        onClose={onClose}
        test={status.active && !status.done}
        tokenBalance={tokenBalance}
      />
    </React.Fragment>
  )
}

export default enhance(BondModalsView)
