import React, { useState, useEffect, memo } from 'react'
import PropTypes from 'prop-types'
import _keys from 'lodash/keys'
import _isEmpty from 'lodash/isEmpty'
import { withAuthentication, auth } from '../../../hoc/protected'
import Input from '../../../ui/Input'
import Button from '../../../ui/Button'
import {
	isValidEmail, isValidPassword, MIN_PASSWORD_CHARS,
} from '../../../utils/validator'

const Signin = ({ login }) => {
	const [form, setForm] = useState({
		email: '',
		password: '',
	})
	const [validated, setValidated] = useState(false)
	const [errors, setErrors] = useState({})
	const [beenSubmitted, setBeenSubmitted] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const validate = () => {
		const allErrors = {}

		if (!isValidEmail(form.email)) {
			allErrors.email = 'Invalid email'
		}

		if (!isValidPassword(form.password)) {
			allErrors.password = `Password must be at least ${MIN_PASSWORD_CHARS} characters`
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
			login(data, (result) => {
				if (!result) {
					setIsLoading(false)
				}
			})
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
		<div className='min-h-page bg-gray-50  flex flex-col py-6 px-4 sm:px-6 lg:px-8'>
			<form className='max-w-7xl w-full mx-auto' onSubmit={handleSubmit}>
				<h2 className='mt-2 text-3xl font-bold text-gray-900 '>
						Log in to your account
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
					error={beenSubmitted && errors.email}
				/>
				<Input
					name='password'
					id='password'
					type='password'
					label='Password'
					hint='Must be at least 8 characters'
					value={form.password}
					placeholder='password'
					className='mt-4'
					onChange={handleInput}
					error={beenSubmitted && errors.password}
				/>
				<div className='flex justify-between mt-3'>
					<Button type='submit' primary large>
							Log in
					</Button>
				</div>
			</form>
		</div>
	)
}

Signin.propTypes = {
	login: PropTypes.func.isRequired,
}

export default memo(withAuthentication(Signin, auth.notAuthenticated))
