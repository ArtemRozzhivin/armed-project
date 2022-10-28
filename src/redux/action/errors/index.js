import types from './types'

const genericError = (error) => ({
	type: types.GENERIC_ERROR,
	payload: { error },
})

const loginFailed = (error) => ({
	type: types.LOGIN_FAILED,
	payload: { error },
})

const signupFailed = (error) => ({
	type: types.SING_UP_FAILED,
	payload: { error },
})

const clearErrors = () => ({
	type: types.CLEAR_ERRORS,
})

export const errorsAction = {
	genericError,
	loginFailed,
	clearErrors,
	signupFailed,
}