import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Tooltip from './Tooltip'
import Avatar from './Avatar'
import Box from '3box'

const blocklist = address => {
  return false
}

const BoxInfo = ({ id, ensName }) => {
  const [accountName, setAccountName] = useState(null)
  const [accountImage, setAccountImage] = useState(null)

  Box.getSpace(id, 'livepeer', { blocklist }).then(s => {
    if (s.defaultProfile == 'livepeer') {
      if (s.image != null && s.image != undefined) {
        setAccountImage('https://ipfs.infura.io/ipfs/' + s.image)
      }
      if (s.name != null && s.image != null) {
        setAccountName(s.name)
      }
    } else if (s.defaultProfile == '3box') {
      Box.getProfile(id, { blocklist }).then(p => {
        if (
          p.image[0].contentUrl['/'] != null &&
          p.image[0].contentUrl['/'] != undefined
        ) {
          setAccountImage(
            'https://ipfs.infura.io/ipfs/' + p.image[0].contentUrl['/'],
          )
        }
        if (p.name != null && p.name != undefined) {
          setAccountName(p.name)
        }
      })
    }
  })

  return (
    <>
      <a href={`/accounts/${id}/transcoding`}>
        {(() => {
          if (accountImage == null) {
            return <Avatar id={id} size={32} />
          } else {
            return (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '50%',
                }}
              >
                <img
                  src={accountImage}
                  width={32}
                  style={{
                    display: 'inline',
                    margin: '0 auto',
                    height: '100%',
                    width: 'auto',
                  }}
                />
              </div>
            )
          }
        })()}
      </a>
      <div className="address">
        <Tooltip id={id} text={id} type="nowrap">
          <a
            href={`/accounts/${id}/transcoding`}
            style={{ color: '#000', textDecoration: 'none' }}
          >
            {(() => {
              if (accountName == null) {
                return ensName || `${id.substr(0, 10)}...`
              } else {
                return accountName
              }
            })()}
            {/*{ensName || `${id.substr(0, 10)}...`}*/}
          </a>
        </Tooltip>
      </div>
    </>
  )
}

export default BoxInfo
