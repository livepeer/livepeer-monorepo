import FirestoreStore from './firestore-store'
;(async () => {
  const store = new FirestoreStore({
    firestoreCollection: 'test1586991163083',
    firestoreCredentials: process.env.LP_FIRESTORE_CREDENTIALS,
  })
  console.log(
    await store.listKeys(
      'api-token+userId/6b3905bc-33aa-4bff-9a6c-bf97d62fd324',
    ),
  )
  // const stuff = await store.get(
  //   'api-token+userId/6b3905bc-33aa-4bff-9a6c-bf97d62fd324/62abb3f9-421c-4213-bd19-fc80820df66f',
  // )
  // console.log(stuff)
  // const doc = {
  //   kind: 'user',
  //   id: '226e8c1f-08b5-4808-9403-2db4dead140c',
  //   now: Date.now(),
  // }
  // const [keys] = await store.listKeys('')
  // for (const key of keys) {
  //   // await store.delete(key)
  //   console.log('deleted ' + key)
  // }
  // // await store.delete(keys[0])

  // await store.create(`thing+email/eli@iame.li/AB`, doc)

  // for (let i = 0; i < 10; i += 1) {
  //   const newDoc = {
  //     ...doc,
  //     id: `example+${i}`,
  //   }
  //   await store.create(`user/example+${i}`, newDoc)
  // }

  // let [result] = await store.listKeys('user', null, 50)

  // console.log('before: ' + result.length)
  // for (const key of result) {
  //   await store.delete(key)
  //   console.log('deleted ' + key)
  // }
  // ;[result] = await store.listKeys('user', null, 50)
  // console.log('after: ' + result.length)
})()
