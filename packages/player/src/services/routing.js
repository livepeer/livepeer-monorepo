import { routerReducer } from 'react-router-redux'
import { push } from 'react-router-redux'
import qs from 'query-string'

export const name = 'routing'

export const types = {
  LOCATION_CHANGE: `@@router/LOCATION_CHANGE`,
}

export const actions = {
  changeURL: url =>
    push(
      `/play?${qs.stringify({
        url,
      })}`,
    ),
  changeDemo: url =>
    push(
      `/demo?${qs.stringify({
        url,
      })}`,
    ),
}

export const initialState = {
  location: {
    pathname: '',
    search: '',
    hash: '',
    key: '',
  },
}

export const reducer = routerReducer

export const selectors = {
  getLocation: state => state.routing.location,
  getParsedQueryString: state => qs.parse(state.routing.location.search),
}

export default reducers => ({ ...reducers, [name]: reducer })
