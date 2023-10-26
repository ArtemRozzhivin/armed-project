import types from '../action/brigades/types'


const initialState = {
	brigades: [],
}


const brigadesReducer = (state = initialState, { type, payload }) => {
	switch (type) {
	case types.SET_BRIGADES:
		return { ...state, brigades: payload.brigades }

	default:
		return state
	}
}

export default brigadesReducer
