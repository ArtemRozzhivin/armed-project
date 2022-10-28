import types from './types'

const authAlerts = (message, type) => ({
	type: types.AUTH_ALERTS,
	payload: { message, type },
})

const generateAlerts = (message, type) => ({
	type: types.GENERATE_ALERTS,
	payload: { message, type },
})

const clearAlerts = () => ({
	type: types.CLEAR_ALERTS,
})

export const AlertsAction = {
	authAlerts,
	clearAlerts,
	generateAlerts
}
