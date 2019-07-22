import React from 'react'
import Button from './Button'
import ProfilePicture from './ProfilePicture'
//import ProfileForm from './ProfileForm'

export default ({ setupAction }) => {
  return (
    <div>
      <ProfilePicture />
      <br />
      <Button onClick={setupAction}>Set Up My Profile</Button>
    </div>
  )
}
