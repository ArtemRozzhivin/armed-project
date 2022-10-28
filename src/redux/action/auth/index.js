import { types } from './types'
import { setAccessToken } from '../../../utils/accessToken'

export const authActions = {
	loginSuccess(user) {
		setAccessToken(user.accessToken)

		return {
			type: types.LOGIN_SUCCESSFUL,
			payload: { user },
		}
	},

	setUser (user) {
		return {
			type: types.SET_USER,
			payload: { user },
		}
	},
	
	loginAsync(credentials, callback = () => { }) {
		return {
			type: types.LOGIN_ASYNC,
			payload: {
				credentials, callback,
			},
		}
	},

	signupAsync(credentials, callback = () => { }) {
		return {
			type: types.SIGNUP_ASYNC,
			payload: {
				credentials, callback,
			},
		}
	},

	asyncLogout() {
		return {
			type: types.ASYNC_LOGOUT,
		}
	},

	logout() {
		return {
			type: types.LOGOUT,
		}
	},

	signupSuccess(user) {
		return {
			type: types.SIGNUP_UP_SUCCESSFUL,
			payload: { user },
		}
	},

	clearErrors() {
		return {
			type: types.CLEAR_ERRORS,
		}
	},

	finishLoading() {
		return {
			type: types.FINISH_LOADING,
		}
	},

}
