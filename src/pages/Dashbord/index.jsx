import React from 'react'
import Table from '../../ui/Table'

const Dashbord = () => {
	return (
		<div>
			<div className="flex justify-between mb-6">
				<div className="flex items-end justify-between">
					<h2 className="flex items-baseline mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">Панель управления
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="ml-2 w-5 h-5 text-gray-900 dark:text-gray-50 cursor-pointer hover:opacity-80">
							<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
						</svg>
					</h2>
				</div>
				<span className="!pl-2 inline-flex justify-center items-center cursor-pointer text-center border border-transparent leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 shadow-sm text-white bg-slate-900 hover:bg-slate-700 dark:text-gray-50 dark:border-gray-800 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-2 text-sm">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"></path>
					</svg>Додати бригаду</span>
			</div>
			<Table>
        
			</Table>
		</div>
	)
}

export default Dashbord