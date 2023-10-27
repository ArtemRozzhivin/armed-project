import { call, put } from 'redux-saga/effects'
import { authActions } from '../../../action/auth'
import { errorsAction } from '../../../action/errors'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { AlertsAction } from '../../../action/alerts'
import { auth } from '../../../../firebaseConfig'
import { setAccessToken } from '../../../../utils/accessToken'

export default function* loginInWorker({ payload: { credentials, callback } }) {
	try {
		const result = yield call(signInWithEmailAndPassword, auth, credentials.email, credentials.password)
		yield put(AlertsAction.authAlerts('Успішний вхід в систему', 'success'))
		setAccessToken(result.user.accessToken)
		yield put(authActions.loginSuccess(result.user))
		callback(true, false)
	} catch (error) {
		yield put(errorsAction.loginFailed(error.message))
		callback(false, false)
	} finally {
		yield put(authActions.finishLoading())
	}
}
