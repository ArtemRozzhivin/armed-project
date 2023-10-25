import React, { useState, useEffect } from 'react'
// import { auth } from '../../hoc/protected'
import Button from '../../../../ui/Button'
import { db } from '../../../../firebaseConfig'
import { doc, getDoc, updateDoc} from 'firebase/firestore' 
import { useParams } from 'react-router-dom'
// import PropTypes from 'prop-types'
import Select from '../../../../ui/Search'
import Input from '../../../../ui/Input'



const CarsBrandArray = [
	'Audi', 'BMW', 'Toyota', 'Mitsubishi'
]

const CarsArray = [
	{
		make: 'Audi', cars: [
			{year: 2018, make: 'Audi', model: 'A7', category: 'Sedan' },
			{ year: 2018, make: 'Audi', model: 'A4', category: 'Sedan' },
			{ year: 2018, make: 'Audi', model: 'Q5', category: 'SUV' },
			{
				year: 2018,
				make: 'Audi',
				model: 'A3 Sportback e-tron',
				category: 'Wagon'
			},
			{
				year: 2018,
				make: 'Audi',
				model: 'A5',
				category: 'Coupe, Convertible, Sedan'
			},
			{ year: 2015, make: 'Audi', model: 'A7', category: 'Sedan' },
			{
				year: 2015,
				make: 'Audi',
				model: 'R8',
				category: 'Coupe, Convertible'
			},
			{ year: 2015, make: 'Audi', model: 'S3', category: 'Sedan' },
			{
				year: 2019,
				make: 'Audi',
				model: 'A3',
				category: 'Convertible, Sedan'
			},
			{
				year: 2019,
				make: 'Audi',
				model: 'S5',
				category: 'Sedan, Coupe, Convertible'
			},
		]
	},
	{
		make: 'BMW', cars: [
			{ year: 2015, make: 'BMW', model: 'M5', category: 'Sedan' },
			{ year: 2015, make: 'BMW', model: 'X5', category: 'SUV' },
			{ year: 2016, make: 'BMW', model: 'M2', category: 'Coupe' },
			{ year: 2017, make: 'BMW', model: '5 Series', category: 'Sedan' },
			{ year: 2017, make: 'BMW', model: '7 Series', category: 'Sedan' },
			{ year: 2017, make: 'BMW', model: 'X4', category: 'SUV' },
			{ year: 2020, make: 'BMW', model: 'X7', category: 'SUV' },
			{ year: 2020, make: 'BMW', model: 'X5', category: 'SUV' },
			{
				year: 2016,
				make: 'BMW',
				model: '2 Series',
				category: 'Convertible, Coupe'
			},
		]
	},
	{
		make: 'Toyota', cars: [
			{
				year: 2017,
				make: 'Toyota',
				model: 'Land Cruiser',
				category: 'SUV'
			},
			{
				year: 2017,
				make: 'Toyota',
				model: 'Tacoma Access Cab',
				category: 'Pickup'
			},
			{
				year: 2017,
				make: 'Toyota',
				model: 'Tundra CrewMax',
				category: 'Pickup'
			},
			{ year: 2018, make: 'Toyota', model: 'Corolla', category: 'Sedan' },
			{
				year: 2018,
				make: 'Toyota',
				model: 'Prius c',
				category: 'Hatchback'
			},
			{
				year: 2018,
				make: 'Toyota',
				model: 'Prius Prime',
				category: 'Hatchback'
			},
			{
				year: 2019,
				make: 'Toyota',
				model: 'Prius Prime',
				category: 'Hatchback'
			},
			{
				year: 2019,
				make: 'Toyota',
				model: 'Tacoma Double Cab',
				category: 'Pickup'
			},
			{
				year: 2019,
				make: 'Toyota',
				model: 'Sienna',
				category: 'Van/Minivan'
			},
		]
	},
	{
		make: 'Mitsubishi', cars: [
			{ year: 2004, make: 'Mitsubishi', model: 'Montero', category: 'SUV' },
			{
				year: 2004,
				make: 'Mitsubishi',
				model: 'Lancer',
				category: 'Sedan, Wagon'
			},
			{
				year: 2004,
				make: 'Mitsubishi',
				model: 'Montero Sport',
				category: 'SUV'
			},
			{
				year: 2004,
				make: 'Mitsubishi',
				model: 'Eclipse',
				category: 'Coupe, Convertible'
			},
			{
				year: 2007,
				make: 'Mitsubishi',
				model: 'Galant',
				category: 'Sedan'
			},
			{
				year: 2007,
				make: 'Mitsubishi',
				model: 'Raider Extended Cab',
				category: 'Pickup'
			},
			{
				year: 2006,
				make: 'Mitsubishi',
				model: 'Lancer',
				category: 'Sedan'
			},
			{
				year: 2011,
				make: 'Mitsubishi',
				model: 'Eclipse',
				category: 'Coupe, Convertible'
			},
			{
				year: 2010,
				make: 'Mitsubishi',
				model: 'Endeavor',
				category: 'SUV'
			},
    
		]
	},
]


