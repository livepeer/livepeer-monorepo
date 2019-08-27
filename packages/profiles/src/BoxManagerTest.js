import React, { useState, useEffect } from 'react'
import Box from '3box'
import Button from './Button'
import BoxManager from './BoxManager'

export default () => {
  const [account, setAccount] = useState('loading account...')
  const [boxStatus, setBoxStatus] = useState('waiting for box...')

  const update = async () => {
    setBoxStatus(BoxManager.helloWorld())
  }

  useEffect(() => {
    update()
  }, [account])

  return (
    <>
      <span>{boxStatus}</span>
    </>
  )
}
