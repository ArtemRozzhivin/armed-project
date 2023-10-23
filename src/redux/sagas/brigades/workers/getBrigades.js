import { call, put } from 'redux-saga/effects'
import Debug from 'debug'

import { getAccessToken } from '../../../../utils/accessToken'
import { brigadesActions } from '../../../action/brigades'
import { db } from '../../../../firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

const debug = Debug('courses:rx:s:initialise')

export default function* initialise() {
	try {
		const token = yield call(getAccessToken)

		if (token) {
			let brigades
			yield put(brigadesActions.setBrigadesLoading(true))
			try {
				const querySnapshot =  yield call(getDocs, collection(db, 'brigades'))
				brigades = querySnapshot.docs.map(doc => {
					return { ...doc.data(), id: doc.id }
				})
				yield put(brigadesActions.setBrigades(brigades))
			} catch (e) {
				yield put(brigadesActions.setError(e))
			}
			yield put(brigadesActions.setBrigadesLoading(false))
		}

	} catch (e) {
		debug('An error occured whilst initialising: %s', e)
	}
}
