import React from 'react'
import { Icon } from 'rmwc/Icon'
import Tooltip from '../../components/Tooltip'

const TableData = ({ afterData, beforeData, colSpan, help, tableData }) => {
  return (
    <td colSpan={colSpan}>
      <label
        style={{
          alignItems: 'center',
          display: 'flex',
          margin: 0,
        }}
      >
        {beforeData && <strong>{beforeData}</strong>}
        <span style={{ textTransform: 'uppercase' }}>{tableData}</span>
        {help && (
          <Tooltip text={help}>
            <Icon
              use="info"
              style={{
                color: 'rgb(102, 102, 102)',
                opacity: 0.5,
                fontSize: 18,
                marginLeft: 4,
                cursor: 'help',
                fontVariant: 'common-ligatures',
              }}
            />
          </Tooltip>
        )}
      </label>
    </td>
  )
}

export default TableData
