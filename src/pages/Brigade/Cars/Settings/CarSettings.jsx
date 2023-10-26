import React, { useState, useEffect } from 'react'
// import { auth } from '../../hoc/protected'
import Button from '../../../../ui/Button'
import { db } from '../../../../firebaseConfig'
import { doc, getDoc, updateDoc} from 'firebase/firestore' 
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import Select from '../../../../ui/Search'
import Input from '../../../../ui/Input'
import _replace from 'lodash/replace'
import routes from '../../../../routes'
import { Link, useNavigate } from 'react-router-dom'

const CarsBrandArray = [
	'Audi', 'BMW', 'Toyota', 'Mitsubishi', 'Nissan', 'Honda', 'Kia'
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
	{make: 'Nissan', cars: [
		{
			year: 2017,
			make: 'Nissan',
			model: 'TITAN XD King Cab',
			category: 'Pickup'
		},
		{
			year: 2018,
			make: 'Nissan',
			model: 'NV3500 HD Passenger',
			category: 'Van/Minivan'
		},
		{
			year: 2018,
			make: 'Nissan',
			model: 'NV200',
			category: 'Van/Minivan'
		},
		{
			year: 2017,
			make: 'Nissan',
			model: 'TITAN XD Crew Cab',
			category: 'Pickup'
		},
		{
			year: 2017,
			make: 'Nissan',
			model: 'TITAN Single Cab',
			category: 'Pickup'
		},
		{
			year: 2016,
			make: 'Nissan',
			model: '370Z',
			category: 'Coupe, Convertible'
		},
		{ year: 2019, make: 'Nissan', model: 'LEAF', category: 'Hatchback' },
		{ year: 2019, make: 'Nissan', model: 'Sentra', category: 'Sedan' },
		{ year: 2019, make: 'Nissan', model: 'Murano', category: 'SUV' },
		{
			year: 2019,
			make: 'Nissan',
			model: 'TITAN Single Cab',
			category: 'Pickup'
		},
  
	]},
	{make: 'Honda', cars: [  
		{
			year: 2011,
			make: 'Honda',
			model: 'Accord Crosstour',
			category: 'SUV'
		},
		{
			year: 2011,
			make: 'Honda',
			model: 'Accord',
			category: 'Sedan, Coupe'
		},
		{
			year: 2011,
			make: 'Honda',
			model: 'Civic',
			category: 'Sedan, Coupe'
		},
		{
			year: 2014,
			make: 'Honda',
			model: 'Odyssey',
			category: 'Van/Minivan'
		},
		{
			year: 2014,
			make: 'Honda',
			model: 'Accord',
			category: 'Sedan, Coupe'
		},
		{
			year: 2019,
			make: 'Honda',
			model: 'Accord Hybrid',
			category: 'Sedan'
		},
		{
			year: 2019,
			make: 'Honda',
			model: 'Clarity Fuel Cell',
			category: 'Sedan'
		},
	]},
	{make: 'Kia', cars: [
		{ year: 2012, make: 'Kia', model: 'Soul', category: 'Wagon' },
		{
			year: 2012,
			make: 'Kia',
			model: 'Rio',
			category: 'Hatchback, Sedan'
		},
		{ year: 2015, make: 'Kia', model: 'Sorento', category: 'SUV' },
		{ year: 2015, make: 'Kia', model: 'Cadenza', category: 'Sedan' },
		{
			year: 2015,
			make: 'Kia',
			model: 'Optima Hybrid',
			category: 'Sedan'
		},
		{ year: 2017, make: 'Kia', model: 'Forte', category: 'Sedan' },
		{ year: 2017, make: 'Kia', model: 'Forte5', category: 'Hatchback' },
		{
			year: 2020,
			make: 'Kia',
			model: 'Rio',
			category: 'Sedan, Hatchback'
		},  
	]}
]

const CarsEngineArray = [
	'V8 6.2L, бензиновий, 550 к.с.',
	'TFSI 2.0L дизельний, 170 к.с.',
	'Turbo 2.0L: бензин або дизель, 225 к.с.',
	'Mirage 1.2L: бензиновий, 78 к.с.',
	'TDI 2.0L: дизельний, 160 к.с.',
	'EcoBoost 1.0L: бензиновий, 112 к.с.',
	'Polo 1.0L TSI: бензиновий, 100 к.с.'
]


