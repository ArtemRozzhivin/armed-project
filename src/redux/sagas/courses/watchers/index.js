import { fork } from 'redux-saga/effects'

import initialise from '../workers/initialise'

function* mainCoursesSaga() {
	yield fork(initialise)
}

export default mainCoursesSaga
