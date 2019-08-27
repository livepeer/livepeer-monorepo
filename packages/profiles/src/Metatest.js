import React, { useState, useEffect } from 'react'
import Box from '3box'
import Button from './Button'

export default () => {
  const [account, setAccount] = useState('loading account...')
  const [boxStatus, setBoxStatus] = useState('loading box...')
  const [boxLinks, setBoxLinks] = useState('loading boxlinks...')
  const [profileStatus, setProfileStatus] = useState('loading profile...')
  const [profile, setProfile] = useState('')

  const didToLink = ''

  const update = async () => {
    setAccount(window.web3.eth.defaultAccount)
    setBoxStatus('opening box...')
    const box = await Box.openBox(account, web3.currentProvider)
    setBoxStatus('syncing box...')
    const boxSyncPromise = new Promise((resolve, reject) => {
      box.onSyncDone(resolve)
    })
    await boxSyncPromise
    setBoxStatus('box synced.')
    setBoxLinks(JSON.stringify(box.listAddressLinks()))
    setProfileStatus('getting profile...')
    const prof = await Box.getProfile(
      window.web3.eth.defaultAccount,
      window.web3.currentProvider,
    )
    setProfileStatus('got profile.')
    setProfile(JSON.stringify(prof))
  }

  useEffect(() => {
    update()
  }, [account])

  return (
    <>
      <span>{account}</span>
      <br />
      <span>{boxStatus}</span>
      <br />
      <div>{boxLinks}</div>
      <span>{profileStatus}</span>
      <div>{profile}</div>
    </>
  )
}
