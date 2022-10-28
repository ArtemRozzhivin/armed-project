import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import routes from '../routes'

export const auth = {
	authenticated: {
		selector: state => state.auth.authenticated,
		redirectPath: routes.singin,
	},
	notAuthenticated: {
		selector: state => !state.auth.authenticated,
		redirectPath: routes.courses,
	},
}

export const withAuthentication = (WrappedComponent, authParam) => {
	const WithAuthentication = (params) => {
		const selector = useSelector(authParam.selector)

		if (!selector) {
			return <Navigate to={authParam.redirectPath} />
		}

		return <WrappedComponent {...params} />
	}

	return WithAuthentication
}
