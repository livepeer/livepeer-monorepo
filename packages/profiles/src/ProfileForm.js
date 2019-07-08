import React from 'react'
import styled from 'styled-components'
import Button from './Button'

const ProfileForm = styled.div``

export default () => {
  return (
    <div>
      <label>Upload profile picture: </label>
      <br />
      <input type="file" />
      <br />
      <label>Name: </label>
      <br />
      <input type="text" />
      <br />
      <label>Bio / Description</label>
      <br />
      <textarea />
      <br />
      <label>URL:</label>
      <br />
      <input type="url" />
      <br />
      <Button>Cancel</Button>
      <Button>Save</Button>
    </div>
  )
}
