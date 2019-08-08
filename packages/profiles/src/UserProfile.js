import React, { useState, useEffect } from 'react'
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

import {
  printHello,
  getSpace,
  getProfile,
  saveProfileToLivepeerSpace,
  resetProf,
} from './Lib'

const UserProfile = styled.div``

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
  const [editProfileType, setEditProfileType] = useState(false)
  const [content, setContent] = useState('loading')
  const [profile, setProfile] = useState(0)

  const update = async () => {
    console.log('Update called')
    if (window.web3.eth.defaultAccount != undefined) {
      setAccount(window.web3.eth.defaultAccount)
    } else {
      setAccount('Loading...')
    }
    console.log('checking...')
    /* Taking out the cached spaces stuff because it was causing problems.
     * It's conceavable that 3box already has some kind of caching system
     */
    //let lpSpace = await getSpace(window.web3.eth.defaultAccount)
    //let lpSpace = await Box.getSpace(window.web3.eth.defaultAccount, 'livepeer')
    let lpSpace = await Box.getSpace(window.web3.eth.defaultAccount, 'livepeer')
    console.log(lpSpace)
    if (lpSpace.defaultProfile == '3box') {
      setContent('loading_animation')
      let boxProfile = await Box.getProfile(
        window.web3.eth.defaultAccount,
        window.web3.currentProvider,
      )
      console.log(boxProfile)
      setProfile({
        name: boxProfile.name,
        description: boxProfile.description,
        url: boxProfile.website,
        image:
          'https://ipfs.infura.io/ipfs/' + boxProfile.image[0].contentUrl['/'],
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
  }
  useEffect(() => {
    console.log('Use Effect triggered')
    update()
    web3.currentProvider.publicConfigStore.addListener('update', update)
    return () => {
      web3.currentProvider.publicConfigStore.removeListener('update', update)
    }
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
            console.log(boxProfile)
            setProfile({
              name: boxProfile.name,
              description: boxProfile.description,
              url: boxProfile.website,
              image:
                'https://ipfs.infura.io/ipfs/' +
                boxProfile.image[0].contentUrl['/'],
            })
            setContent('populated_profile')
          }}
          createNewAction={() => {
            setPopupOpen(false)
          }}
        />
      </Popup>
      <Popup open={editPopupOpen}>
        <SwitchDefaultProfile currentProf={editProfileType} />
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
                        console.log(p)
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
                setupAction={() => {
                  Box.getProfile(
                    window.web3.eth.defaultAccount,
                    web3.currentProvider,
                  ).then(p => {
                    console.log(p)
                    if (p.name != undefined) {
                      setPopupOpen(true)
                    }
                  })
                  setContent('profile_form')
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
                  setContent('loading_animation')
                  const prof = await saveProfileToLivepeerSpace(
                    window.web3.eth.defaultAccount,
                    window.web3.currentProvider,
                    name,
                    desc,
                    url,
                    image,
                  )
                  console.log('done')
                  console.log(prof.image)
                  prof.image = 'https://ipfs.infura.io/ipfs/' + prof.image
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
      <Button
        onClick={async () => {
          setContent('loading_animation')
          await resetProf(
            window.web3.eth.defaultAccount,
            window.web3.currentProvider,
          )
          console.log('done')
          setContent('empty_profile')
          //update()
        }}
      >
        Reset
      </Button>
    </UserProfile>
  )
}
