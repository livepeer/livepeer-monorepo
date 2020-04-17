import FirestoreStore from './firestore-store'

// Don't worry, I revoked this
const MOCK_CREDENTIALS = {
  type: 'service_account',
  project_id: 'livepeerexample',
  private_key_id: 'fdb5583705dc15c155a4f5d414396a5769a3cf92',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCI4JlH94CPI49I\n1fRUtvFOQru4YkUGBlKCtmBbAJF723MDlqYq3pYWyoJdRhpSEfD+ZrsW9u3LDLWA\nvM4OiPcaD+XA61jIDWyBC0jRTJyaTUsvkRemJ0T1n6gejF/+lIVAX8Vu8PtQdK3K\nO7Ei/C+9KAHB7D0ir3W146h9phwWFlRyC9MtuQ8/FiigrIsZsL0e80cBvxPfBDok\nOR9xg0Prjy+B9tWMloTwdpSMqszI2OWE9qxHWHgM+cpnfdDfcA35MPWpU8UEzUkx\n3EjQfBNV+k7iZnRFuHvaPlS4cOFZnYY5Mn4PeK3wunH1gMGSrb0qwsFBhZjkhXMs\nW5Js36pZAgMBAAECggEAAQjck78Oz1YsGTd3zDOhTY+C0n0YqzfdRAxrnEh78Qka\nvJRVD3YlAYlYlKqo3IWy8gNWBvGJINuo3A8hShoWLxHfcVa+Ei4Ky8tpap6XAPIU\nX0jMGlcJ5gblywxR1e9qte67Y/ApoCUvopuSplJsbHQ61ivKVwKnQ7+TqJZ6uB6C\ngrCxGoMj+cO6Q/DDGb/xNv7VSvzsAp9BzhWhvJDf5aaKB7yTkRC+nMxnqR1HAfRM\nVPxx+JDmtjwmVytBjTdbXQ2TLCY7PPjQTEXhGbkD0sqo2E3s/f1INwogz7hBTFSD\nH7vor2XpcZj47o6LeL+jey89LfPPk2Ds3amYjmswQQKBgQC72tmRwONbfefb35Pb\nelBx7S227va/y/kjo59Z2O0K+RP9PfspIxg04YE8xLzgmaVbLup2+qhCOtOANqLP\nZx2IH5wQzQffcuJuZvvzkUUuyfikXYAypxeMogYLMGgMMSOMH8yMPtYMhuD2B9oP\n+btI5oMuYe7LWL+f1SaSzO1UQQKBgQC6h7exAkB89dodH6cqvUM+PhXF6TMsdA9T\nDCn7PTA9+QndDE88Mo3J7oV7K6KrA9PaSkbii1lw/IhPUrgjZeUNrjQ0Q6M55NV2\nbYGBL2SanjtYf7iP05YKgeCkC+iGThsK1PjyG8bSgLIhBkZdNe07cpSGb7YNuP2T\neRNsh1ZwGQKBgHEhf12TuFhlHrj/kF/g7YluuNUuXFNtV4DrDRBi3354Ol2McjF3\n/R/7noUmRklMvpSHUJSOp74bBzxzquEUzGgqASbtEwyyd0LdqmYo2m0vHRp/ZLEc\nh8Yd3V3nrQGKpknA7MKZJPcuU1RXri9oyi1BBUdtmw3DSMPM7goCd/sBAoGAePxG\nfR1Ezsh4LKO3PdV8pAaJANF9S7wLpIYjRL4vaEL7ztCJJDZ2GSAInBd1bw8Qfmnn\nCFHyNYLWtvykSvFwXCs92Rh16rsuaZ4lfbFLw64WOBS/lSpcC3yqRD0lGNfYWnJA\n9mhl0WuAHkN/qD2uHfz3sSsMHmJ6twi1PJOb0SECgYATLJTmX3k70TobZ5oyl1Ob\nORcxprn5kXdAt7hKcxuo5+QHAldJi4wkibIm1KTepT52JzJ3VsLxex7p28fdPHFq\niQh7TnnVMKXw1fw7t4hk9iz4+aJpR39ZGEIsmNudCGaznRpZqPqslkZSd0XHJfQW\n5gmmBpVf285VnC/kkjFU2Q==\n-----END PRIVATE KEY-----\n',
  client_email: 'api-staging@livepeerexample.iam.gserviceaccount.com',
  client_id: '116271409169475117895',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/api-staging%40livepeerexample.iam.gserviceaccount.com',
}

describe('firestoreStore', () => {
  let store
  beforeEach(() => {
    store = new FirestoreStore({
      firestoreCollection: 'staging',
      firestoreCredentials: JSON.stringify(MOCK_CREDENTIALS),
    })
  })
  it('should change urls correctly', () => {
    expect(store.getPath('user/ABC123')).toBe('staging/docs/user/ABC123')
    expect(store.getPath('user+email/example@livepeer.org/ABC123')).toBe(
      'staging/docs/user%2Bemail_example%40livepeer.org/ABC123',
    )
    expect(store.getPath('user+email/example@livepeer.org/')).toBe(
      'staging/docs/user%2Bemail_example%40livepeer.org',
    )
    expect(store.getPath('user+email/example@livepeer.org')).toBe(
      'staging/docs/user%2Bemail_example%40livepeer.org',
    )
  })
})
