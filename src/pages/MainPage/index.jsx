import React from 'react'
import { withAuthentication, auth } from '../../hoc/protected'

const MainPage = () => {
	return (
		<div className='flex flex-column items-center mx-auto mt-5'>
			<h1>Main Page</h1>
			<h3>Please login for view all technical assesment feature</h3>
		</div>
	)
}

export default React.memo(withAuthentication(MainPage, auth.notAuthenticated))
