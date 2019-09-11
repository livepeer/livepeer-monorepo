import TestComponent from './TestComponent'
import ProfileChecker from './ProfileChecker'
import UserProfile from './UserProfile'
import Profile from './Profile'
import ProfileForm from './ProfileForm'
import ProfilePicture from './ProfilePicture'
import ReactDOM from 'react-dom'
import React from 'react'
import AlertDialog from './AlertDialog'
import BoxAvatar from './BoxAvatar'
import BoxInfo from './BoxInfo'
import Metatest from './Metatest'
import BoxManagerTest from './BoxManagerTest'

const element = <UserProfile />
//const element = <BoxInfo id={window.web3.eth.defaultAccount} />
//const element = <Profile address={"0x6DD209981745A1A0a8b872D32d08b099AF5a0DD1"} />
ReactDOM.render(element, document.querySelector('#react-div'))
