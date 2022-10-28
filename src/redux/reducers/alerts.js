import types from '../action/alerts/types'

const initialState = {
	message: null,
	type: 'success',
}

const alertsReducer = (state = initialState, { type, payload }) => {
	switch (type) {
	case types.AUTH_ALERTS:
	case types.GENERATE_ALERTS:
		return { ...state, message: payload.message, type: payload.type }

	case types.CLEAR_ALERTS:
		return { ...state, message: null }

	default:
		return state
	}
}

export default alertsReducer
