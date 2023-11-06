const routes = Object.freeze({
	singin: '/signin',
	singup: '/signup',
	main: '/',
	user_settings: '/settings',
	users: '/users',
	new_brigade: '/brigade/new',
	edit_brigade: '/brigade/:id',
	brigade_cars: '/brigade/:id/cars',
	new_car: '/brigade/:id/cars/new',
	edit_car: '/brigade/:id/cars/edit/:carId',
	wait_access: '/wait_access'
})

export default routes
