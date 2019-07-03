import React, { useState, useEffect } from 'react'
import ProfilePicture from './ProfilePicture'
import Button from './Button'
import styled from 'styled-components'
import Box from '3box'

export default () => {
  const [content, setContent] = useState(Loading())

  function EmptyProfile() {
    return (
      <div>
        <ProfilePicture />
        <br />
        <Button>Set Up My Profile</Button>
      </div>
    )
  }

  function Loading() {
    return <span>Loading profile...</span>
  }

  useEffect(() => {
    const update = async () => {
      const livepeerSpace = await Box.getSpace(
        window.web3.eth.defaultAccount,
        'livepeer' /*, blocklist stuff */,
      )
      if (livepeerSpace.defaultProfile == undefined) {
        setContent(EmptyProfile())
      }
    }

    update()

    web3.currentProvider.publicConfigStore.addListener('update', update)

    return () => {
      web3.currentProvider.publicConfigStore.removeListener('update', update)
    }
  })
  return content
}
