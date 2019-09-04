import Box from '3box'

const boxes = {}
const spaces = {}
const profiles = {}

export const getBox = async (address, provider) => {
  if (!boxes[address]) {
    boxes[address] = await Box.openBox(address, provider)
    const boxSyncPromise = new Promise((resolve, reject) =>
      boxes[address].onSyncDone(resolve),
    )
    await boxSyncPromise
  }
  return boxes[address]
}

/* Do I need to sync again here? */

export const getSpace = async address => {
  if (!spaces[address]) {
    spaces[address] = await Box.getSpace(address, 'livepeer')
  }
  return await spaces[address]
}

export const getProfile = async (address, provider) => {
  if (!profiles[address]) {
    profiles[address] = await Box.getProfile(address, provider)
  }
  return profiles[address]
}

export const resetProf = async (address, provider) => {
  console.log('resetProf called')
  console.log('step one: get box')
  const box = await Box.openBox(address, window.web3.currentProvider)
  console.log('step two: get boxsyncpromise')
  const boxSyncPromise = new Promise((resolve, reject) =>
    box.onSyncDone(resolve),
  )
  let livepeerSpace
  console.log('step three: get spacesync promise')
  const spaceSyncPromise = new Promise((resolve, reject) => {
    livepeerSpace = box.openSpace('livepeer', { onSyncDone: resolve })
  })
  await boxSyncPromise
  await spaceSyncPromise
  console.log('step four: promises done, now to save stuff')
  livepeerSpace = await livepeerSpace
  await livepeerSpace.public.remove('defaultProfile')
  await livepeerSpace.public.remove('name')
  await livepeerSpace.public.remove('description')
  await livepeerSpace.public.remove('website')
  await livepeerSpace.public.remove('image')
}

export const saveProfileToLivepeerSpace = async (
  address,
  provider,
  name,
  desc,
  url,
  image,
  space = null,
  _oldPic = null,
) => {
  let hash
  if (image.current.files[0] != undefined && image.current.files[0] != null) {
    const formData = new window.FormData()
    formData.append('path', image.current.files[0])
    let resp
    resp = await window.fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'post',
      'Content-Type': 'multipart/form-data',
      body: formData,
    })
    const infuraResponse = await resp.json()
    hash = infuraResponse['Hash']
  } else {
    hash = ''
  }
  let livepeerSpace
  if (space == null || space == undefined) {
    const box = await Box.openBox(address, window.web3.currentProvider)
    const boxSyncPromise = new Promise((resolve, reject) =>
      box.onSyncDone(resolve),
    )
    const spaceSyncPromise = new Promise((resolve, reject) => {
      livepeerSpace = box.openSpace('livepeer', { onSyncDone: resolve })
    })
    await boxSyncPromise
    await spaceSyncPromise
    livepeerSpace = await livepeerSpace
  } else {
    livepeerSpace = space
  }
  await livepeerSpace.public.set('defaultProfile', 'livepeer')
  await livepeerSpace.public.set('name', name)
  await livepeerSpace.public.set('description', desc)
  await livepeerSpace.public.set('website', url)
  console.log(hash)
  if (hash != '') {
    await livepeerSpace.public.set('image', hash)
  }
  if (hash == '' && _oldPic != null && _oldPic != '') {
    hash = _oldPic.split('/')[_oldPic.split('/').length - 1]
  }
  return {
    name: name,
    description: desc,
    url: url,
    image: hash,
  }
}

export const linkProfile = async (
  address,
  addressToLink,
  message,
  signedMessage,
) => {
  alert('address: ' + address)
  alert('addressToLink: ' + addressToLink)
  alert('message: ' + message)
  alert('signedMessage: ' + signedMessage)
}

export const printHello = () => {
  console.log('Hello im imported library')
}
