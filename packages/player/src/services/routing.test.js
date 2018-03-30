import { reducer, types } from './routing'

it('should update the routing location properly', () => {
  const state = {
    location: {
      pathname: '/about-us',
      search: '',
      hash: '',
      key: 'h1xffa',
    },
  }
  const action = {
    type: types.LOCATION_CHANGE,
    payload: {
      pathname: '/',
      search: '',
      hash: '',
      key: 'y0k3nh',
    },
  }
  const nextState = {
    location: {
      pathname: '/',
      search: '',
      hash: '',
      key: 'y0k3nh',
    },
  }
  expect(reducer(state, action)).toEqual(nextState)
})
