import React from 'react'
import { Link } from 'react-router-dom'
import Tooltip from './Tooltip'
import Avatar from './Avatar'

const BoxInfo = ({ id, ensName }) => {
  return (
    <>
      <a href={`/accounts/${id}/transcoding`}>
        <Avatar id={id} size={32} />
      </a>
      <div className="address">
        <Tooltip id={id} text={id} type="nowrap">
          <a
            href={`/accounts/${id}/transcoding`}
            style={{ color: '#000', textDecoration: 'none' }}
          >
            {ensName || `${id.substr(0, 10)}...`}
          </a>
        </Tooltip>
      </div>
    </>
  )
}

export default BoxInfo
