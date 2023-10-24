import React, { useState, useEffect } from 'react'
import _keys from 'lodash/keys'
import _isEmpty from 'lodash/isEmpty'
// import { auth } from '../../hoc/protected'
import { auth } from '../../../firebaseConfig'
import Input from '../../../ui/Input'
import Button from '../../../ui/Button'
import {
	isValidName
} from '../../../utils/validator'
import { db, storage, ref  } from '../../../firebaseConfig'
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore' 
import { uploadBytes, getDownloadURL } from 'firebase/storage'
import { useParams } from 'react-router-dom'

const BrigadeSettings = () => {
	const { id } = useParams()
	const [form, setForm] = useState({
		title: '',
		imgUrl: '',
	})
	//const isSettings = if route exist 'new'
	const [validated, setValidated] = useState(false)
	const [errors, setErrors] = useState({})
	const [beenSubmitted, setBeenSubmitted] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const getBrigadeById = async () => {
		try {
			const docRef = doc(db, 'brigades', id)
			const docBrigade = await getDoc(docRef)
			const {title, imgUrl} = docBrigade.data()
			setForm({title, imgUrl})
		} catch (error) {
			console.log(error)
		}
		
	}

	if(id) {
		useEffect(() => {
			getBrigadeById()
		}, [])
	}

	const validate = () => {
		const allErrors = {}

		if (!isValidName(form.title)) {
			allErrors.title = 'Неправильна назва'
		}

		const valid = _isEmpty(_keys(allErrors))

		setErrors(allErrors)
		setValidated(valid)
	}

	useEffect(() => {
		validate()
  }, [form]) // eslint-disable-line


	const addBrigade = async (data) => {
		try {
			const docRef = await addDoc(collection(db, 'brigades'), data)
			console.log('Document written with ID: ', docRef.id) 
		} catch (error) {
			console.log(error)
		}
	}

	const updateBrigade = async (data) => {
		try {
			const brigadeRef = doc(db, 'brigades', id)

			// Set the "capital" field of the city 'DC'
			const docRef = await updateDoc(brigadeRef, {
				title: data.title,
				imgUrl: data.imgUrl
			})
			console.log('Document updated with ID: ', docRef.id)
		} catch (error) {
			console.log(error)
		}
	}

	const onSubmit = data => {
		if (!isLoading) {
			setIsLoading(true)

			if(id) {
				updateBrigade(data)
			} else {
				const newForm = {
					...data,
					creator: auth.currentUser.email,
					created: new Date().toISOString(),
					cars: []
				}

				addBrigade(newForm)
			}
      
			setIsLoading(false)
		}
	}

	const uploadImageOnStorage = async (file) => {
		const pathRef = ref(storage, 'images/' + file.name)

		try {
			await uploadBytes(pathRef, file)

			const url = await getDownloadURL(pathRef)

			return url
		} catch (error) {
			console.error('Error uploading and retrieving URL:', error)
		}
	}

	const handleImage = async ({ target }) => {
		if(target.type === 'file') {
			const file = target?.files?.[0]
			
			if (!file) return
      
			const url = await uploadImageOnStorage(file)
			console.log(url)

			setForm(oldForm => ({
				...oldForm,
				[target.name]: url,
			}))
			
		}
	}

	const handleInput = ({ target }) => {
		const value = target.type === 'checkbox' ? target.checked : target.value

		setForm(oldForm => ({
			...oldForm,
			[target.name]: value,
		}))
	}

	const handleSubmit = e => {
		e.preventDefault()
		e.stopPropagation()
		setBeenSubmitted(true)

		if (validated) {
			onSubmit(form)
		}
	}

	return (
		<div className='min-h-page bg-gray-50 flex flex-col py-6 px-4 sm:px-6 lg:px-8'>
			<form className='max-w-[800px] w-full mx-auto' onSubmit={handleSubmit}>
				<h2 className='mt-2 text-3xl font-bold text-gray-900 '>
					{id ? <span>Оновити дані бригади</span> : <span>Створити нову бригаду</span>}
				</h2>
				<Input
					name='title'
					id='title'
					type='text'
					label='Назва'
					value={form.title}
					placeholder='43 окрема артилерійська бригада'
					className='mt-4'
					onChange={handleInput}
					error={beenSubmitted && errors.title}
				/>
				
				{/* <input
					id='imgUrl'
					name='imgUrl'
					type='file'
					label='Зображення'
					// value={form.imgUrl}
					className='mt-4'
					onChange={handleImage}
					// error={beenSubmitted && errors.imgUrl}
				/> */}

				<div className='mt-10 w-full lg:min-h-[300px] min-h-[150px] relative flex justify-center items-center'>
					<label className='absolute top-0 left-0 flex justify-center items-center text-center w-full h-full p-20 border-2 border-gray-400 border-dashed' htmlFor='image'>
						{!form.imgUrl ? (
							'Оберіть картинку'
						) : (
							<img className='object-cover' width={350} height={250} src={form.imgUrl} alt='Poster' />
						)}
					</label>
					<input
						id='imgUrl'
						name='imgUrl'
						type='file'
						label='Картинка'
						// value=''
						className='absolute w-full opacity-0 h-full cursor-pointer'
						onChange={handleImage}
						accept='image/*'
						required
						// error={beenSubmitted && errors.imgUrl}
					/>
				</div>


				<div className='flex justify-between mt-10'>
					<Button type='submit' primary large>
						{id ? <span>Змінити</span> : <span>Створити</span>}
					</Button>
				</div>
			</form>
		</div>
	)
}

export default BrigadeSettings
