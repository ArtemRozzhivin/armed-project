import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import _find from 'lodash/find'
import _isEmpty from 'lodash/isEmpty'
import _filter from 'lodash/filter'
import _map from 'lodash/map'
import PropTypes from 'prop-types'
import { XCircleIcon, PencilSquareIcon } from '@heroicons/react/24/solid'
import Modal from '../../ui/Modal'
import Input from '../../ui/Input'
import Button from '../../ui/Button'
import { doc, setDoc, collection } from 'firebase/firestore'
import { auth, withAuthentication } from '../../hoc/protected'
import { db } from '../../firebaseConfig'
import { v4 as uuidv4 } from 'uuid'
import _isDate from 'lodash/isDate'
import { typeTasks } from '../../redux/constants'
import { Link } from 'react-router-dom'
import routes from '../../routes'
import _replace from 'lodash/replace'



const NoTasks = () => (
	<div className='mt-5'>
		<h3 className='text-center text-gray-800'>
			You have no courses yet.
		</h3>
	</div>
)

const CourseView = ({ courses, isLoading, error, user, setError, generateAlerts, setUser }) => {
	const { id } = useParams()
	const course = useMemo(() => _find(courses, p => p.id === id) || {}, [courses, id])
	const soon = useMemo(() => _filter(course.tasks, task => {
		const date = task?.expiration_date
		return new Date(date) > new Date() || null
	}), [course])
	const [showModal, setShowModal] = useState(false)
	const [form, setForm] = useState({
		id: '',
		value: '',
	})

	const notes = useMemo(() => _filter(user.notes, note => note.id === form.id), [user.notes, form.id])

	const openModal = (id) => {
		setShowModal(true)
		setForm({
			...form,
			id,
		})
	}

	const addedNotes = () => {
		const { id, value } = form
		const note = [...user.notes, { value, date: new Date(), id, uuid: uuidv4() }]
		if (_isEmpty(value)) {
			setError('Please enter a note')
			return 
		}
		try {
			setDoc(doc(collection(db, 'users'), user.uid), {
				notes: note
			}).then(() => {
				generateAlerts('Note added', 'success')
				setForm({
					...form,
					value: '',
				})
				setUser({
					...user,
					notes: note
				})
			})
		} catch (e) {
			setError(e)
		}
	}

	const deleteNotes = (uuid) => {
		const note = _filter(user.notes, note => note.uuid !== uuid)
		try {
			setDoc(doc(collection(db, 'users'), user.uid), {
				notes: note
			}).then(() => {
				generateAlerts('Note deleted', 'success')
				setUser({
					...user,
					notes: note
				})
			})
		} catch (e) {
			setError(e)
		}
	}


	if (!isLoading && _isEmpty(courses)) {
		return <NoTasks />
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
			<div className='rounded-md mt-6 w-full h-64 flex justify-between items-end drop-shadow-lg' style={{ backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundImage: `url(${course.backgroundImage || ''})` }}>
				<div className='flex flex-col p-4'>
					<p className='text-2xl font-bold text-white'>{course.title}</p>
					<p className='text-lg font-semibold text-white'>{course.description}</p>
				</div>
				{course?.admin === user.uid && (
					<Link to={_replace(routes.courses_settings, ':id', id)} className='flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700'>
						Edit course
					</Link>
				)}
			</div>
			<div className='flex items-start justify-between'>

				<div className='border-l-[2px]  border-indigo-600 p-3 mr-3 mt-4 min-w-max'>
					<h2 className='text-[#3c4043] text-lg'>Soon</h2>
					{_isEmpty(soon) ? (<p className='text-gray-500'>No tasks</p>) : soon.map((task, index) => (
						<div key={index} className='flex items-center justify-between mt-4'>
							<p className='text-gray-500'>{task.title}</p>
							<span className='text-gray-500 mx-1'>|</span>
							<p className='text-gray-500'>{task.expiration_date}</p>
						</div>
					))}
				</div>
				<div className='w-full'>
					<div className=''>
						{!_isEmpty(course?.tasks) && course.tasks.map((task, index) => (
							<div key={index} className='cursor-pointer shadow-block-course border-l-[5px] border-indigo-600'>
								<div className='min-h-14 mt-8  pt-4 px-4 flex justify-between '>
									<div >
										<div className='flex items-center'>
											<h3 className='text-[16px] font-semibold'>{task.title}</h3>
											{task.isLecture ? (
												<h3 className='text-[16px] font-medium bg-amber-400 rounded-lg  ml-6 py-1 px-4 text-white	'>{typeTasks.lecture}</h3>
											) : (
												<h3 className='text-[16px] font-medium bg-green-700	rounded-lg  ml-6 py-1 px-4 text-white	'>{typeTasks.practical}</h3>
											)}
											{(new Date(task.expiration_date) > new Date()) ? (
												<h3 className='text-[16px] font-medium bg-green-500 rounded-lg  ml-6 py-1 px-4 text-white	'>Upcoming</h3>
											) : (
												<h3 className='text-[16px] font-medium bg-red-500	rounded-lg  ml-6 py-1 px-4 text-white	'>Passed</h3>
											)}
										</div>
										<div className='max-w-xl'>
											<p className='mt-3'>{task.description}</p>
										</div>
									</div>
									<div className='flex flex-col items-end'>
										<div className='flex flex-col '>
											<div className='flex'>
												<p className='text-[13px] underline decoration-solid font-medium mr-2'>Submission deadline:</p>
												{(new Date(task.expiration_date) < new Date()) ? (
													<p className='text-[13px] text-red-600 font-medium'>{task.expiration_date}</p>
												) : (
													<p className='text-[13px] text-green-600 font-medium'>{task.expiration_date}</p>
												)}
											</div>
										</div>
									</div>
								</div>
								<div className='flex items-end justify-end '>
									<Button onClick={() => openModal(task.id)} className='flex px-6 py-2 rounded-[4px] hover:bg-indigo-600/[.06] hover:text-indigo-600 active:bg-indigo-600/[.15]'>
										<PencilSquareIcon className="mr-0.5 h-5 w-5 flex-shrink-0 text-gray-400" />
										Notes
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<Modal
				onClose={() => {
					setShowModal(false)
				}}
				closeText='Close'
				title='Notes'
				size='large'
				message={
					<div className='flex flex-col'>
						<div className='flex items-center'>
							<Input
								name='note'
								id='note'
								type='text'
								label='add notes'
								value={form.value}
								className='max-w-[400px] w-full'
								placeholder='notes'
								onChange={(e) => {
									if (e.target.value.length >= 0) {
										setForm({ ...form, value: e.target.value })
									}
								}}
							/>
							<Button className='mt-4' regular primary onClick={addedNotes}>Add notes</Button>
						</div>
						{notes && _map(notes, ((note, index) => (
							<div key={index} className='flex items-center justify-between mt-4'>
								<p className='text-gray-500 max-w-2xl w-full'>{note.value}</p>
								<span className='text-gray-500 mx-1'>|</span>
								<p className='text-gray-500'>{_isDate(note.date) ? note.date.toLocaleDateString() : note.date.toDate().toLocaleDateString()}</p>
								<Button small danger onClick={() => deleteNotes(note.uuid)} >Delete</Button>
							</div>
						)))}
					</div>
				}
				isOpened={showModal}
			/>
		</div>
	)
}

CourseView.propTypes = {
	courses: PropTypes.array.isRequired,
	user: PropTypes.object.isRequired,
	isLoading: PropTypes.bool,
	error: PropTypes.string,
	setError: PropTypes.func,
	generateAlerts: PropTypes.func,
	setUser: PropTypes.func,
}

CourseView.defaultProps = {
	isLoading: false,
	error: '',
}

export default React.memo(withAuthentication(CourseView, auth.authenticated))