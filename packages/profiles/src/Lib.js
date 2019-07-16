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

export const printHello = () => {
  console.log('Hello im imported library')
}
