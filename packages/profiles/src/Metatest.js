import React, { useState, useEffect } from 'react'
import Box from '3box'
import Button from './Button'

export default () => {
  const [account, setAccount] = useState('loading account...')

  setAccount(window.web3.eth.defaultAccount)

  return (
    <>
      <span>{account}</span>
    </>
  )
}
