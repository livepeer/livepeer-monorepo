import realFetch from 'isomorphic-fetch'

let mocks = {}

export const setMock = (url, responseGenerator) => {
  mocks[url] = responseGenerator
}
export const clearMocks = () => {
  mocks = {}
}

export default async (url, params) => {
  if (mocks[url]) {
    return mocks[url]()
  }
  return realFetch(url, params)
}
