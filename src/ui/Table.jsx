import React from 'react'
import _map from 'lodash/map'
import _includes from 'lodash/includes'
import PropTypes from 'prop-types'
import Button from './Button'
import { Link } from 'react-router-dom'
import routes from '../routes'
import _replace from 'lodash/replace'


const checkDataRes = ['createdAt', 'updatedAt', 'updated', 'created', 'expiration_date']

const Table = ({
	results,
	spreadsheetTitles,
	fieldsName,
	settignsLink,
	hasDeleteMethod,
	onClickDeleteProject,
	isImage
}) => {
	return (
		<div>
			<table className='min-w-full leading-normal'>
				<thead>
					<tr>
						{isImage && (
							<th key={isImage} className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
							Зображення
							</th>)}
						{_map(spreadsheetTitles, (title) => (
							<th key={title} className='px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
								{title}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{_map(results, (param) => {
						return (
							<>
								<tr key={param.id || param.title}>
									{isImage && (
										<td className='w-[150px] h-[150px] p-2'>
											<img width={150} height={150} src={param.imgUrl ? param.imgUrl : '/assets/notFound.png'} alt='Бригада'/>
										</td>
									)}
									{_map(fieldsName, (fieldName, index) => {
										let renderData
										if (typeof param[fieldName] === 'boolean') {
											renderData = param[fieldName] ? 'Y' : 'N'
										} else if (_includes(checkDataRes, fieldName)) {
											try {
												renderData = param[fieldName]
											} catch (e) {
												renderData = param[fieldName]
											}
										} else {
											renderData = param[fieldName]
										}
										if (fieldName === 'created') {
											renderData = new Date(param[fieldName]).toLocaleString()
										}
										return (
											<td key={index} className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
												{Array.isArray(renderData) ? 
													<div className='flex justify-center items-center'>
														<Link to={_replace(routes.brigade_cars, ':id', param.id)}>
															<Button primary large className='h-10'>
																<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
																	<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
																</svg>
															</Button> 
														</Link>
													</div>  :
													<p className='text-gray-900 whitespace-no-wrap'>{renderData}</p>
												}
											</td>
										)
									})}
									<td className='px-5 py-5 border-b border-gray-200 bg-white text-sm text-center min-w-full'>
										<Link to={_replace(settignsLink.route, settignsLink.param, param.id)}>
											<Button primary large className='h-10'>
											Edit
											</Button> 
										</Link>

                  
										{
											hasDeleteMethod && (
												<Button onClick={() => onClickDeleteProject(param.id)} danger large className='h-10 ml-4'>
                        Delete
												</Button>
											)
										}
									</td>
								</tr>
							</>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
// check this pls, i don't know how did it.
Table.propTypes = {
	results: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
	spreadsheetTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
	fieldsName: PropTypes.arrayOf(PropTypes.string).isRequired,
	hasDeleteMethod: PropTypes.bool,
	onClickDeleteProject: PropTypes.func,
	settignsLink: PropTypes.object.isRequired,
	isImage: PropTypes.bool
}

Table.defaultProps = {
	hasDeleteMethod: false,
	onClickDeleteProject: () => {},
}

export default Table