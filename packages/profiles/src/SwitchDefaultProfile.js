import React from 'react'
import styled from 'styled-components'
import Button from './Button'

export default ({ currentProf }) => {
  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      {(() => {
        switch (currentProf) {
          case '3box':
            return (
              <>
                <h2>You're currently using a linked 3box profile</h2>
                <br />
                keep using it?
                <br />
                <Button>Yes</Button>
                <br />
                <Button>Create New Livepeer Profile</Button>
                <br />
                <Button>Cancel</Button>
                <br />
              </>
            )
          case 'livepeer':
            return (
              <>
                <h2>You're currently using a livepeer profile</h2>
                <br />
                <Button>Edit it</Button>
                <br />
                <Button>Create a 3Box profile</Button>
                <br />
                <Button>Cancel</Button>
              </>
            )
          default:
            return Error
        }
      })()}
    </div>
  )
}
