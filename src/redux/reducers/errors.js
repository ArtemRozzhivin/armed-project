import types from '../action/errors/types'

const initialState = {
	error: null,
}

const errorsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
	case types.GENERIC_ERROR:
	case types.LOGIN_FAILED:
	case types.SING_UP_FAILED:
		return { ...state, error: payload.error }

	case types.CLEAR_ERRORS:
		return { ...state, error: null }

	default:
		return state
	}
}

export default errorsReducer
