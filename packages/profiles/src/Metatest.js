import React, { useState, useEffect } from 'react'
import Box from '3box'
import Button from './Button'

export default () => {
  return (
    <>
      <Button
        onClick={async () => {
          const box = await Box.openBox(
            window.web3.eth.defaultAccount,
            window.web3.currentProvider,
          )
          console.log('box: ')
          console.log(box)
          const boxSyncPromise = new Promise((resolve, reject) =>
            box.onSyncDone(resolve),
          )
          let livepeerSpace
          const spaceSyncPromise = new Promise(async (resolve, reject) => {
            livepeerSpace = await box.openSpace('livepeer', {
              onSyncDone: resolve,
            })
          })
          await boxSyncPromise
          await spaceSyncPromise
          console.log('done')
          console.log(await livepeerSpace)
        }}
      >
        Click Me
      </Button>
    </>
  )
}