const CarsSettings = ({updateSuccses, updateFailed, createSuccses, createFailed, getBrigades}) => {
	const { id, carId } = useParams()
	const navigate = useNavigate()
	const [brigade, setBrigade] = useState({
		title: '',
		cars: [],
	})
	const [form, setForm] = useState({
		id: '',
		make: '',
		model: '',
		mileage: '',
		year: '',
		category: '',
		engine: '',
	})
	const [brandmodels, setBrandmodels] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const getBrigadeById = async () => {
		try {
			const docRef = doc(db, 'brigades', id)
			const docBrigade = await getDoc(docRef)
			const {title, cars} = docBrigade.data()
			setBrigade({title, cars})


			if(carId) {
				const editingCar = cars.find((car) => car.id === carId)
				if(editingCar) {
					setForm(editingCar)
					setBrandmodels(CarsArray.filter((car) => car.make === editingCar.make)[0].cars)
				}
			}
        
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
			const newData = {
				...data,
				mileage: data.mileage ? data.mileage : 0,
				id: (new Date().getTime()).toString()
			}
			// Set the "capital" field of the city 'DC'
			await updateDoc(docRef, {
				cars: [...brigade.cars, newData]
			})
			createSuccses()
      
			setForm({
				id: '',
				make: '',
				model: '',
				mileage: '',
				year: '',
				category: '',
			})
			getBrigades()
		} catch (error) {
			createFailed()
			console.log(error)
		}
	}

	const updateBrigadeCar = async (data) => {
		try {
			const docRef = doc(db, 'brigades', id)

			const newCars = brigade.cars.map((car) => {
				if(car.id === carId) {
					return {
						...car,
						...data,
						mileage: data.mileage ? data.mileage : 0,
					}
				}

				return car
			}) 


			// Set the "capital" field of the city 'DC'
			await updateDoc(docRef, {
				cars: [...newCars]
			})
			updateSuccses()
      
			setForm({
				id: '',
				make: '',
				model: '',
				mileage: '',
				year: '',
				category: '',
			})
			getBrigades()
			navigate(_replace(routes.brigade_cars, ':id', id))
		} catch (error) {
			updateFailed()
			console.log(error)
		}
	}


	const onSubmit = data => {
		if (!isLoading) {
			setIsLoading(true)

			if(carId) {
				updateBrigadeCar(data)
				// route user to brigade cars

			} else {
				createCarForBrigade(data)
			}
			setIsLoading(false)
		}
	}


	const handleSubmit = e => {
		e.preventDefault()
		e.stopPropagation()
		onSubmit(form)
	}

	const handleBrandSelect = (value) => {
		setBrandmodels(CarsArray.filter((car) => car.make === value)[0].cars)

		setForm(oldForm => ({
			...oldForm,
			'make': value,
			'model': carId ? '' : oldForm.model,
		}))
	}

	const handlemodelSelect = (value) => {
		setForm(oldForm => ({
			...oldForm,
			...value
		}))
	}


	const handleEngineSelect = (value) => {
		setForm(oldForm => ({
			...oldForm,
			'engine': value,
		}))
	}

	const handleInput = ({ target }) => {
		setForm(oldForm => ({
			...oldForm,
			[target.name]: target.value,
		}))
	}

	return (
		<div className='min-h-page bg-gray-50 flex flex-col py-6 px-4 sm:px-6 lg:px-8'>      
			<form className='max-w-[800px] w-full mx-auto flex flex-col gap-10' onSubmit={handleSubmit}>
				<h2 className='mt-2 text-3xl font-bold text-gray-900 '>
					{carId ? <span>Змінити дані автомобілю</span> : <span>Додати автомобіль {brigade.title ? <span>для бригади {brigade.title}</span> : ''}</span>}
				</h2>

				<div>
					<Select label="Марка" id="brand" items={CarsBrandArray} title={form.make ? form.make : 'Марка'} onSelect={(value) => handleBrandSelect(value)}/>
				</div>

				{console.log(form)}

				<div>
					<Select disabled={!form.make} label="Модель" id="model" items={brandmodels} title={form.model ? <span>{form.model}, {form.year}, {form.category}</span> : 'Модель'} onSelect={(value) => handlemodelSelect(value)}/>
				</div>

				<div>
					<Select disabled={!form.model} label="Двигун" id="engine" items={CarsEngineArray} title={form.engine ? form.engine : 'Двигун'} onSelect={(value) => handleEngineSelect(value)}/>
				</div>

				<Input
					name='mileage'
					id='mileage'
					type='number'
					label='Пробіг'
					value={form.mileage}
					placeholder='12000'
					onChange={handleInput}
				/>

				<div className='flex justify-between mt-10'>
					<Link to={-1}>
						<Button primary large className='h-10'>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
								<path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
							</svg>
						</Button> 
					</Link>
					<Button disabled={!form.make || !form.model || !form.engine} type='submit' primary large>
						{carId ? <span>Змінити</span> : <span>Створити</span>}
					</Button>
				</div>
			</form>
		</div>
	)
}

CarsSettings.propTypes = {
	createSuccses: PropTypes.func.isRequired,
	createFailed: PropTypes.func.isRequired,
	updateSuccses: PropTypes.func.isRequired,
	updateFailed: PropTypes.func.isRequired,
	getBrigades: PropTypes.func.isRequired,
}


export default CarsSettings
