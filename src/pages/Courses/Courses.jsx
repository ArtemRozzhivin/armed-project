import React from 'react'
import _map from 'lodash/map'
import PropTypes from 'prop-types'
import { CalendarIcon, UsersIcon } from '@heroicons/react/20/solid'
import _isEmpty from 'lodash/isEmpty'
import { DocumentTextIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { auth, withAuthentication } from '../../hoc/protected'
import { Link } from 'react-router-dom'
import routes from '../../routes'

const NoCourses = () => (
	<div className='mt-5'>
		<h3 className='text-center text-gray-800'>
      You have no courses yet.
		</h3>
	</div>
)

const Courses = ({ isLoading, courses, error }) => {

	const subStr = (string, len) => {
		if (string.length > len) {
			return `${string.substring(0, len)}...`
		}
		return string
	}

	if (!isLoading && _isEmpty(courses)) {
		return <NoCourses />
	}

	const findLastTask = (tasks) => {
		if (_isEmpty(tasks)) {
			return null
		}
		let date

		try {
			date = new Date(lastTask.expiration_date) <= new Date()
		} catch (e) {
			date = false
		}

		const lastTask = tasks[0]
		// console.log(lastTask)
		if (date) {
			return null
		}

		if (lastTask) {
			return lastTask
		}

		return null
	}

	if (error && !isLoading) {
		return (
			<div>
				<div className='flex justify-center pt-10'>
					<div className='rounded-md bg-red-50 p-4 w-11/12 lg:w-4/6'>
						<div className='flex'>
							<div className='flex-shrink-0'>
								<XCircleIcon className='h-5 w-5 text-red-400' aria-hidden='true' />

							</div>
							<div className='ml-3'>
								<h3 className='text-sm font-medium text-red-800'>{error}</h3>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className=" overflow-hidden max-w-[1110px] mx-auto ">
				<p className='my-6 text-2xl font-semibold'>Courses</p>
				<div className='flex justify-center pt-10'>
					<div className='animate-spin rounded-full h-20 w-20 border-b-4 border-indigo-600' />
				</div>
			</div>
		)
	}


	return (
		<div className=" overflow-hidden max-w-[1110px] mx-auto ">
			<div className='flex justify-between items-center'>
				<p className='my-6 text-2xl font-semibold'>Courses</p>
				<Link to={routes.new_courses} className='flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700'>
					Add course
				</Link>
			</div>
			<ul role="list">
				{_map(courses, (course, key) => (
					<li className='shadow sm:rounded-md' key={key}>
						<Link to={`/courses/${course.id}`} className="block divide-y divide-gray-200 hover:bg-gray-50">
							<div className="px-4 py-4 sm:px-6">
								<div className="flex items-center justify-between">
									<p className="truncate text-sm font-medium text-indigo-600">{course.title}</p>
									<div className="ml-2 flex flex-shrink-0">
										<p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
											{!_isEmpty(course.tasks) && course.tasks[0].isLecture ? 'Lecture' : 'Practical'}
										</p>
									</div>
								</div>
								<div className="mt-2 sm:flex sm:justify-between">
									<div className="sm:flex">
										<p className="flex items-center text-sm text-gray-500">
											<UsersIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
											{course.title}
										</p>
										<p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
											{course.description ? (subStr(course.description, 25)) : 'No description'}
										</p>
									</div>
									<div className="sm:flex">
										<div className='mx-8'>
											<p className="flex items-center text-sm text-gray-500">
												<DocumentTextIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
												Last task: {findLastTask(course.tasks) ? findLastTask(course.tasks).title : 'No tasks'}
											</p>
										</div>
										<div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
											{findLastTask(course.tasks) && (
												<>
													<CalendarIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" /><p>
														Closing on {findLastTask(course.tasks)?.expiration_date}
													</p>
												</>
											)}
										</div>
									</div>

								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}

Courses.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	courses: PropTypes.array.isRequired,
	error: PropTypes.string,
}

Courses.defaultProps = {
	error: null,
}

export default React.memo(withAuthentication(Courses, auth.authenticated))
