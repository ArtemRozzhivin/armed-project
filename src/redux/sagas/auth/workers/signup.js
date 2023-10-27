import { call, put } from 'redux-saga/effects'
import { authActions } from '../../../action/auth'
import { errorsAction } from '../../../action/errors'

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../../firebaseConfig'

import { setAccessToken } from '../../../../utils/accessToken'

export default function* signupWorder({ payload: { credentials, callback } }) {
	try {
		const result = yield call(createUserWithEmailAndPassword, auth, credentials.email, credentials.password)
		setAccessToken(result.user.accessToken)
		yield put(authActions.signupSuccess(result.user))
		callback(true)
	} catch (error) {
		yield put(errorsAction.signupFailed(error.message))
		callback(false)
	} finally {
		yield put(authActions.finishLoading())
	}
}
