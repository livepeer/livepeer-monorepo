// @flow
import * as React from 'react'
import { BasicModal } from '../../components'

type RebondProps = {
  history: History,
  amount: number,
}

const Rebond: React.ComponentType<RebondProps> = ({ history, amount }) => {
  const closeModal = () => history.goBack()

  return (
    <React.Fragment>
      <BasicModal title="Rebond" onClose={closeModal}>
        <h5>{`Rebond ${amount} LPT to the most recent transcoder`}</h5>
        <p>
          Note: You can only bond to one transcoder at a time. To bond to a
          different transcoder, bond to this transcoder and then on the
          transcoders page, bond all LPT to a different transcoder
        </p>
      </BasicModal>
    </React.Fragment>
  )
}

export default Rebond
