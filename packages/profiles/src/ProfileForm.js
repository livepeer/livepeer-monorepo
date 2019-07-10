import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Button from './Button'

const ProfileForm = styled.div``

export default ({ name = '', description = '', url = '' }) => {
  const [formName, setFormName] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    console.log('use effect triggered in prof form')
    setContent(
      <div>
        <label>Upload profile picture: </label>
        <br />
        <input type="file" />
        <br />
        <label>Name: </label>
        <br />
        /* * Probably going to want this: *
        https://stackoverflow.com/questions/37266411/react-stateless-component-this-refs-value
        */
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
      </div>,
    )
  })

  return content
}
