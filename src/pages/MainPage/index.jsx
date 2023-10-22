import React, { } from 'react'
import Table from '../../ui/Table'
import { Link } from 'react-router-dom'
import { db } from '../../firebaseConfig'
import { getDocs, collection  } from 'firebase/firestore'
import routes from '../../routes'

const MainPage = () => {

	const getBrigades = async () => {
		const querySnapshot = await getDocs(collection(db, 'brigades'))
		const brigades = querySnapshot.docs.map(doc => {
			// doc.data() is never undefined for query doc snapshots
			return { ...doc.data(), id: doc.id }
		})


		console.log(brigades)
	}



	return (
		<div className='mx-auto px-4 sm:px-6 lg:px-8 py-8'>
			<div className="flex justify-between mb-6">
				<div className="flex items-end justify-between">
					<h2 className="flex items-baseline mt-2 text-3xl font-bold text-gray-900">Панель управління
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="ml-2 w-5 h-5 text-gray-900  cursor-pointer hover:opacity-80">
							<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
						</svg>
					</h2>
				</div>
				<span onClick={getBrigades} className="!pl-2 inline-flex justify-center items-center cursor-pointer text-center border border-transparent leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 shadow-sm text-white bg-slate-900 hover:bg-slate-700 dark:text-gray-50 dark:border-gray-800 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-2 text-sm">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"></path>
					</svg>
          Fetch
				</span>

				<Link to={routes.new_brigade} className="!pl-2 inline-flex justify-center items-center cursor-pointer text-center border border-transparent leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 shadow-sm text-white bg-slate-900 hover:bg-slate-700 dark:text-gray-50 dark:border-gray-800 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-2 text-sm">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"></path>
					</svg>
          Додати бригаду
				</Link>
			</div>
      
			<div className='py-8'>
				<Table hasDeleteMethod fieldsName={['name', 'creator', 'imgUrl', 'created', 'updated', 'cars']} results={[{
					name: '43 окрема',
					creator: 'temchik200352@gmail.com',
					imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvFBa3G11OUBYADP7ouSBgwiiRzSYorF4dfg&usqp=CAU',
					created: '12.12.2021',
					updated: '12.12.2021',
					cars: [
						'Nissan',
						'Volvo',
						'KIA'
					],
				}, {
					name: '22 штурмова',
					creator: 'temchik200352@gmail.com',
					imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvFBa3G11OUBYADP7ouSBgwiiRzSYorF4dfg&usqp=CAU',
					created: '12.12.2021',
					updated: '12.12.2021',
					cars: [
						'Nissan',
						'Volvo',
						'KIA'
					],

				}]} spreadsheetTitles={['Назва', 'Ким створена', 'Картинка', 'Коли створено', 'Оновлено', 'Автомобілі', 'Змінити / Видалити']}>
				</Table>
			</div>
		</div>
	)
}

export default React.memo(MainPage)