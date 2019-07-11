import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Button from './Button'
import Box from '3box'

const ProfileForm = styled.div``

export default ({ name = '', description = '', url = '' }) => {
  const [formName, setFormName] = useState('')
  const nameVal = useRef(null)
  const descVal = useRef(null)
  const urlVal = useRef(null)
  const fileVal = useRef(null)

  const saveTo3box = async (file, name, desc, website) => {
    const formData = new window.FormData()
    formData.append('path', file)
    let resp
    resp = await window.fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'post',
      'Content-Type': 'multipart/form-data',
      body: formData,
    })
    //console.log(await resp.json())
    const infuraResponse = await resp.json()
    const hash = infuraResponse['Hash']
    console.log(hash)
    const box = await Box.openBox(
      window.web3.eth.defaultAccount,
      window.web3.currentProvider,
    )
    const boxSyncPromise = new Promise((resolve, reject) =>
      box.onSyncDone(resolve),
    )
    box.openSpace('livepeer').then(async p => {
      console.log('p: ' + p)
      await p.public.set('defaultProfile', 'livepeer')
      await p.public.set('name', name)
      await p.public.set('description', desc)
      await p.public.set('website', website)
      await p.public.set('image', hash)
      return true
    })
    return false
  }

  const DefaultForm = () => {
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
          onClick={async () => {
            console.log(fileVal)
            console.log('Name: ' + nameVal.current.value)
            console.log('Description: ' + descVal.current.value)
            console.log('URL: ' + urlVal.current.value)
            console.log(fileVal.current.files[0])
            setContent('Saving to livepeer space...')
            if (
              await saveTo3box(
                fileVal.current.files[0],
                nameVal.current.value,
                descVal.current.value,
                urlVal.current.value,
              )
            ) {
              setContent('Succesfully saved profile')
            } else {
              setContent('Failed to save profile')
            }
          }}
        >
          Save
        </Button>
        <Button>Cancel</Button>
      </div>
    )
  }

  const [content, setContent] = useState(DefaultForm)

  return <>{content}</>
}
