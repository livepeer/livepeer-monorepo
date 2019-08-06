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
import Avatar from './Avatar'

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

  const update = async address => {
    let resp = await window.fetch('https://graph.livepeer.org/blocklist.json')
    resp = await resp.json()
    let blocked = resp.blocked
    blocked = blocked.map(x => x.toLowerCase())
    let space = await Box.getSpace(address, 'livepeer', {
      blocklist: address => {
        return blocked.includes(address.toLowerCase())
      },
    })
    console.log(space)
    if (space.defaultProfile == '3box') {
      let profile = await Box.getProfile(address, {
        blocklist: address => {
          return blocked.includes(address.toLowerCase())
        },
      })
      setProfile({
        image:
          'https://ipfs.infura.io/ipfs/' + profile.image[0].contentUrl['/'],
        name: profile.name,
        description: profile.description,
        url: profile.website,
      })
    } else if (space.defaultProfile == 'livepeer') {
      setProfile({
        image: 'https://ipfs.infura.io/ipfs/' + space.image,
        name: space.name,
        description: space.description,
        url: space.website,
      })
    }
  }

  useEffect(() => {
    update(address)
  }, [address])

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
              {/*<ProfilePicture />*/}
              <Avatar id={address} size={120} />
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
