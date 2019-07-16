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
import { printHello, getSpace } from './Lib'

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
      let lpSpace = await getSpace(window.web3.eth.defaultAccount, 'livepeer')
      console.log('checking...')
      console.log(lpSpace)
      if (lpSpace.defaultProfile == '3box') {
        console.log('defaultProfile: 3box')
        //content= <LoadingAnimation/>
        setContent('loading')
        Box.getProfile(
          window.web3.eth.defaultAccount,
          window.web3.currentProvider,
        ).then(p => {
          //content = <PopulatedProfile/>
          setContent('populated_3box')
        })
      } else if (lpSpace.defaultProfile == 'livepeer') {
        console.log('defaultProfile: livepeer')
        setContent('populated_livepeer')
        console.log('content: ' + content)
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
          case 'populated_3box':
            //return <Info text={text} />;
            return (
              <PopulatedProfile
                name="fakename"
                description="fakedescription"
                image="image"
                url="fakeurl.com"
              />
            )
          case 'populated_livepeer':
            //return <Info text={text} />;
            return 'you have a livepeer profile'
          case 'empty_profile':
            return 'No profile'
          case 'loading':
            return 'loading...'
          default:
            return null
        }
      })()}
    </Test2>
  )
}
