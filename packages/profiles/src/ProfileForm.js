import React from 'react'
import styled from 'styled-components'
import Button from './Button'

const ProfileForm = styled.div``

export default ({ name = '', description = '', url = '' }) => {
  return (
    <div>
      <label>Upload profile picture: </label>
      <br />
      <input type="file" />
      <br />
      <label>Name: </label>
      <br />
      <input type="text" defaultValue={name} />
      <br />
      <label>Bio / Description</label>
      <br />
      <textarea defaultValue={description} />
      <br />
      <label>URL:</label>
      <br />
      <input type="url" defaultValue={url} />
      <br />
      <Button>Cancel</Button>
      <Button>Save</Button>
    </div>
  )
}
