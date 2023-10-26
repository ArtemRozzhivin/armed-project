const routes = Object.freeze({
	singin: '/signin',
	singup: '/signup',
	main: '/',
	courses: '/courses',
	user_settings: '/settings',
	users: '/users',
	new_brigade: '/brigade/new',
	edit_brigade: '/brigade/:id',
	brigade_cars: '/brigade/:id/cars',
	new_car: '/brigade/:id/cars/new',
	edit_car: '/brigade/:id/cars/edit/:carId',
})

export default routes
