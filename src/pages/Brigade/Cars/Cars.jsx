import React, { useEffect, useState } from 'react'
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
					<Button danger large className='h-10 flex items-center gap-1'>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
						</svg>
						<CSVLink onClick={handleDownloadDeletedTable} target="_blank" headers={tableHeaders} data={brigade ? brigade.cars : []} separator={';'} >
						Видалити таблицю
						</CSVLink>
					</Button>
          
					<Button primary large className='h-10 flex items-center gap-1'>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
						</svg>
						<CSVLink  filename={`${brigade.title}_cars.csv`} target="_blank" headers={tableHeaders} data={brigade.cars} separator={';'} >
						Завантажити таблицю
						</CSVLink>
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