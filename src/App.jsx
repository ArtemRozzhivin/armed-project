import React, { useEffect, useState, Suspense, lazy } from 'react'
import {
	Routes,
	Route,
	Navigate
} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import { errorsAction } from './redux/action/errors'
import { AlertsAction } from './redux/action/alerts'
import { authActions } from './redux/action/auth'
import Header from './components/Header'
import routes from './routes'
import Loader from './ui/Loader'

import './App.css'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from './firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

const MainPage = lazy(() => import('./pages/MainPage'))
const Signin = lazy(() => import('./pages/Auth/SignIn'))
const Courses = lazy(() => import('./pages/Courses'))
const Singup = lazy(() => import('./pages/Auth/Signup'))
const CourseView = lazy(() => import('./pages/CourseView'))
const CourseSettings = lazy(() => import('./pages/CourseSettings'))

const Fallback = () => {
	const [showLoader, setShowLoader] = useState(false)

	useEffect(() => {
		let isMounted = true

		setTimeout(() => {
			if (isMounted) {
				setShowLoader(true)
			}
		}, 1000)

		return () => {
			isMounted = false
		}
	}, [])

	return (
		<div className='bg-gray-50'>
			{showLoader && (
				<Loader />
			)}
		</div>
	)
}

const App = () => {
	const dispatch = useDispatch()
	const { error } = useSelector((state) => state.errors)
	const { message, type } = useSelector((state) => state.alerts)
	const { loading, authenticated } = useSelector(state => state.auth)

	useEffect(() => {
		if (!authenticated) {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					getDocs(collection(db, 'users')).then((querySnapshot) => {
						const userNotes = []
						querySnapshot.forEach((doc) => {
							if (doc.id === user.uid) {
								userNotes.push(...doc.data().notes)
							}
						})
						dispatch(authActions.loginSuccess({...user, notes: userNotes}))
					})
				} else {
					dispatch(authActions.logout())
				}
				dispatch(authActions.finishLoading())
			})
		}
	}, [authenticated])

	useEffect(() => {
		const loaderEl = document.getElementById('loader')

		if (loaderEl) {
			if (authenticated || !loading) {	
				loaderEl.classList.add('available')
			} else {
				loaderEl.classList.remove('available')
			}
		}
	}, [authenticated, loading])

	useEffect(() => {
		if (error) {
			toast.error(error, { onClose: () =>  dispatch(errorsAction.clearErrors())})
		}
	}, [error])

	useEffect(() => {
		if (message && type) {
			const clearAlert = () => dispatch(AlertsAction.clearAlerts())
			switch (type) {
			case 'success':
				toast.success(message, { onClose: () => clearAlert()  })
				break
			case 'error':
				toast.error(message, { onClose: () => clearAlert() })
				break
			default:
				toast.info(message, { onClose: () => clearAlert() })
			}
		}
	}, [message, type])

	return ((!authenticated || !loading) && (
		<Suspense fallback={<></>}>
			<Header authenticated={authenticated} />
			<Suspense fallback={<Fallback />} >
				<Routes>
					<Route index element={<MainPage />} />
					<Route path={routes.courses} element={<Courses />} />
					<Route path={routes.singin} element={<Signin />} />
					<Route path={routes.singup} element={<Singup />} />
					<Route path={routes.courseView} element={<CourseView />} />
					<Route path={routes.courses_settings} element={<CourseSettings />} />
					<Route path={routes.new_courses} element={<CourseSettings />} />
					<Route
						path="*"
						element={<Navigate to="/" replace />}
					/>
				</Routes>
			</Suspense>
			<ToastContainer />
		</Suspense>
	)
	)
}

export default App
