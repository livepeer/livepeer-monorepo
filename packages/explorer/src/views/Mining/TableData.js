import React from 'react'
import { Button } from '../../components'
import { Icon } from 'rmwc/Icon'
import Tooltip from '../../components/Tooltip'

const TableData = ({
  afterData,
  beforeData,
  btnVal,
  cancelSave,
  changeDataState,
  colSpan,
  edit,
  help,
  save,
  showBtn,
  tableData,
  toggleForm,
}) => {
  return (
    <td colSpan={colSpan}>
      {!edit ? (
        <label
          style={{
            alignItems: 'center',
            display: 'flex',
            margin: 0,
          }}
        >
          {beforeData && <strong>{beforeData}</strong>}
          <span style={{ textTransform: 'uppercase' }}>{tableData}</span>
          {showBtn && <Button onClick={toggleForm}>{btnVal}</Button>}
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
      ) : (
        <React.Fragment>
          <input type="number" value={beforeData} onChange={changeDataState} />
          <Button
            className="mod-btn"
            style={{
              backgroundColor: 'black',
              color: '#ffffff',
            }}
            onClick={save}
          >
            Ok
          </Button>
          <Button className="mod-btn" onClick={cancelSave}>
            Cancel
          </Button>
        </React.Fragment>
      )}
    </td>
  )
}

export default TableData
