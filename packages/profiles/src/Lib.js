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
  const box = await Box.openBox(address, window.web3.currentProvider)
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
) => {
  const formData = new window.FormData()
  formData.append('path', image.current.files[0])
  let resp
  resp = await window.fetch('https://ipfs.infura.io:5001/api/v0/add', {
    method: 'post',
    'Content-Type': 'multipart/form-data',
    body: formData,
  })
  const infuraResponse = await resp.json()
  const hash = infuraResponse['Hash']
  const box = await Box.openBox(address, window.web3.currentProvider)
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
  await livepeerSpace.public.set('defaultProfile', 'livepeer')
  await livepeerSpace.public.set('name', name)
  await livepeerSpace.public.set('description', desc)
  await livepeerSpace.public.set('website', url)
  await livepeerSpace.public.set('image', hash)

  return {
    name: name,
    description: desc,
    url: url,
    image: 'https://ipfs.infura.io/ipfs/' + hash,
  }
}

export const printHello = () => {
  console.log('Hello im imported library')
}