const CarsSettings = () => {
	const { id } = useParams()
	const [brigade, setBrigade] = useState({
		title: '',
		cars: [],
	})
	const [form, setForm] = useState({
		make: '',
		model: '',
		mileage: '',
		year: '',
		category: '',
	})
	const [brandModels, setBrandModels] = useState([])
	const [isLoading, setIsLoading] = useState(false)
  
	const getBrigadeById = async () => {
		try {
			const docRef = doc(db, 'brigades', id)
			const docBrigade = await getDoc(docRef)
			const {title, cars} = docBrigade.data()
			setBrigade({title, cars})
		} catch (error) {
			console.log(error)
		}
	}

	if(id) {
		useEffect(() => {
			getBrigadeById()
		}, [])
	}



	const createCarForBrigade = async (data) => {
		try {
			const docRef = doc(db, 'brigades', id)

			// Set the "capital" field of the city 'DC'
			await updateDoc(docRef, {
				cars: [...brigade.cars, data]
			})

			// createSuccses()
			setForm({
				make: '',
				model: '',
				mileage: '',
				year: '',
				category: '',
			})
		} catch (error) {
			// createFailed()
			console.log(error)
		}
	}


	const onSubmit = data => {
		if (!isLoading) {
			setIsLoading(true)
			createCarForBrigade(data)
			setIsLoading(false)
		}
	}


	const handleSubmit = e => {
		e.preventDefault()
		e.stopPropagation()

		onSubmit(form)
	}

	const handleBrandSelect = (value) => {
		setBrandModels(CarsArray.filter((car) => car.make === value)[0].cars)
		setForm(oldForm => ({
			...oldForm,
			'make': value,
		}))
	}

	const handleModelSelect = (value) => {
		console.log('VALUE', value)
		setForm(oldForm => ({
			...oldForm,
			...value
		}))
	}

	const handleInput = ({ target }) => {
		setForm(oldForm => ({
			...oldForm,
			[target.name]: target.value,
		}))
	}

	console.log(form)

	return (
		<div className='min-h-page bg-gray-50 flex flex-col py-6 px-4 sm:px-6 lg:px-8'>
			<form className='max-w-[800px] w-full mx-auto flex flex-col gap-10' onSubmit={handleSubmit}>
				<h2 className='mt-2 text-3xl font-bold text-gray-900 '>
					<span>Додати автомобіль {brigade.title ? <span>для бригади {brigade.title}</span> : ''}</span>
				</h2>

				<Select id="brand" items={CarsBrandArray} title={form.make ? form.make : 'Марка'} onSelect={(value) => handleBrandSelect(value)}/>

				<Select id="model" items={brandModels} title={form.model ? <span>{form.model}, {form.year}, {form.category}</span> : 'Модель'} onSelect={(value) => handleModelSelect(value)}/>

				<Input
					name='mileage'
					id='mileage'
					type='number'
					label='Пробіг'
					value={form.mileage}
					placeholder='12000'
					onChange={handleInput}
					// error={beenSubmitted && errors.title}
				/>

				<div className='flex justify-between mt-10'>
					<Button type='submit' primary large>
						Додати
					</Button>
				</div>
			</form>
		</div>
	)
}



export default CarsSettings
