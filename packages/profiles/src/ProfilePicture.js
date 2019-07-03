import React from 'react'
import styled from 'styled-components'
import ProfileImg from './prof.png'

const ProfilePicture = styled.img`
  margin: 0 auto;
  width: 400px;
`

export default () => {
  return <ProfilePicture src={ProfileImg} />
}
