import Box from '3box'

const boxes = {}
const spaces = {}
const profiles = {}

export const getBox = async (address, provider) => {
  if (!boxes[address]) {
    boxes[address] = await Box.openBox(address, provider)
    const boxSyncPromise = new Promise((resolve, reject) =>
      box.onSyncDone(resolve),
    )
    await boxSyncPromise
  }
  return boxes[address]
}

export const getSpace = async (address, provider) => {
  if (!spaces[address]) {
  }
}

export const getProfile = async (address, provider) => {}

export const printHello = () => {
  console.log('Hello im imported library')
}
