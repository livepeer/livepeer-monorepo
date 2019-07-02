import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Box from '3box'

const TestComponent = styled.div`
  color: red;
`

export default () => {
  const [jsontext, setJsonText] = useState('Loading...')
  const [boxStatus, setBoxStatus] = useState('Loading status...')
  const [boxName, setBoxName] = useState('Loading name...')

  useEffect(() => {
    const update = () => {
      setJsonText(window.web3.eth.defaultAccount)
      Box.getProfile(window.web3.eth.defaultAccount).then(p => {
        setBoxStatus(p.status)
        setBoxName(p.name)
      })
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
    </TestComponent>
  )
}
