import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Button from './Button'

const ProfileForm = styled.div``

export default ({ name = '', description = '', url = '' }) => {
  const [formName, setFormName] = useState('')
  const [content, setContent] = useState('')
  const nameVal = useRef(null)
  const descVal = useRef(null)
  const urlVal = useRef(null)
  const fileVal = useRef(null)

  const saveTo3box = async (file, name) => {
    const formData = new window.FormData()
    formData.append('path', file)
    let resp
    resp = await window.fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'post',
      'Content-Type': 'multipart/form-data',
      body: formData,
    })
    console.log(await resp.json())
  }

  return (
    <div>
      <label>Upload profile picture: </label>
      <br />
      <input type="file" ref={fileVal} />
      <br />
      <label>Name: </label>
      <br />
      <input type="text" ref={nameVal} defaultValue={name} />
      <br />
      <label>Bio / Description</label>
      <br />
      <textarea defaultValue={description} ref={descVal} />
      <br />
      <label>URL:</label>
      <br />
      <input type="url" defaultValue={url} ref={urlVal} />
      <br />
      <Button
        onClick={() => {
          console.log(fileVal)
          console.log('Name: ' + nameVal.current.value)
          console.log('Description: ' + descVal.current.value)
          console.log('URL: ' + urlVal.current.value)
          console.log(fileVal.current.files[0])
          saveTo3box(fileVal.current.files[0], nameVal.current.value)
        }}
      >
        Cancel
      </Button>
      <Button>Save</Button>
    </div>
  )
}
