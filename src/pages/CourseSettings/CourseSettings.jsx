import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import _replace from 'lodash/replace'
import _isEmpty from 'lodash/isEmpty'
import _find from 'lodash/find'
import _map from 'lodash/map'
import _filter from 'lodash/filter'
import Input from '../../ui/Input'
import Button from '../../ui/Button'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import routes from '../../routes'
import Table from '../../ui/Table'
import Checkbox from '../../ui/Checkbox'
import { doc, setDoc, collection, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import Modal from '../../ui/Modal'


const CourseSettings = ({
	isLoading,
	user,
	courses,
	setError,
	generateAlerts,
	setCourses,
}) => {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const { id } = useParams()
	const isSettings = !_isEmpty(id) && (_replace(routes.courses_settings, ':id', id) === pathname)
	const course = useMemo(() => _find(courses, p => p.id === id) || {}, [courses, id])

	const [form, setForm] = React.useState({
		backgroundImage: '',
		description: '',
		title: '',
	})
	const [task, setTask] = React.useState({
		title: '',
		description: '',
		expiration_date: '',
	})
	const [addTaskModal, setAddTaskModal] = React.useState(false)
	const [errors, setErrors] = React.useState({
		backgroundImage: '',
		description: '',
		title: '',
	})
	const [tasks, setTasks] = React.useState([])
	const [isBeenSubmitted, setIsBeenSubmitted] = React.useState(false)

	useEffect(() => {
		if (isSettings && !_isEmpty(course)) {
			setForm({
				backgroundImage: course.backgroundImage,
				description: course.description,
				title: course.title,
			})
			setTasks(course.tasks)
		}
	}, [isSettings, course])

	const validate = () => {
		const newErrors = {}

		if (!form.backgroundImage) {
			newErrors.backgroundImage = 'Background image is required'
		}

		if (!form.description) {
			newErrors.description = 'Description is required'
		}

		if (!form.title) {
			newErrors.title = 'Title is required'
		}

		setErrors(newErrors)
		setIsBeenSubmitted(false)
	}

	useEffect(() => {
		validate()
	}, [form])

	const onChange = (e) => {
		const { name, value } = e.target
		setForm({
			...form,
			[name]: value,
		})
	}

	const onSubmit = (form) => {
		try {
			if (isSettings) {
				const newCourses = _map(courses, item => {
					if (item.id === id) {
						return {
							...item,
							...form,
							admin: user.uid,
						}
					}
					return item
				})
				setDoc(doc(collection(db, 'courses'), course.id), {
					...course,
					...form,
				}).then(() => {
					generateAlerts('Course updated', 'success')
					setCourses(newCourses)
					navigate(routes.courses)
				})
			} else {
				const id = Math.random().toString(36).substr(2, 9)
				const newCourses = [...courses, {
					...form,
					admin: user.uid,
					id,
					tasks: [],
				}]
				setDoc(doc(collection(db, 'courses'), id), {
					...form,
					admin: user.uid,
					tasks: [],
				}).then(() => {
					generateAlerts('Course created', 'success')
					setCourses(newCourses)
					navigate(routes.courses)
				})
			}
		} catch (e) {
			setError(e)
		} finally {
			setForm({
				backgroundImage: '',
				description: '',
				title: '',
			})
		}
	}

	const onNewTask = () => {
		try {
			const newTasks = [...tasks, {
				...task,
				id: Math.random().toString(36).substr(2, 9),
			}]
			setDoc(doc(collection(db, 'courses'), course.id), {
				...course,
				tasks: newTasks,
			}).then(() => {
				generateAlerts('Task created', 'success')
				setTasks(newTasks)
				setCourses(_map(courses, item => {
					if (item.id === id) {
						return {
							...item,
							tasks: newTasks,
						}
					}
					return item
				}))
				setAddTaskModal(false)
			})
		} catch (e) {
			setError(e)
			console.log(e)
		} finally {
			setAddTaskModal(false)
			setTask({
				title: '',
				description: '',
				expiration_date: '',
			})
		}
	}

	const onCourseDelete = () => {
		try {
			const newCourses = _filter(courses, course => course.id !== id)
			deleteDoc(doc(collection(db, 'courses'), course.id)).then(() => {
				generateAlerts('Course deleted', 'success')
				setCourses(newCourses)
				navigate(routes.courses)
			})
		} catch (e) {
			setError(e)
		}
	}

	const onTaskDelete = (id) => {
		try {
			const newTasks = _filter(tasks, item => item.id !== task.id)
			setDoc(doc(collection(db, 'courses'), course.id), {
				...course,
				tasks: newTasks,
			}).then(() => {
				generateAlerts('Task deleted', 'success')
				setTasks(newTasks)
				setCourses(_map(courses, item => {
					if (item.id === id) {
						return {
							...item,
							tasks: newTasks,
						}
					}
					return item
				}))
			})
		} catch (e) {
			setError(e)
		}
	}

	const onTaskEdit = (task) => {
		try {
			const newTasks = _map(tasks, t => {
				if (t.id === task.id) {
					return {
						...task,
					}
				}
				return t
			})
			setDoc(doc(collection(db, 'courses'), course.id), {
				...course,
				tasks: newTasks,
			}).then(() => {
				generateAlerts('Task updated', 'success')
				setTasks(newTasks)
				setCourses(_map(courses, item => {
					if (item.id === id) {
						return {
							...item,
							tasks: newTasks,
						}
					}
					return item
				}))
			})
		} catch (e) {
			setError(e)
		} finally {
			setAddTaskModal(false)
		}
	}

	const handleSubmit = e => {
		e.preventDefault()
		e.stopPropagation()
		setIsBeenSubmitted(true)

		if (_isEmpty(errors)) {
			onSubmit(form)
		}
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
		<div className='max-w-3xl mx-auto pb-16 pt-12 px-4 sm:px-6 lg:px-8 whitespace-pre-line'>
			<form onSubmit={handleSubmit}>
				<h3 className='text-3xl font-bold tracking-tight'>{isSettings ? 'Create course' : 'Edit course'}</h3>
				<div className=''>
					<Input
						className='mt-4'
						name='title'
						id='title'
						label='title'
						type='text'
						placeholder='title'
						value={form.title}
						onChange={onChange}
						error={isBeenSubmitted ? errors.title : null}
					/>
					<Input
						className='mt-4'
						name='backgroundImage'
						id='backgroundImage'
						label='backgroundImage'
						type='text'
						placeholder='url'
						value={form.backgroundImage}
						onChange={onChange}
						error={isBeenSubmitted ? errors.backgroundImage : null}
					/>
					<Input
						className='mt-4'
						name='description'
						id='description'
						label='description'
						type='text'
						placeholder='description'
						value={form.description}
						onChange={onChange}
						error={isBeenSubmitted ? errors.description : null}
					/>
					{isSettings && (
						!_isEmpty(tasks) ? (
							<div className='flex flex-col justify-center items-center'>
								<Table
									results={tasks}
									spreadsheetTitles={['Title', 'Description', 'Expiration date', 'Is lecture', '', '']}
									fieldsName={['title', 'description', 'expiration_date', 'isLecture']}
									onEdit={(task) => {
										setTask({
											...task,
											isSettings: true,
										})
										setAddTaskModal(true)
									}}
									hasDeleteMethod
									onClickDeleteProject={() => onTaskDelete()} /><Button
									onClick={() => setAddTaskModal(true)}
									primary
									type='button'
									className='h-10 w-48 flex justify-center ml-4'
								>
									Add task
								</Button>
							</div>
						) : (
							<div className='flex justify-center items-center mt-8'>
								<p className='text-gray-500'>No tasks</p>
								<Button
									onClick={() => setAddTaskModal(true)}
									primary
									type='button'
									className='h-10 w-48 flex justify-center ml-4'	
								>
									Add task
								</Button>
							</div>
						)
					)}
					<div className='flex justify-center gap-40  mt-8'>
						<Button
							type='submit'
							primary
							className='h-10 w-48 flex justify-center'
						>
            Save
						</Button>
						{isSettings && (
							<Button
								onClick={() => onCourseDelete()}
								danger
								type='button'
								className='h-10 w-48 flex justify-center'
							>
								Delete
							</Button>
						)}
					</div>
				</div>
			</form>
			<Modal
				onClose={() => {
					setAddTaskModal(false)
				}}
				closeText='Close'
				title='Add task'
				size='large'
				message={
					<div className='flex flex-col'>
						<div className='flex flex-col items-center'>
							<Input
								name='title'
								id='title'
								type='text'
								label='title'
								value={task.title}
								className='max-w-[400px] w-full'
								placeholder='title'
								onChange={(e) => {
									if (e.target.value.length >= 0) {
										setTask({ ...task, title: e.target.value })
									}
								}}
							/>
							<Input
								name='description'
								id='description'
								type='text'
								label='description'
								value={task.description}
								className='max-w-[400px] w-full'
								placeholder='description'
								onChange={(e) => {
									if (e.target.value.length >= 0) {
										setTask({ ...task, description: e.target.value })
									}
								}}
							/>
							<Input
								name='expiration_date'
								id='expiration_date'
								type='date'
								label='expiration_date date format: yyyy-mm-dd'
								value={task.expiration_date}
								className='max-w-[400px] w-full'
								placeholder='expiration_date'
								onChange={(e) => {
									if (e.target.value.length >= 0) {
										setTask({ ...task, expiration_date: e.target.value })
									}
								}}
							/>
							<Checkbox
								name='isLecture'
								id='isLecture'
								label='isLecture'
								checked={task.isLecture || false}
								className='max-w-[400px] w-full'
								onChange={(e) => {
									if (e.target.value.length >= 0) {
										setTask({ ...task, isLecture: e.target.value })
									}
								}}
							/>
							<div className='flex justify-center gap-40  mt-8'>
								<Button
									onClick={() => {
										if (task?.isSettings) {
											onTaskEdit(task)
										} else {
											onNewTask()
										}
									}}
									primary
									type='button'
									className='h-10 w-48 flex justify-center'
								>
									{task?.isSettings ? 'Update' : 'Add'}
								</Button>
							</div>
						</div>
					</div>
				}
				isOpened={addTaskModal}
			/>
		</div>
	)
}

CourseSettings.propTypes = {
	isLoading: PropTypes.bool.isRequired,
	user: PropTypes.object.isRequired,
	courses: PropTypes.array.isRequired,
	setError: PropTypes.func.isRequired,
	generateAlerts: PropTypes.func.isRequired,
	setCourses: PropTypes.func.isRequired,
}

CourseSettings.defaultProps = {}

export default CourseSettings
