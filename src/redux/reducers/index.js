import { combineReducers } from 'redux'
import errors from './errors'
import alerts from './alerts'
import auth from './auth'
import brigades from './brigades'

export default combineReducers({
	errors, alerts, auth, brigades
})
