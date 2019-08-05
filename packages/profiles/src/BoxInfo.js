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

  const update = async id => {
    let resp = await window.fetch('https://graph.livepeer.org/blocklist.json')
    resp = await resp.json()
    let blocked = resp.blocked
    blocked = blocked.map(x => x.toLowerCase())
    let space = await Box.getSpace(id, 'livepeer', {
      blocklist: address => {
        return blocked.includes(address.toLowerCase())
      },
    })
    if (space.defaultProfile == 'livepeer') {
      if (space.name != null && space.name != undefined) {
        setAccountName(space.name)
      }
      if (space.image != null && space.image != undefined) {
        setAccountImage('https://ipfs.infura.io/ipfs/' + space.image)
      }
    }
    if (space.defaultProfile == '3box') {
      let profile = await Box.getProfile(id, {
        blocklist: id => {
          return blocked.includes(address.toLowerCase())
        },
      })
      if (profile.name != null && profile.name != undefined) {
        setAccountName(profile.name)
      }
      if (profile.image != null && profile.image != undefined) {
        setAccountImage(
          'https://ipfs.infura.io/ipfs/' + profile.image[0].contentUrl['/'],
        )
      }
    }
  }

  update(id)

  return (
    <>
      <a href={`/accounts/${id}/transcoding`}>
        {(() => {
          if (accountImage == null || accountImage == undefined) {
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
              if (accountName == null || accountName == undefined) {
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
