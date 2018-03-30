import { combineReducers } from 'redux'
import { fork } from 'redux-saga/effects'
import * as routing from './routing'
import * as jobs from './jobs'

export const rootReducer = combineReducers({
  routing: routing.reducer,
  jobs: jobs.reducer,
})

export function* rootSaga() {
  yield fork(jobs.saga)
}
