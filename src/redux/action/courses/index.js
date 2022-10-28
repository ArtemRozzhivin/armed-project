import { types } from './types'

export const coursesActions = {
	setCourses: (courses) => ({
		type: types.SET_COURSES,
		payload: {
			courses,
		},  
	}),
	setCoursesLoading: (isLoading) => ({
		type: types.SET_COURSES_LOADING,
		payload: {
			isLoading,
		},
	}),
}
