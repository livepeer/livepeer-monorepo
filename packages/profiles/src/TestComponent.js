import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Box from '3box'
import Button from './Button'

const TestComponent = styled.div`
  color: red;
`

export default () => {
  const [jsontext, setJsonText] = useState('Loading...')
  const [boxStatus, setBoxStatus] = useState('Loading status...')
  const [boxName, setBoxName] = useState('Loading name...')
  const [hasProfile, setHasProfile] = useState('Loading hasprofile...')
  const [content, setContent] = useState('content goes here')

  function needToSetUpProfile() {
    return <Button>Set Up My Profile</Button>
  }

  useEffect(() => {
    const update = async () => {
      setJsonText(window.web3.eth.defaultAccount)
      Box.getProfile(window.web3.eth.defaultAccount).then(p => {
        setBoxStatus(p.status)
        setBoxName(p.name)
      })
      var space = await Box.getSpace(window.web3.eth.defaultAccount, 'livepeer')
      console.log('checking for 3box account...')
      if (space.defaultAccount == undefined) {
        setHasProfile('no!')
        setContent(needToSetUpProfile())
      }
      //console.log(space)
    }
    update()
    web3.currentProvider.publicConfigStore.addListener('update', update)
    return () => {
      web3.currentProvider.publicConfigStore.removeListener('update', update)
    }
  })
  return (
    <TestComponent>
      <span>Your Ethereum Address:</span> {jsontext}
      <br />
      <span>status: {boxStatus}</span>
      <br />
      <span>name: {boxName}</span>
      <br />
      <span>HasProfile: {hasProfile}</span>
      <br />
      {content}
    </TestComponent>
  )
}
