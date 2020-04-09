import FirestoreStore from './firestore-store'
;(async () => {
  const store = new FirestoreStore()
  const doc = {
    kind: 'user',
    id: '226e8c1f-08b5-4808-9403-2db4dead140c',
    now: Date.now(),
  }
  await store.create(`poop/user/226e8c1f-08b5-4808-9403-2db4dead140c`, { doc })

  // await store.replace(`thing/eli@iame.li/AB`, doc)

  // for (let i = 0; i < 10; i += 1) {
  //   await store.replace(`thing/eli@iame.li/example_${i}`, doc)
  // }

  // let [result] = await store.listKeys('thing/eli@iame.li', null, 50)
  // console.log('before: ' + result.length)
  // for (const key of result) {
  //   await store.delete(key)
  //   console.log('deleted ' + key)
  // }
  // ;[result] = await store.listKeys('thing/eli@iame.li', null, 50)
  // console.log('after: ' + result.length)
})()
