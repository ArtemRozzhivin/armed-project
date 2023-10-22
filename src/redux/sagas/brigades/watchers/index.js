import { fork } from 'redux-saga/effects'

import initialise from '../workers/initialise'

function* mainBrigadesSaga() {
	yield fork(initialise)
}

export default mainBrigadesSaga
