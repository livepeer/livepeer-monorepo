import { combineReducers } from 'redux'
import * as routing from './routing'

export const rootReducer = combineReducers({
  routing: routing.reducer,
})
