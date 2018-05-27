import * as React from 'react'
import { BasicModal } from '../../components'

export default () => (
  <BasicModal title="Protocol Upgrade In Progress">
    <p style={{ lineHeight: 1.5 }}>
      The Livepeer protocol is paused due to a bug fixing upgrade as of 5/26/18
      9:00pm EDT. The estimated duration of the pause is 2 days. For more
      information, please read this{' '}
      <a
        href="https://forum.livepeer.org/t/protocol-paused-for-bug-fix-upgrade-5-26-18-9-00pm-edt/265"
        target="_blank"
      >
        forum post
      </a>
    </p>
  </BasicModal>
)
