import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import routes from '../../../routes'
import { doc, updateDoc, arrayRemove } from 'firebase/firestore'
import { db } from '../../../firebaseConfig'
import Table from '../../../ui/Table'
import { useParams } from 'react-router-dom'
import _replace from 'lodash/replace'
import Button from '../../../ui/Button'

const Cars = ({ brigades, deleteSuccses, deleteFailed }) => {
	const { id } = useParams()
	const [brigade, setBrigade] = useState(null)

	useEffect(() => {
		const brigade  = brigades.find((brigade) => brigade.id === id)
		setBrigade(brigade)
	}, [brigades])

  
	const handleDeleteCar = async (carId) => {
    
		if(confirm('Ви впевнені, що хочете видалити автомобіль?')){
			try {
				const car = brigade.cars.find((car) => car.id === carId)
				const docRef = doc(db, 'brigades', id)
				await updateDoc(docRef, {
					cars: arrayRemove(car)
				})
				deleteSuccses()
				setBrigade({ ...brigade, cars: brigade.cars.filter(c => c.id !== carId) })
			} catch (error) {
				console.log(error)
				deleteFailed()
			}
		}
	}

	return (
		<div className='mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px]'>
			<div className="flex justify-between mb-6">
				<Link to={'../..'} relative="path">
					<Button primary large className='h-10'>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
							<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
						</svg>
					</Button> 
				</Link>

				<div className="flex items-end justify-between">
					{brigade && brigade.cars.length === 0 ? <></> : <h2 className="flex items-baseline mt-2 text-3xl font-bold text-gray-900">Автомобілі бригади {brigade && brigade.title}
					</h2>}
				</div>

				<Link to={brigade && _replace(routes.new_car, ':id', brigade.id)} className="!pl-2 inline-flex justify-center items-center cursor-pointer text-center border border-transparent leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-sm">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
						<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
					</svg>
          Додати автомобіль
				</Link>
			</div>
      
			<div className='py-8 mx-auto max-w-[1200px]'>
				{brigade && (brigade.cars.length === 0 ? <div className='text-4xl font-semibold flex justify-center items-center text-emerald-700 mt-20'>Автомобілі відсутні</div> : 
					<Table settignsLink={{route: brigade && _replace(routes.edit_car, ':id', brigade.id), param: ':carId'}} hasDeleteMethod onClickDeleteProject={(id) => handleDeleteCar(id)}  fieldsName={['make', 'model', 'category', 'year', 'engine', 'mileage']} results={brigade.cars} spreadsheetTitles={['Марка', 'Модель', 'Тип', 'Рік', 'Двигун', 'Пробіг', 'Змінити / Видалити']}>
					</Table>)}
			</div>
		</div>
	)
}

Cars.propTypes = {
	brigades: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
	deleteSuccses: PropTypes.func.isRequired,
	deleteFailed: PropTypes.func.isRequired,
}

export default React.memo(Cars)