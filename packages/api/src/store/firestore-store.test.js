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
    expect(store.getPath('user+email/example@livepeer.org/ABC123')).toBe(
      'staging/docs/user+email_example@livepeer.org/ABC123',
    )
    expect(store.getPath('user+email/example@livepeer.org/')).toBe(
      'staging/docs/user+email_example@livepeer.org',
    )
    expect(store.getPath('user+email/example@livepeer.org')).toBe(
      'staging/docs/user+email_example@livepeer.org',
    )
  })
})
