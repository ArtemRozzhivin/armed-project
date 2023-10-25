import React, {  } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import routes from '../../../routes'
// import { doc, deleteDoc } from 'firebase/firestore'
// import { db } from '../../firebaseConfig'
import Table from '../../../ui/Table'
import { useParams } from 'react-router-dom'
import _replace from 'lodash/replace'

const Cars = ({ brigades }) => {
	const { id } = useParams()
	console.log(id)

	const [ brigade ] = brigades.filter((brigade) => brigade.id === id)


	console.log('brigade', brigade)


	// const handleEditBrigade = () => {
    
	// }

	// useEffect(() => {
	// 	getBrigades()
	// }, [])

  
	const handleDeleteBrigade = async (id) => {
		console.log(id)
	// 	if(confirm('Ви впевнені, що хочете видалити бригаду?')){
	// 		try {
	// 			await deleteDoc(doc(db, 'brigades', id))
	// 			const newBrigades = brigades.filter((brigade) => brigade.id !== id)
	// 			deleteSuccses()
	// 			setBrigades(newBrigades)
	// 		} catch (error) {
	// 			console.log(error)
	// 			deleteFailed()
	// 		}
	// 	}
	}

	return (
		<div className='mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px]'>
			<div className="flex justify-between mb-6">
				<div className="flex items-end justify-between">
					<h2 className="flex items-baseline mt-2 text-3xl font-bold text-gray-900">Автомобілі бригади {brigade.title}
						{/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="ml-2 w-5 h-5 text-gray-900  cursor-pointer hover:opacity-80">
							<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
						</svg> */}
					</h2>
				</div>

				<Link to={_replace(routes.new_car, ':id', brigade.id)} className="!pl-2 inline-flex justify-center items-center cursor-pointer text-center border border-transparent leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 shadow-sm text-white bg-slate-900 hover:bg-slate-700 dark:text-gray-50 dark:border-gray-800 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-2 text-sm">
					{/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"></path>
					</svg> */}
          Додати автомобіль
				</Link>
			</div>
      
			<div className='py-8 mx-auto max-w-[1200px]'>
				{brigade.cars.length === 0 ? <div>Пусто</div> : 
					<Table hasDeleteMethod onClickDeleteProject={(id) => handleDeleteBrigade(id)}  fieldsName={['make', 'model', 'category', 'year', 'mileage']} results={brigade.cars} spreadsheetTitles={['Марка', 'Модель', 'Тип', 'Рік', 'Пробіг', 'Змінити / Видалити']}>
					</Table>}
			</div>
		</div>
	)
}

Cars.propTypes = {
	brigades: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
}

export default React.memo(Cars)