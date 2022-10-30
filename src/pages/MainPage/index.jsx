import React from 'react'
import { withAuthentication, auth } from '../../hoc/protected'
import { Link } from 'react-router-dom'
import routes from '../../routes'

const MainPage = () => {
	return (
		<div className='mx-auto  text-center h-screen'>
			<div className='pt-16 text-2xl text-gray-700'>
				<p className=''>To access courses -
					<Link to={routes.singin} className='px-2 underline underline-offset-2  hover:text-gray-900'>
						sign in to your account.
					</Link>
				</p>
				<p className='mt-10'>Many different courses</p>
			</div>
		</div>
	)
}

export default React.memo(withAuthentication(MainPage, auth.notAuthenticated))