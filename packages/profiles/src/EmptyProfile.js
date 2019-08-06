import React from 'react'
import Button from './Button'
import ProfilePicture from './ProfilePicture'
import Avatar from './Avatar'
//import ProfileForm from './ProfileForm'

export default ({ setupAction, address = null }) => {
  return (
    <div>
      {(() => {
        if (address == null || address == undefined) {
          return <ProfilePicture />
        } else {
          return <Avatar id={address} size={120} />
        }
      })()}
      <br />
      <Button onClick={setupAction}>Set Up My Profile</Button>
    </div>
  )
}
