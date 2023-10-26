import { fork } from 'redux-saga/effects'
import watchAuth from './auth/watchers'
import mainBrigadesSaga from './brigades/watchers'

export default function* rootSaga() {
	yield fork(watchAuth)
	yield fork(mainBrigadesSaga)
}
