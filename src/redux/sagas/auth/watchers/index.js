import { takeLatest, all, call } from 'redux-saga/effects'
import { types } from '../../../action/auth/types'
import loginInWorker from '../workers/loginIn'
import signupWorder from '../workers/signup'
import logoutWorker from '../workers/logout'

function* watchLogin() {
	yield takeLatest(types.LOGIN_ASYNC, loginInWorker)
	yield takeLatest(types.SIGNUP_ASYNC, signupWorder)
	yield takeLatest(types.LOGOUT, logoutWorker)
}

export default function* watchAuth() {
	yield all([
		call(watchLogin),
	])
}
