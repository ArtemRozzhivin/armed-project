import React, { memo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Popover } from '@headlessui/react'
import routes from '../../routes'
import { authActions } from '../../redux/action/auth'
import { auth } from '../../firebaseConfig'

// eslint-disable-next-line react/prop-types
const Header = ({ authenticated }) => {
	const dispatch = useDispatch()
	const buttonRef = useRef()

	const logoutHandler = async () => {
		await auth.signOut()
		dispatch(authActions.logout())
	}
	console.log('auth', authenticated)

	return (
		<><Popover className='relative bg-white'>
			<header className='bg-emerald-600'>
				<nav className='mx-auto px-4 sm:px-6 lg:px-8' aria-label='Top'>
					<div className='w-full py-4 flex items-center justify-between border-b border-emerald-500 lg:border-none'>
						<div className='flex items-center'>
							<Link to={routes.main} className='text-white color: rgb(255 255 255); text-3xl '>
								<span>Armed</span>
							</Link>
						</div>

						{authenticated && (
							<div>
								<Link to={routes.main} className='text-base font-medium select-none text-white hover:text-emerald-50 py-2 px-3  hover:bg-emerald-500 rounded-md'>
										Панель
								</Link>
								<Link to={routes.users} className='text-base font-medium select-none text-white hover:text-emerald-50 py-2 px-3  hover:bg-emerald-500 rounded-md'>
										Користувачі
								</Link>
							</div>)}


						<div className='hidden md:flex justify-center items-center flex-wrap ml-1 md:ml-10 space-y-1 sm:space-y-0 space-x-2 md:space-x-4'>
							{authenticated ? (
								<>
									<Link to='#' className='text-base font-medium select-none text-white hover:text-emerald-50 py-2 px-3  hover:bg-emerald-500 rounded-md' onClick={logoutHandler}>
										Вийти
									</Link>
								</>
							) : (
								<>
									<Link to={routes.singin} className='inline-block select-none bg-emerald-500  mt-1 sm:mt-0 py-2 px-3 md:px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75 '>
										Увійти
									</Link>
									<Link to={routes.singup} className='inline-block select-none bg-emerald-500  mt-1 sm:mt-0 py-2 px-3 md:px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-opacity-75'>
										Зареєструватись
									</Link>
								</>
							)}
						</div>
					</div>
				</nav>
			</header>

			<Popover.Panel focus className='absolute top-0 z-50 inset-x-0 p-2 transition transform origin-top-right md:hidden'>
				<div className='rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-whitedivide-y-2 divide-gray-50 '>
					<div className='pt-5 pb-6 px-5'>
						<div className='flex items-center justify-between'>
							<Link to={routes.main}>
								<span className='sr-only'>Technical-assessment</span>
							</Link>
						</div>
					</div>
					<div className='py-6 px-5 space-y-6'>
						<div className='grid grid-cols-1 gap-y-4'>
							{authenticated ? (
								<>
									<div onClick={() => buttonRef.current?.click()}>
										<Link to={routes.dashboard} className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700'>
											Armed
										</Link>
									</div>
									<div onClick={() => buttonRef.current?.click()}>
										<Link to='#' className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-emerald-600 bg-gray-50 hover:bg-emerald-50' onClick={logoutHandler}>
											Вийти
										</Link>
									</div>
								</>
							) : (
								<>
									<div onClick={() => buttonRef.current?.click()}>
										<Link to={routes.signin} className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-emerald-600 bg-gray-50 hover:bg-emerald-50'>
											Увійти
										</Link>
									</div>
									<div onClick={() => buttonRef.current?.click()}>
										<Link to={routes.singup} className='w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-emerald-600 bg-gray-50 hover:bg-emerald-50'>
											Зареєструватись
										</Link>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</Popover.Panel>
		</Popover>
		</>
	)
}

export default memo(Header)
