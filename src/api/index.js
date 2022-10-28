import axios from 'axios'
// import { store } from 'redux/store'
import Debug from 'debug'
import _isEmpty from 'lodash/isEmpty'
// import { authActions } from 'redux/actions/auth'

const debug = Debug('app:api')

const api = axios.create({
	baseURL: 'https://63090aeb722029d9ddddad9e.mockapi.io/'
})

// api.interceptors.request.use(
// 	(config) => {
// 		if (token) {
// 			// eslint-disable-next-line no-param-reassign
// 			config.headers.Authorization = `Bearer ${token}`
// 		}
// 		return config
// 	},
// 	(error) => {
// 		return Promise.reject(error)
// 	},
// )

// api.interceptors.response.use(
// 	(response) => response,
// 	(error) => {
// 		if (error.response?.data.statusCode === 401) {
// 			removeAccessToken()
// 			store.dispatch(authActions.logout())
// 		}
// 		return Promise.reject(error)
// 	},
// )

export const authMe = () =>
	api
		.get('/users/get')
		.then((response) => response.data)
		.catch((error) => {
			debug('%s', error)
			throw _isEmpty(error.response.data?.message)
				? error.response.data
				: error.response.data.message
		})
