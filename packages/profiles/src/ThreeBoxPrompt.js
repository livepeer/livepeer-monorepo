import React from 'react'
import styled from 'styled-components'
import Button from './Button'

export default ({ useExistingAction, createNewAction }) => {
  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      <h2>Use existing profile?</h2>
      We recognize you already have a 3box profile.
      <br />
      Use it on Livepeer?
      <div
        style={{
          marginTop: '20px',
        }}
      >
        <Button onClick={createNewAction}>Create new</Button>
        <Button onClick={useExistingAction}>Use Existing</Button>
      </div>
    </div>
  )
}
