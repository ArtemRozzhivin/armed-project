import React, { useState, useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import _size from 'lodash/size'
import _keys from 'lodash/keys'
import _isEmpty from 'lodash/isEmpty'

import { auth, withAuthentication } from '../../../hoc/protected'
import routes from '../../../routes'
import Input from '../../../ui/Input'
import Checkbox from '../../../ui/Checkbox'
import Button from '../../../ui/Button'
import {
	isValidEmail, isValidPassword,
} from '../../../utils/validator'

const Signup = ({ signup }) => {
	const [form, setForm] = useState({
		email: '',
		password: '',
		repeat: '',
		tos: false,
	})
	const [validated, setValidated] = useState(false)
	const [errors, setErrors] = useState({})
	const [beenSubmitted, setBeenSubmitted] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const validate = () => {
		const allErrors = {}

		if (!isValidEmail(form.email)) {
			allErrors.email = 'Please enter a valid email address'
		}

		if (!isValidPassword(form.password)) {
			allErrors.password = 'Password must be at least 8 characters long'
		}

		if (form.password !== form.repeat || form.repeat === '') {
			allErrors.repeat = 'Passwords do not match'
		}

		if (_size(form.password) > 50) {
			allErrors.password = 'Password must be less than 50 characters'
		}

		if (!form.tos) {
			allErrors.tos = 'You must agree to the Terms of Service'
		}

		const valid = _isEmpty(_keys(allErrors))

		setErrors(allErrors)
		setValidated(valid)
	}

	useEffect(() => {
		validate()
  }, [form]) // eslint-disable-line

	const onSubmit = data => {
		if (!isLoading) {
			setIsLoading(true)
			signup(data, () => {
				setIsLoading(false)
			})
		}
	}

	const handleInput = event => {
		const { target } = event
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
		<div>
			<div className='min-h-page bg-gray-50  flex flex-col py-6 px-4 sm:px-6 lg:px-8'>
				<form className='max-w-7xl w-full mx-auto' onSubmit={handleSubmit}>
					<h2 className='mt-2 text-3xl font-bold text-gray-900 '>
						Sing Up
					</h2>
					<Input
						name='email'
						id='email'
						type='email'
						label='Email'
						value={form.email}
						placeholder='you@example.com'
						className='mt-4'
						onChange={handleInput}
						error={beenSubmitted ? errors.email : ''}
					/>
					<Input
						name='password'
						id='password'
						type='password'
						label='Password'
						hint='Must be at least 8 characters'
						value={form.password}
						placeholder='********'
						className='mt-4'
						onChange={handleInput}
						error={beenSubmitted ? errors.password : ''}
					/>
					<Input
						name='repeat'
						id='repeat'
						type='password'
						label='Repeat Password'
						value={form.repeat}
						placeholder='********'
						className='mt-4'
						onChange={handleInput}
						error={beenSubmitted ? errors.repeat : ''}
					/>
					<Checkbox
						checked={form.tos}
						onChange={handleInput}
						name='tos'
						id='tos'
						className='mt-4'
						label='I agree to the Terms of Service'
						hintClassName='!text-red-600'
						hint={beenSubmitted ? errors.tos : ''}
					/>
					<div className='pt-1 flex justify-between mt-3'>
						<Button type='submit' loading={isLoading} primary large>
							Sing Up
						</Button>
						<Link to={routes.singin} className='underline text-blue-600 hover:text-indigo-800'>
							Sign in
						</Link>
					</div>
				</form>
			</div>
		</div>
	)
}

Signup.propTypes = {
	signup: PropTypes.func.isRequired,
}

export default memo(withAuthentication(Signup, auth.notAuthenticated))
