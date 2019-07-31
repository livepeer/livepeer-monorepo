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

const Profile = styled.div``

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

export default ({ address }) => {
  const [profile, setProfile] = useState(null)

  const blocklist = address => {
    return false
  }

  Box.getSpace(address, 'livepeer', { blocklist }).then(s => {
    if (s.defaultProfile == '3box') {
      Box.getProfile(address).then(p => {
        setProfile({
          image: 'https://ipfs.infura.io/ipfs/' + p.image[0].contentUrl['/'],
          name: p.name,
          description: p.description,
          url: p.website,
        })
      })
    } else if (s.defaultProfile == 'livepeer') {
      setProfile({
        image: 'https://ipfs.infura.io/ipfs/' + s.image,
        name: s.name,
        description: s.description,
        url: s.website,
      })
    }
  })

  return (
    <Profile>
      {(() => {
        if (profile != null) {
          return (
            <PopulatedProfile
              name={profile.name}
              description={profile.description}
              image={profile.image}
              url={profile.url}
            />
          )
        } else {
          return (
            <div>
              <ProfilePicture />
              <br />
              <span>{address}</span>
              <br />
            </div>
          )
        }
      })()}
    </Profile>
  )
}
