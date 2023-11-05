import React, { useEffect, useRef, useState } from 'react'
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
import Button from '../../ui/Button'
import Modal from '../../ui/Modal'
import html2canvas from 'html2canvas'

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
	const [isModalOpen, setIsModalOpen] = useState(false)
	const tableRef = useRef(null)

	console.log(tableRef)
  
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
				<div className="flex items-end justify-between">
					<h2 className="flex items-baseline mt-2 text-3xl font-bold text-gray-900">Панель управління бригадами
					</h2>
				</div>

				<div className='flex justify-center items-center gap-5'>
					<Button primary onClick={() => setIsModalOpen(true)} large className='flex items-center gap-1 h-10'>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
							<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
						</svg>
						Експортувати таблицю
					</Button>
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
					<Table ref={tableRef} isImage settignsLink={{route: routes.edit_brigade, param: ':id'}} hasDeleteMethod onClickDeleteProject={(id) => handleDeleteBrigade(id)}  fieldsName={['title', 'creator', 'created', 'cars']} results={brigades} spreadsheetTitles={['Назва', 'Ким створена', 'Коли створено', 'Автомобілі', 'Видалити']}>
					</Table>}
			</div>

			<Modal
				isOpened={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				message={(
					<div className='py-5'>
						<h5 className='text-2xl mb-5'>Експортувати таблицю як:</h5>
						<div className='flex justify-center items-center gap-5'>
							<CSVLink filename={'brigades.csv'} target="_blank" onClick={handleDownloadTable} headers={headers} data={brigadeTable} separator={';'} >
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

MainPage.propTypes = {
	brigades: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
	getBrigades: PropTypes.func.isRequired,
	setBrigades: PropTypes.func.isRequired,
	deleteSuccses: PropTypes.func.isRequired,
	deleteFailed: PropTypes.func.isRequired,
}

export default React.memo(withAuthentication(MainPage, Auth.authenticated))