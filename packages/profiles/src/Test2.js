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
import { printHello, getSpace, getProfile } from './Lib'

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
  const [content, setContent] = useState('loading')
  const [profile, setProfile] = useState(0)

  const [popupContent, setPopupContent] = useState('error')

  useEffect(() => {
    console.log('Use Effect triggered')
    const update = async () => {
      console.log('Update called')
      if (window.web3.eth.defaultAccount != undefined) {
        setAccount(window.web3.eth.defaultAccount)
      } else {
        setAccount('Loading...')
      }
      console.log('checking...')
      let lpSpace = await getSpace(window.web3.eth.defaultAccount)
      console.log(lpSpace)
      if (lpSpace.defaultProfile == '3box') {
        setContent('loading_animation')
        let boxProfile = await getProfile(
          window.web3.eth.defaultAccount,
          window.web3.provider,
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
      } else if (lpSpace.defaultProfile == 'livepeer') {
        setContent('populated_profile')
        setProfile({
          name: lpSpace.name,
          description: lpSpace.description,
          url: lpSpace.website,
          image: 'https://ipfs.infura.io/ipfs/' + lpSpace.image,
        })
      } else {
        setContent('empty_profile')
      }
    }
    update()
    web3.currentProvider.publicConfigStore.addListener('update', update)
    return () => {
      web3.currentProvider.publicConfigStore.removeListener('update', update)
    }
  }, [account])

  return (
    <Test2>
      <Popup open={popupOpen}>{popupContent}</Popup>
      <span>account: {account}</span>
      <br />
      {(() => {
        switch (content) {
          case 'populated_profile':
            //return <Info text={text} />;
            return (
              <PopulatedProfile
                name={profile.name}
                description={profile.description}
                image={profile.image}
                url={profile.url}
              />
            )
          case 'empty_profile':
            return <EmptyProfile />
          case 'loading':
            return 'loading...'
          case 'loading_animation':
            return <LoadingAnimation />
          default:
            return null
        }
      })()}
    </Test2>
  )
}
