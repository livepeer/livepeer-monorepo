import { combineReducers } from 'redux'
import routing from './routing'
import jobs from './jobs'

const reducers = [routing, jobs].reduce((a, b) => b(a), {})

export default combineReducers(reducers)
