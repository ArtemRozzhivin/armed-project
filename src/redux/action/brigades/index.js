import types from './types'

const setError = (error) => ({
	type: types.SET_ERROR,
	payload: { error },
})

const setBrigades = (brigades) => ({
	type: types.SET_BRIGADES,
	payload: { brigades },
})

const setBrigadesLoading = (isLoading) => ({
	type: types.SET_BRIGADES_LOADING,
	payload: { isLoading },
})

const brigadeDeleted = () => ({
	type: types.DELETE_BRIGADE,
})

const getBrigades = () => ({
	type: types.GET_BRIGADES,
})

export const brigadesActions = {
	setBrigades,
	setBrigadesLoading,
	setError,
	brigadeDeleted,
	getBrigades
}