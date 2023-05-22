import { call, put } from 'redux-saga/effects'
import { authActions } from '../../../action/auth'
import { errorsAction } from '../../../action/errors'
import { removeAccessToken } from '../../../../utils/accessToken'
import { coursesActions } from '../../../action/courses'

export default function* logoutWorker() {
	try {
		console.log('logoutWorker')
		yield call(removeAccessToken)
		yield put(authActions.asyncLogout())
		yield put(coursesActions.setCourses([]))
		yield put(coursesActions.setCoursesLoading(true))
		yield put(errorsAction.clearErrors(null))
	} catch (error) {
		yield put(errorsAction.loginFailed(error.message))
	} finally {
		yield put(authActions.finishLoading())
	}
}
