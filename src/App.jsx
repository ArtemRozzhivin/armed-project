import React, { useEffect, useState, Suspense, lazy } from 'react'
import {
	Routes,
	Route,
	Navigate,
	useNavigate
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
const Singup = lazy(() => import('./pages/Auth/Signup'))
const Users = lazy(() => import('./pages/Users'))
const BrigadeSettings = lazy(() => import('./pages/Brigade/Settings'))
const Cars = lazy(() => import('./pages/Brigade/Cars'))
const CarSettings = lazy(() => import('./pages/Brigade/Cars/Settings'))



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
	const { loading, authenticated, user } = useSelector(state => state.auth)
	const navigate = useNavigate()

	useEffect(() => {
		if (!authenticated) {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					getDocs(collection(db, 'users')).then(() => {
						dispatch(authActions.loginSuccess({...user }))
					})
				} else {
					dispatch(authActions.logout())
				}
				dispatch(authActions.finishLoading())
			})
		}
	}, [authenticated])

	useEffect(() => {
		if (authenticated) {
			getDocs(collection(db, 'access')).then((querySnapshot) => {
				const access = querySnapshot.docs.map(doc => {
					return { ...doc.data(), id: doc.id }
				})

				access.forEach((item) => {
					if (item.email === user.email) {
						navigate(routes.brigade_cars.replace(':id', item.brigadeId))
					}
				})
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
					<Route path={routes.singin} element={<Signin />} />
					<Route path={routes.singup} element={<Singup />} />
					<Route path={routes.users} element={<Users />} />            
					<Route path={routes.new_brigade} element={<BrigadeSettings />} />
					<Route path={routes.edit_brigade} element={<BrigadeSettings />} />
					<Route path={routes.brigade_cars} element={<Cars />} />
					<Route path={routes.new_car} element={<CarSettings />} />
					<Route path={routes.edit_car} element={<CarSettings />} />
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
