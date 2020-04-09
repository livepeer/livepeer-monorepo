import FirestoreStore from './firestore-store'

describe('firestoreStore', () => {
  let store
  beforeEach(() => {
    store = new FirestoreStore({
      collection: 'staging',
    })
  })
  it('should change urls correctly', () => {
    expect(store.getPath('user/ABC123')).toBe('staging/docs/user/ABC123')
    expect(store.getPath('useremail/example@livepeer.org/ABC123')).toBe(
      'staging/docs/useremail/docs/example@livepeer.org/ABC123',
    )
  })
})
