import React, { useEffect, useState } from 'react'
import Table from '../../ui/Table'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import _find from 'lodash/find'
import { useSelector } from 'react-redux'
import routes from '../../routes'
import { doc, deleteDoc, addDoc, collection } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { withAuthentication, Auth } from '../../hoc/protected'
import { CSVLink } from 'react-csv'

const headers = [
	{label: 'ID', key: 'id'},
	{label: 'Title', key: 'title'},
	{label: 'Creator', key: 'creator'},
	{label: 'Created', key: 'created'},
	{label: 'Cars', key: 'cars'},
	{label: 'Image', key: 'imgUrl'}
]

const MainPage = ({ brigades, getBrigades, setBrigades, deleteSuccses, deleteFailed }) => {
	useEffect(() => {
		getBrigades()
	}, [])

	const { auth } = useSelector((state) => state)
	const [brigadeTable, setBrigadeTable] = useState([])
  
	const handleDeleteBrigade = async (id) => {
		if(confirm('Ви впевнені, що хочете видалити бригаду?')){
			try {
				await deleteDoc(doc(db, 'brigades', id))
				const newBrigades = brigades.filter((brigade) => brigade.id !== id)
				const docRefActions = collection(db, 'actionss')
				await addDoc(docRefActions, {
					date: new Date().toLocaleDateString(),
					action: 'Видалення бригади ' + _find(brigades, {id}).title,
					user: auth.user.email
				})
				deleteSuccses()
				setBrigades(newBrigades)
			} catch (error) {
				console.log(error)
				deleteFailed()
			}
		}
	}

	const handleDownloadTable = () => {
		const newTable = brigades.map((brigade) => {
			let carInfoString = ''

			for (const car of brigade.cars) {
				const { make, model } = car
        
				carInfoString += `${make} ${model}, `
			}
    
			carInfoString = carInfoString.slice(0, -2)
    
			return {
				...brigade,
				cars: carInfoString
			}
		})

		setBrigadeTable(newTable)
	}


	return (
		<div className='mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px]'>
			<div className="flex justify-between mb-6">
				<div className="flex items-end justify-between">
					<h2 className="flex items-baseline mt-2 text-3xl font-bold text-gray-900">Панель управління бригадами
					</h2>
				</div>

				<div className='flex justify-center items-center gap-5'>
					<CSVLink  filename={'brigades.csv'} target="_blank" onClick={handleDownloadTable} headers={headers} data={brigadeTable} separator={';'} className='!pl-2 inline-flex justify-center items-center cursor-pointer text-center border border-transparent leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-sm'>
          Завантажити таблицю
					</CSVLink>
					<Link to={routes.new_brigade} className="!pl-2 inline-flex justify-center items-center cursor-pointer text-center border border-transparent leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-sm">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
						</svg>
          Додати бригаду
					</Link>
				</div>
			</div>
      
			<div className='py-8 mx-auto max-w-[1200px]'>
				{brigades.length === 0 ? <div className='text-4xl font-semibold flex justify-center items-center text-emerald-700 mt-20'>Бригади відсутні</div> : 
					<Table isImage settignsLink={{route: routes.edit_brigade, param: ':id'}} hasDeleteMethod onClickDeleteProject={(id) => handleDeleteBrigade(id)}  fieldsName={['title', 'creator', 'created', 'cars']} results={brigades} spreadsheetTitles={['Назва', 'Ким створена', 'Коли створено', 'Автомобілі', 'Видалити']}>
					</Table>}
			</div>
		</div>
	)
}

MainPage.propTypes = {
	brigades: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
	getBrigades: PropTypes.func.isRequired,
	setBrigades: PropTypes.func.isRequired,
	deleteSuccses: PropTypes.func.isRequired,
	deleteFailed: PropTypes.func.isRequired,
}

export default React.memo(withAuthentication(MainPage, Auth.authenticated))