import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Button from './Button'
import Box from '3box'

const ProfileForm = styled.div``

const inputStyle = {
  width: '90%',
  marginTop: '10px',
}

const labelStyle = {
  float: 'left',
  marginLeft: '23px',
  marginTop: '10px',
}

export default ({
  name = '',
  description = '',
  url = '',
  saveAction,
  cancelAction,
}) => {
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
        <label style={labelStyle}>Upload profile picture: </label>
        <br />
        <input style={inputStyle} type="file" ref={fileVal} />
        <br />
        <label style={labelStyle}>Name: </label>
        <br />
        <input
          style={inputStyle}
          type="text"
          ref={nameVal}
          defaultValue={name}
        />
        <br />
        <label style={labelStyle}>Bio / Description</label>
        <br />
        <textarea style={inputStyle} defaultValue={description} ref={descVal} />
        <br />
        <label style={labelStyle}>URL:</label>
        <br />
        <input style={inputStyle} type="url" defaultValue={url} ref={urlVal} />
        <br />
        <div
          style={{
            marginTop: '10px',
          }}
        >
          <Button
            onClick={() => {
              saveAction(
                nameVal.current.value,
                descVal.current.value,
                urlVal.current.value,
                fileVal,
              )
            }}
          >
            Save
          </Button>
          <Button onClick={cancelAction}>Cancel</Button>
        </div>
      </div>
    )
  }

  const [content, setContent] = useState(DefaultForm)

  return <>{content}</>
}
