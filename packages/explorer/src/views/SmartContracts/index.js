import * as React from 'react'
import { TextField } from 'rmwc/TextField'
import { BasicModal } from '../../components'

export default ({ history }) => (
  <BasicModal
    title="Livepeer Smart Contract Addresses"
    onClose={() => {
      history.push(history.location.pathname)
    }}
  >
    {Object.entries(window.livepeer.config.contracts)
      .filter(
        ([name, { address }]) =>
          address !== '0x0000000000000000000000000000000000000000',
      )
      .map(([name, { address }]) => (
        <TextField
          key={name}
          readOnly
          dense
          fullwidth
          label={name}
          value={address}
        />
      ))}
  </BasicModal>
)
