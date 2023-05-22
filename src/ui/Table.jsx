import React from 'react'
import _map from 'lodash/map'
import _includes from 'lodash/includes'
import PropTypes from 'prop-types'
import Button from './Button'

const checkDataRes = ['createdAt', 'updatedAt', 'updated', 'created', 'expiration_date']

const Table = ({
	results,
	spreadsheetTitles,
	fieldsName,
	onEdit,
	hasDeleteMethod,
	onClickDeleteProject,
}) => {
	return (
		<div>
			<table className='min-w-full leading-normal'>
				<thead>
					<tr>
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
							<tr key={param.id || param.title}>
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
									return (
										<td key={index} className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
											<p className='text-gray-900 whitespace-no-wrap'>{renderData}</p>
										</td>
									)
								})}
								<td className='px-5 py-5 border-b border-gray-200 bg-white text-sm text-center min-w-full'>
									<Button primary large className='h-10' onClick={() => {
										onEdit(param)
									}}>
                      Edit
									</Button>
									{
										hasDeleteMethod && (
											<Button onClick={() => onClickDeleteProject(param.id)} danger large className='h-10 ml-4'>
                        Delete
											</Button>
										)
									}
								</td>
							</tr>
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
	onEdit: PropTypes.func.isRequired,
}

Table.defaultProps = {
	hasDeleteMethod: false,
	onClickDeleteProject: () => {},
}

export default Table