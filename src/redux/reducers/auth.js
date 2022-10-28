import { types } from '../action/auth/types'

const initialState = {
	redirectPath: null,
	authenticated: false,
	loading: true,
	user: {},
	dontRemember: false,
}

// eslint-disable-next-line default-param-last
const authReducer = (state = initialState, { type, payload }) => {
	switch (type) {
	case types.SIGNUP_UP_SUCCESSFUL:
	case types.LOGIN_SUCCESSFUL: {
		const { user } = payload

		return {
			...state,
			user: user,
			authenticated: true,
		}
	}

	case types.SET_USER: {
		const { user } = payload

		return {
			...state,
			user: user,
		}
	}

	case types.UPDATE_USER_PROFILE_SUCCESS:
		return { ...state, user: payload.user }

	case types.SAVE_PATH:
		return { ...state, redirectPath: payload.path }

	case types.ASYNC_LOGOUT:
	case types.DELETE_ACCOUNT_SUCCESS:
		return { ...state, authenticated: false, user: {} }

	case types.FINISH_LOADING:
		return { ...state, loading: false }

	case types.SET_DONT_REMEMBER: {
		const { dontRemember } = payload
		return { ...state, dontRemember }
	}

	case types.UPDATE_USER_DATA: {
		const { data } = payload

		return {
			...state,
			user: {
				...state.user,
				...data,
			},
		}
	}

	default:
		return state
	}
}

export default authReducer
