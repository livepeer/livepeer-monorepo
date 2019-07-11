import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Box from '3box'
//import { Button, CTAButton } from './Button'
import Button from './Button'
import ProfilePicture from './ProfilePicture'
import LoadingAnimation from './LoadingAnimation'
import ProfileForm from './ProfileForm'
import Popup from 'reactjs-popup'

const Test2 = styled.div``

const InAlertBox = styled.div`
  margin: 0 auto;
  display: block;
  width: 90%;
  text-align: center;
  padding: 10px;
`
const ButtonContainer = styled.div`
  margin-top: 10px;
`

export default () => {
  const [account, setAccount] = useState('Loading...')
  const [popupOpen, setPopupOpen] = useState(false)
  const [content, setContent] = useState('Loading...')

  const EmptyProfile = () => {
    return (
      <div>
        <ProfilePicture />
        <br />
        <Button onClick={get3box}>Set Up My Profile</Button>
      </div>
    )
  }

  const PopulatedProfile = (image, name, description, url) => {
    return (
      <div>
        <img
          style={{
            width: '100px',
          }}
          src={image}
        />
        <br />
        <span>{name}</span>
        <br />
        <p>{description}</p>
        <a href={url}>{url}</a>
      </div>
    )
  }

  const AskUse3Box = livepeerSpace => {
    return (
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <h2>Use existing profile?</h2>
        We recognize you already have a 3box profile.
        <br />
        Use it on Livepeer?
        <div
          style={{
            marginTop: '20px',
          }}
        >
          <Button>Create new</Button>
          <Button
            onClick={() => {
              setContent(EmptyProfile)
              setPopupOpen(false)
              console.log(livepeerSpace)
              livepeerSpace.public.set('defaultProfile', '3box')
            }}
          >
            Use existing
          </Button>
        </div>
      </div>
    )
  }

  const Loading = () => {
    return <span>Loading profile...</span>
  }

  const AnimatedLoading = () => {
    return (
      <div>
        <LoadingAnimation />
      </div>
    )
  }

  const [popupContent, setPopupContent] = useState('error')

  async function get3box() {
    setContent(AnimatedLoading)
    const box = await Box.openBox(
      window.web3.eth.defaultAccount,
      window.web3.currentProvider,
    )
    const boxSyncPromise = new Promise((resolve, reject) =>
      box.onSyncDone(resolve),
    )
    let livepeerSpace
    const spaceSyncPromise = new Promise(async (resolve, reject) => {
      livepeerSpace = await box.openSpace('livepeer', { onSyncDone: resolve })
    })
    await boxSyncPromise
    await spaceSyncPromise
    console.log('Got some 3box stuff')
    Box.getProfile(web3.eth.defaultAccount, web3.currentProvider).then(p => {
      console.log(p)
      if (p.name != undefined) {
        setPopupContent(AskUse3Box(livepeerSpace))
        setPopupOpen(true)
      } else {
        setContent(() => {
          return (
            <ProfileForm
              name={p.name}
              description={p.description}
              url={p.website}
            />
          )
        })
      }
    })
    return 0
  }

  useEffect(() => {
    const update = async () => {
      console.log('Update called')
      if (window.web3.eth.defaultAccount != undefined) {
        setAccount(window.web3.eth.defaultAccount)
        setContent(Loading)
      } else {
        setAccount('Loading...')
        setContent(Loading)
      }
      const livepeerSpace = await Box.getSpace(
        window.web3.eth.defaultAccount,
        'livepeer',
      )
      console.log('checking...')
      console.log(livepeerSpace)
      if (livepeerSpace.defaultProfile == '3box') {
        setContent(AnimatedLoading)
        Box.getProfile(
          window.web3.eth.defaultAccount,
          window.web3.currentProvider,
        ).then(p => {
          setContent(
            PopulatedProfile(
              'https://ipfs.infura.io/ipfs/' + p.image[0].contentUrl['/'],
              p.name,
              p.description,
              p.website,
            ),
          )
        })
      } else if (livepeerSpace.defaultProfile == 'livepeer') {
        setContent(
          PopulatedProfile(
            'https://ipfs.infura.io/ipfs/' + livepeerSpace.image,
            livepeerSpace.name,
            livepeerSpace.description,
            livepeerSpace.website,
          ),
        )
      } else {
        setContent(EmptyProfile)
      }
    }
    update()
    web3.currentProvider.publicConfigStore.addListener('update', update)
    console.log('Use Effect triggered')
    return () => {
      web3.currentProvider.publicConfigStore.removeListener('update', update)
    }
  }, [account])
  return (
    <Test2>
      <Popup open={popupOpen}>{popupContent}</Popup>
      <span>account: {account}</span>
      <br />
      {content}
    </Test2>
  )
}
