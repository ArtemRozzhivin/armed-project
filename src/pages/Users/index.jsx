import React, { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { withAuthentication, Auth } from '../../hoc/protected'

const Users = () => {
	const [actionss, setActions] = useState([])
	useEffect(() => {
		const getActions = async () => {
			const querySnapshot = await getDocs(collection(db, 'actionss'))
			const actionss = querySnapshot.docs.map(doc => {
				return { ...doc.data(), id: doc.id }
			})
			setActions(actionss)
		}
		getActions()
	}, [])

	return (
		<div className='mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px]'>
			<div className="flex justify-between mb-6">
				<div className="flex items-end justify-between">
					{actionss && actionss.length === 0 ? <></> : <h2 className="flex items-baseline mt-2 text-3xl font-bold text-gray-900">Історія дій
					</h2>}
				</div>
			</div>

			<div className='py-8 mx-auto max-w-[1200px]'>
				{actionss && (actionss.length === 0 ? <div className='text-4xl font-semibold flex justify-center items-center text-emerald-700 mt-20'>Автомобілі відсутні</div> :
					<table className='min-w-full leading-normal'>
						<thead>
							<tr>
								<th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
									Користувач
								</th>
								<th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
									Дата
								</th>
								<th className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
									Дія
								</th>
							</tr>
						</thead>
						<tbody>
							{actionss.map((action) => {
								return (
									<tr key={action.id}>
										<td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
											<div className='flex items-center'>
												<div className='ml-3'>
													<p className='text-gray-900 whitespace-no-wrap'>
														{action.user}
													</p>
												</div>
											</div>
										</td>
										<td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
											<p className='text-gray-900 whitespace-no-wrap'>
												{action.date}
											</p>
										</td>
										<td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
											<p className='text-gray-900 whitespace-no-wrap'>
												{action.action}
											</p>
										</td>
									</tr>
								)
							})}
						</tbody>
					</table>
				)}
			</div>
		</div>
	)
}

export default React.memo(withAuthentication(Users, Auth.authenticated))