import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Box from '3box'
import Button from './Button'
import ProfilePicture from './ProfilePicture'

const Test2 = styled.div``

export default () => {
  const [account, setAccount] = useState('Loading...')
  const [content, setContent] = useState('Loading...')

  async function get3box() {
    const box = await Box.openBox(
      window.web3.eth.defaultAccount,
      window.web3.currentProvider,
    )
    const boxSyncPromise = new Promise((resolve, reject) =>
      box.onSyncDone(resolve),
    )
    let livepeerSpace
    const spaceSyncPromise = new Promise(async (resolve, reject) => {
      livepeerSpace = await box.openSpace('livepeer', { onSyncDone: resolve })
    })
    await boxSyncPromise
    await spaceSyncPromise
    console.log('Got some 3box stuff')
    return 0
  }

  const EmptyProfile = () => {
    return (
      <div>
        <ProfilePicture />
        <br />
        <Button onClick={get3box}>Set Up My Profile</Button>
      </div>
    )
  }

  const Loading = () => {
    return <span>Loading profile...</span>
  }

  useEffect(() => {
    const update = async () => {
      console.log('Update called')
      if (window.web3.eth.defaultAccount != undefined) {
        setAccount(window.web3.eth.defaultAccount)
        setContent(Loading)
      } else {
        setAccount('Loading...')
        setContent(Loading)
      }
      const livepeerSpace = await Box.getSpace(
        window.web3.eth.defaultAccount,
        'livepeer',
      )
      console.log('checking...')
      if (
        livepeerSpace.defaultAccount == undefined &&
        window.web3.eth.defaultAccount != undefined
      ) {
        setContent(EmptyProfile)
      }
    }
    update()
    web3.currentProvider.publicConfigStore.addListener('update', update)
    console.log('Use Effect triggered')
    return () => {
      web3.currentProvider.publicConfigStore.removeListener('update', update)
    }
  }, [account])
  return (
    <Test2>
      <span>account: {account}</span>
      <br />
      {content}
    </Test2>
  )
}
