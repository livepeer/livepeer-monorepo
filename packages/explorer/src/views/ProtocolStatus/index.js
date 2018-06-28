import * as React from 'react'
import { TextField } from 'rmwc/TextField'

import enhance from './enhance'
import { BasicModal } from '../../components'

const ProtocolStatus = ({ history, currentRound }) => {
  return (
    <BasicModal
      title="Protocol Status"
      onClose={() => {
        history.push(history.location.pathname)
      }}
    >
      {currentRound.loading ? null : (
        <div>
          <TextField
            readOnly
            dense
            fullwidth
            label="Current Block:"
            value={currentRound.data.id}
          />
          <TextField
            readOnly
            dense
            fullwidth
            label="Next Round starts at Block Number:"
            value={
              Number(currentRound.data.id) + Number(currentRound.data.length)
            }
          />
        </div>
      )}
    </BasicModal>
  )
}

export default enhance(ProtocolStatus)
