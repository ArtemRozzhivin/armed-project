import { takeEvery, fork } from 'redux-saga/effects'
import types  from '../../../action/brigades/types'
import initialise from '../workers/initialise'

function* mainBrigadesSaga() {
	yield fork(initialise)
	yield takeEvery(types.GET_BRIGADES, initialise)
}

export default mainBrigadesSaga
