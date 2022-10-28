import { types } from '../action/courses/types'

const getInitialState = () => {
	return {
		courses: [],
		isLoading: true,
		error: null,
	}
}

// eslint-disable-next-line default-param-last
const coursesReducer = (state = getInitialState(), { type, payload }) => {
	switch (type) {
	case types.SET_COURSES: {
		const { courses } = payload
		return {
			...state,
			courses,
			isLoading: false,
		}
	}

	case types.SET_COURSES_LOADING: {
		const { isLoading } = payload
		return {
			...state,
			isLoading,
		}
	}

	case types.SET_ERROR: {
		const { error } = payload
		return {
			...state,
			error,
		}
	}

	default:
		return state
	}
}

export default coursesReducer
