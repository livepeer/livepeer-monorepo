import { combineReducers } from 'redux'
import { fork } from 'redux-saga/effects'
import * as routing from './routing'

export const rootReducer = combineReducers({
  routing: routing.reducer,
})

export function* rootSaga() {
  // yield fork(foo.saga)
}
