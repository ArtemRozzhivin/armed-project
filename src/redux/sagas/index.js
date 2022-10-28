import { fork } from 'redux-saga/effects'
import watchAuth from './auth/watchers'
import watchCourses from './courses/watchers'

export default function* rootSaga() {
	yield fork(watchAuth)
	yield fork(watchCourses)
}
