import { call, put } from 'redux-saga/effects'
import Debug from 'debug'

import { getAccessToken } from '../../../../utils/accessToken'
import { coursesActions } from '../../../action/courses'
import { db } from '../../../../firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

const debug = Debug('courses:rx:s:initialise')

export default function* initialise() {
	try {
		const token = yield call(getAccessToken)

		if (token) {
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
		}

	} catch (e) {
		debug('An error occured whilst initialising: %s', e)
	}
}
