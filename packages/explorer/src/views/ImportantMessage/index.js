import * as React from 'react'
import enhance from './enhance'
import { BasicModal } from '../../components'

const ImportantMessage = ({ protocol }) => {
  console.log('Protocol paused: ' + protocol.data.paused)

  return !protocol.data.paused ? null : (
    <BasicModal title="Protocol Paused">
      <p style={{ lineHeight: 1.5 }}>
        The Livepeer protocol is currently paused for an upgrade. For more
        information, please visit the Livepeer{' '}
        <a href="https://forum.livepeer.org/" target="_blank">
          forum
        </a>.
      </p>
    </BasicModal>
  )
}

export default enhance(ImportantMessage)
