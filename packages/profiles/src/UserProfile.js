import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Box from '3box'
//import { Button, CTAButton } from './Button'
import Button from './Button'
import ProfilePicture from './ProfilePicture'
import LoadingAnimation from './LoadingAnimation'
import ProfileForm from './ProfileForm'
import Popup from 'reactjs-popup'
import EmptyProfile from './EmptyProfile'
import PopulatedProfile from './PopulatedProfile'

import ThreeBoxPrompt from './ThreeBoxPrompt'
import SwitchDefaultProfile from './SwitchDefaultProfile'
import ConnectImage from './connect.png'

import {
  printHello,
  getSpace,
  getProfile,
  saveProfileToLivepeerSpace,
  resetProf,
  linkProfile,
} from './Lib'

const UserProfile = styled.div`
  width: 70%;
  display: block;
  margin: 0 auto;
  position: relative;
`

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

/*setInterval(async () => {
	console.log(await Box.getSpace(window.web3.eth.defaultAccount, 'livepeer'))
}, 3000);*/

export default () => {
  const [account, setAccount] = useState('Loading...')
  const [popupOpen, setPopupOpen] = useState(false)
  const [editPopupOpen, setEditPopupOpen] = useState(false)
  const [linkPopupOpen, setLinkPopupOpen] = useState(false)
  const [editProfileType, setEditProfileType] = useState(false)
  const [content, setContent] = useState('loading')
  const [profile, setProfile] = useState(0)
  const [userDid, setUserDid] = useState(0)
  const [timestamp, setTimestamp] = useState(0)

  const signatureRef = useRef()
  const addressRef = useRef()

  const update = async () => {
    console.log('eth: ' + window.web3.eth)
    console.log('address: ' + window.web3.eth.defaultAccount)
    if (window.web3.eth.defaultAccount != undefined) {
      setAccount(window.web3.eth.defaultAccount)
    } else {
      setAccount('Loading...')
    }
    /* Taking out the cached spaces stuff because it was causing problems.
     * It's conceavable that 3box already has some kind of caching system
     */
    //let lpSpace = await getSpace(window.web3.eth.defaultAccount)
    //let lpSpace = await Box.getSpace(window.web3.eth.defaultAccount, 'livepeer')
    let lpSpace = await Box.getSpace(window.web3.eth.defaultAccount, 'livepeer')
    if (lpSpace.defaultProfile == '3box') {
      setContent('loading_animation')
      let boxProfile = await Box.getProfile(
        window.web3.eth.defaultAccount,
        window.web3.currentProvider,
      )
      setProfile({
        name: boxProfile.name,
        description: boxProfile.description,
        url: boxProfile.website,
        image:
          boxProfile.image == undefined
            ? ''
            : 'https://ipfs.infura.io/ipfs/' +
              boxProfile.image[0].contentUrl['/'],
      })
      setContent('populated_profile')
    } else if (lpSpace.defaultProfile == 'livepeer') {
      setContent('populated_profile')
      setProfile({
        name: lpSpace.name,
        description: lpSpace.description,
        url: lpSpace.website,
        /*image: 'https://ipfs.infura.io/ipfs/' + lpSpace.image,*/
        image:
          lpSpace.image == ''
            ? ''
            : 'https://ipfs.infura.io/ipfs/' + lpSpace.image,
      })
    } else {
      setContent('empty_profile')
    }
    const box = await Box.openBox(window.web3.eth.defaultAccount)
    setUserDid(box.DID)
    setTimestamp(Math.floor(Date.now() / 1000))
  }
  useEffect(() => {
    update()
    /*web3.currentProvider.publicConfigStore.addListener('update', update)
    return () => {
      web3.currentProvider.publicConfigStore.removeListener('update', update)
    }*/
  }, [account])

  return (
    <UserProfile>
      <Popup open={popupOpen}>
        <ThreeBoxPrompt
          useExistingAction={async () => {
            setContent('loading_animation')
            setPopupOpen(false)
            const box = await Box.openBox(
              window.web3.eth.defaultAccount,
              window.web3.currentProvider,
            )
            const boxSyncPromise = new Promise((resolve, reject) =>
              box.onSyncDone(resolve),
            )
            let livepeerSpace
            const spaceSyncPromise = new Promise((resolve, reject) => {
              livepeerSpace = box.openSpace('livepeer', { onSyncDone: resolve })
            })
            await boxSyncPromise
            await spaceSyncPromise
            livepeerSpace = await livepeerSpace
            await livepeerSpace.public.set('defaultProfile', '3box')
            let boxProfile = await Box.getProfile(
              window.web3.eth.defaultAccount,
              window.web3.currentProvider,
            )
            setProfile({
              name: boxProfile.name,
              description: boxProfile.description,
              url: boxProfile.website,
              image:
                boxProfile.image == undefined ||
                boxProfile.image[0] == undefined
                  ? ''
                  : 'https://ipfs.infura.io/ipfs/' +
                    boxProfile.image[0].contentUrl['/'],
            })
            setContent('populated_profile')
          }}
          createNewAction={() => {
            setContent('profile_form')
            setPopupOpen(false)
          }}
        />
      </Popup>
      <Popup open={editPopupOpen}>
        <SwitchDefaultProfile currentProf={editProfileType} />
      </Popup>
      <Popup
        open={linkPopupOpen}
        onClose={() => {
          setLinkPopupOpen(false)
        }}
      >
        <>
          <h3>Connect External Transcoder Account</h3>
          This action is required for transcoders that wish to use their profile
          with an external{' '}
          <span style={{ fontFamily: 'Courier' }}>livepeer-cli</span> account.
          <ol>
            <li>
              Run <span style={{ fontFamily: 'Courier' }}>livepeer-cli</span>{' '}
              and select option #20
            </li>
            <li>When prompted for the message to sign, paste this:</li>
            <br />
            {(() => {
              if (userDid == 0 || timestamp == 0) {
                return (
                  <LoadingAnimation
                    style={{
                      display: 'block',
                      margin: '0 auto',
                    }}
                  />
                )
              }
              return (
                <div
                  style={{
                    backgroundColor: 'black',
                    color: 'limegreen',
                    width: '350px',
                    display: 'block',
                    margin: '0 auto',
                    overflow: 'scroll',
                  }}
                >
                  Create a new 3Box profile
                  <br />
                  <br />
                  -
                  <br />
                  Your unique profile ID is {userDid}
                  <br />
                  Timestamp: {timestamp}
                </div>
              )
            })()}
            <br />
            <li>
              Paste the hex signature output here, and enter address of account.
            </li>
          </ol>
          <input
            style={{
              display: 'block',
              margin: '0 auto',
            }}
            type="text"
            ref={signatureRef}
            placeholder="signature"
          />
          <br />
          <input
            style={{
              display: 'block',
              margin: '0 auto',
            }}
            type="text"
            ref={addressRef}
            placeholder="address"
          />
          <br />
          <div
            style={{
              marginTop: '10px',
              padding: '0',
            }}
          >
            <Button>Cancel</Button>
            <Button
              onClick={() => {
                linkProfile(
                  window.web3.eth.defaultAccount,
                  addressRef.current.value,
                  'message',
                  signatureRef.current.value,
                )
              }}
            >
              Connect Account
            </Button>
          </div>
        </>
      </Popup>
      <br />
      {(() => {
        switch (content) {
          case 'populated_profile':
            //return <Info text={text} />;
            return (
              <>
                <PopulatedProfile
                  name={profile.name}
                  description={profile.description}
                  image={profile.image}
                  url={profile.url}
                  address={web3.eth.defaultAccount}
                />
                <Button
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 0,
                  }}
                  onClick={async () => {
                    let lpSpace = await Box.getSpace(
                      window.web3.eth.defaultAccount,
                      'livepeer',
                    )
                    if (lpSpace.defaultProfile == '3box') {
                      window.open('https://3box.io/hub')
                    } else if (lpSpace.defaultProfile == 'livepeer') {
                      Box.getProfile(
                        window.web3.eth.defaultAccount,
                        web3.currentProvider,
                      ).then(p => {
                        if (p.name != undefined) {
                          setPopupOpen(true)
                        }
                      })
                      setContent('profile_form')
                    } else {
                      alert('error retrieving profile settings')
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </>
            )
          case 'empty_profile':
            return (
              <EmptyProfile
                address={window.web3.eth.defaultAccount}
                setupAction={async () => {
                  setContent('loading_animation')
                  const prof = await Box.getProfile(
                    window.web3.eth.defaultAccount,
                    window.web3.currentProvider,
                  )
                  if (prof.name != undefined) {
                    setPopupOpen(true)
                    setContent('empty_profile')
                  } else {
                    let livepeerSpace
                    const box = await Box.openBox(
                      window.web3.eth.defaultAccount,
                      window.web3.currentProvider,
                    )
                    const boxSyncPromise = new Promise((resolve, reject) =>
                      box.onSyncDone(resolve),
                    )
                    const spaceSyncPromise = new Promise((resolve, reject) => {
                      livepeerSpace = box.openSpace('livepeer', {
                        onSyncDone: resolve,
                      })
                    })
                    await boxSyncPromise
                    await spaceSyncPromise
                    livepeerSpace = await livepeerSpace
                    setContent('profile_form')
                    livepeerSpace = null
                  }
                }}
              />
            )
          case 'loading':
            return 'loading...'
          case 'loading_animation':
            return <LoadingAnimation />
          case 'profile_form':
            return (
              <ProfileForm
                saveAction={async (name, desc, url, image) => {
                  const oldPic = profile.image
                  setContent('loading_animation')
                  const prof = await saveProfileToLivepeerSpace(
                    window.web3.eth.defaultAccount,
                    window.web3.currentProvider,
                    name,
                    desc,
                    url,
                    image,
                    null,
                    oldPic,
                  )
                  console.log('Appears to have finished saving')
                  console.log('Profile:')
                  console.log(prof)
                  if (prof.image != '') {
                    prof.image = 'https://ipfs.infura.io/ipfs/' + prof.image
                  }
                  setProfile(prof)
                  setContent('populated_profile')
                  //update()
                }}
                cancelAction={update}
                name={profile.name || ''}
                description={profile.description || ''}
                url={profile.url || ''}
              />
            )
          default:
            return null
        }
      })()}
      <br />
      <a
        onClick={() => {
          setLinkPopupOpen(true)
        }}
      >
        <div
          style={{
            textDecoration: 'none',
            color: 'black',
            cursor: 'pointer',
            display: 'block',
            width: '60%',
            margin: '10px auto',
            padding: '8px',
            borderRadius: '5px',
            backgroundColor: '#EADEBA',
          }}
        >
          <img
            src={ConnectImage}
            width={20}
            style={{
              marginLeft: '3px',
              marginRight: '3px',
            }}
          />
          Connect External Transcoder Account
        </div>
      </a>
      <br />
      <Button
        style={{
          marginTop: '10px',
        }}
        onClick={async () => {
          setContent('loading_animation')
          await resetProf(
            window.web3.eth.defaultAccount,
            window.web3.currentProvider,
          )
          setContent('empty_profile')
          //update()
        }}
      >
        Reset
      </Button>
    </UserProfile>
  )
}
