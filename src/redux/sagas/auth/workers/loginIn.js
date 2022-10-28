import { call, put } from 'redux-saga/effects'
import { authActions } from '../../../action/auth'
import { errorsAction } from '../../../action/errors'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { AlertsAction } from '../../../action/alerts'
import { coursesActions } from '../../../action/courses'
import { auth, db } from '../../../../firebaseConfig'
import { getDocs, collection } from 'firebase/firestore'
import { setAccessToken } from '../../../../utils/accessToken'

export default function* loginInWorker({ payload: { credentials, callback } }) {
	try {
		const result = yield call(signInWithEmailAndPassword, auth, credentials.email, credentials.password)
		yield put(AlertsAction.authAlerts('Login successful', 'success'))
		setAccessToken(result.user.accessToken)
		yield put(authActions.loginSuccess(result.user))
		let courses
		yield put(coursesActions.setCoursesLoading(true))
		try {
			const querySnapshot =  yield call(getDocs, collection(db, 'courses'))
			courses = querySnapshot.docs.map(doc => {
				return { ...doc.data(), id: doc.id }
			})
			yield put(coursesActions.setCourses(courses))
		} catch (e) {
			yield put(coursesActions.setError(e))
		}
		yield put(coursesActions.setCoursesLoading(false))
		callback(true, false)
	} catch (error) {
		yield put(errorsAction.loginFailed(error.message))
		callback(false, false)
	} finally {
		yield put(authActions.finishLoading())
	}
}
