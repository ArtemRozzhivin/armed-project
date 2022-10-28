import { call, put } from 'redux-saga/effects'
import { authActions } from '../../../action/auth'
import { errorsAction } from '../../../action/errors'
import { coursesActions } from '../../../action/courses'

import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../../../firebaseConfig'
import { getDocs, collection } from 'firebase/firestore'

import { setAccessToken } from '../../../../utils/accessToken'

export default function* signupWorder({ payload: { credentials, callback } }) {
	try {
		const result = yield call(createUserWithEmailAndPassword, auth, credentials.email, credentials.password)
		setAccessToken(result.user.accessToken)
		yield put(authActions.signupSuccess(result.user))

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
		callback(true)
	} catch (error) {
		yield put(errorsAction.signupFailed(error.message))
		callback(false)
	} finally {
		yield put(authActions.finishLoading())
	}
}
