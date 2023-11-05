import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import routes from '../../../routes'
import { doc, updateDoc, arrayRemove, addDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '../../../firebaseConfig'
import Table from '../../../ui/Table'
import { useParams } from 'react-router-dom'
import _replace from 'lodash/replace'
import Button from '../../../ui/Button'
import Input from '../../../ui/Input'
import Modal from '../../../ui/Modal'
import { withAuthentication,  Auth } from '../../../hoc/protected'
import { CSVLink } from 'react-csv'
import html2canvas from 'html2canvas'

const tableHeaders = [
	{label: 'Make', key: 'make'},
	{label: 'Model', key: 'model'},
	{label: 'Year', key: 'year'},
	{label: 'Category', key: 'category'},
	{label: 'Engine', key: 'engine'},
	{label: 'Mileage', key: 'mileage'},
]

const Cars = ({ brigades, deleteSuccses, deleteFailed, userEmail }) => {
	const { id } = useParams()
	const [brigade, setBrigade] = useState({
		id: '',
		title: '',
		cars: [],
		created: '',
		creator: '',
		imgUrl: ''
	})
	const tableRef = useRef(null)
	const [isDownloadModalOpen, setIsDownloadOpen] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [email, setUserEmail] = useState('')
	const [isAccess, setAccess] = useState(true)

	useEffect(() => {
		const brigade = brigades.find((brigade) => brigade.id === id)
		setBrigade(brigade)
	}, [brigades])


	useEffect(() => {

		getDocs(collection(db, 'access')).then((querySnapshot) => {
			const access = querySnapshot.docs.map(doc => {
				return { ...doc.data(), id: doc.id }
			})
			access.forEach((item) => {
				if (item.email.split('@')[0] === userEmail.split('@')[0]) {
					setAccess(false)
				}
			})
		})
	}, [userEmail])

	const handleDeleteCar = async (carId) => {
		if (confirm('Ви впевнені, що хочете видалити автомобіль?')) {
			try {
				const car = brigade.cars.find((car) => car.id === carId)
				const docRef = doc(db, 'brigades', id)
				await updateDoc(docRef, {
					cars: arrayRemove(car)
				})
				const docRefActions = collection(db, 'actionss')
				await addDoc(docRefActions, {
					date: new Date().toLocaleDateString(),
					action: 'Видалення автомобіля' + car.make + ' ' + car.model + ' з бригади ' + brigade.title,
					user: userEmail
				})
				deleteSuccses()
				setBrigade({ ...brigade, cars: brigade.cars.filter(c => c.id !== carId) })
			} catch (error) {
				console.log(error)
				deleteFailed()
			}
		}
	}

	const handleDeleteTable = async () => {
		const docRef = doc(db, 'brigades', id)
		await updateDoc(docRef, {
			cars: []
		})
  
		setBrigade({ ...brigade, cars: [] })
	}

	const handleDownloadDeletedTable = () => {
		if(window.confirm('Ви впевнені, що хочете видалити таблицю?')) {
			handleDeleteTable()
		} else {
			return false
		}
	}

	const handleDownloadScreenshot = () => {
		const table = tableRef.current
		if (!table) return

		html2canvas(table, {useCORS: true}).then(canvas => {
			const dataURL = canvas.toDataURL('image/png')

			const a = document.createElement('a')
			a.href = dataURL
			a.download = 'BrigadesScreenshot.png'

			a.click()
		})
	}
  

	return (
		<div className='mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px]'>
			<div className="flex justify-between mb-6">
				{isAccess && ( <Link to={'../..'} relative="path">
					<Button primary large className='h-10'>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
						</svg>
					</Button>
				</Link>)}
				<div className="flex items-end justify-between">
					{brigade && brigade.cars.length === 0 ? <></> : <h2 className="flex items-baseline mt-2 text-3xl font-bold text-gray-900">Автомобілі бригади {brigade.title}
					</h2>}
				</div>
				{isAccess && (<div className='flex items-center gap-3'>
					<CSVLink onClick={handleDownloadDeletedTable} target="_blank" headers={tableHeaders} data={brigade ? brigade.cars : []} separator={';'} >
						<Button danger large className='h-10 flex items-center gap-1'>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
							</svg>
						Видалити таблицю
						</Button>
					</CSVLink>
          
					<Button primary onClick={() => setIsDownloadOpen(true)} large className='flex items-center gap-1 h-10'>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
							<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
						</svg>
						Експортувати таблицю
					</Button>
          
					<Button primary large className='h-10' onClick={() => setIsModalOpen(true)}>
						Надати доступ
					</Button>

					<Link to={brigade && _replace(routes.new_car, ':id', brigade.id)} className="!pl-2 inline-flex justify-center items-center cursor-pointer text-center border border-transparent leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-sm">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
						</svg>
						Додати автомобіль
					</Link>
				</div>)}
			</div>

			<div className='py-8 mx-auto max-w-[1200px]'>
				{(brigade.cars.length === 0 ? <div className='text-4xl font-semibold flex justify-center items-center text-emerald-700 mt-20'>Автомобілі відсутні</div> :
					<Table
						ref={tableRef}
						settignsLink={{ route: _replace(routes.edit_car, ':id', brigade.id), param: ':carId' }}
						hasDeleteMethod onClickDeleteProject={(id) => handleDeleteCar(id)}
						fieldsName={['make', 'model', 'category', 'year', 'engine', 'mileage']}
						results={brigade.cars}
						spreadsheetTitles={['Марка', 'Модель', 'Тип', 'Рік', 'Двигун', 'Пробіг', 'Змінити / Видалити']}>
					</Table>
				)}
			</div>

			<Modal
				isOpened={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				message={(
					<div>
						<Input
							name='title'
							id='title'
							type='text'
							label='Почта користовача'
							value={email}
							placeholder='Введіть почту користовача'
							className='mt-4'
							onChange={(e) => {
								setUserEmail(e.target.value)
							}}
						/>
					</div>
				)}
				closeText={'Закрити'}
				submitText={'Надати доступ'}
				submitType={'danger'}
				onSubmit={() => {
					setIsModalOpen(false)
					const docRef = collection(db, 'access')
					addDoc(docRef, {
						brigadeId: brigade.id,
						email: email
					})
				}}
			/>
			<Modal
				isOpened={isDownloadModalOpen}
				onClose={() => setIsDownloadOpen(false)}
				message={(
					<div className='py-5'>
						<h5 className='text-2xl mb-5'>Експортувати таблицю як:</h5>
						<div className='flex justify-center items-center gap-5'>
							<CSVLink  filename={`${brigade.title}_cars.csv`} target="_blank" headers={tableHeaders} data={brigade.cars} separator={';'} >
								<Button className='flex items-center gap-2 h-10' primary large>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
										<path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
									</svg>
                  Як таблицю
								</Button>
							</CSVLink>
              
							<Button onClick={handleDownloadScreenshot} primary large className='flex items-center gap-2 h-10'>
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
									<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
								</svg>
                  Як картинку
							</Button>
						</div>
					</div>
				)}
				closeText={'Закрити'}
			/>
		</div>
	)
}

Cars.propTypes = {
	brigades: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
	deleteSuccses: PropTypes.func.isRequired,
	deleteFailed: PropTypes.func.isRequired,
	userEmail: PropTypes.string.isRequired
}

export default React.memo(withAuthentication(Cars, Auth.authenticated))