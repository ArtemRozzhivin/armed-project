import { connect } from 'react-redux'
import { errorsAction } from '../../redux/action/errors'
import { AlertsAction } from '../../redux/action/alerts'
import { authActions } from '../../redux/action/auth'
import CourseView from './CourseView'

const mapStateToProps = (state) => ({
	isLoading: state.courses.isLoading,
	user: state.auth.user,
	courses: state.courses.courses,
	error: state.courses.error,
})

const mapDispatchToProps = (dispatch) => ({
	setError: (error) => dispatch(errorsAction.genericError(error)),
	generateAlerts: (message, type) => dispatch(AlertsAction.generateAlerts(message, type)),
	setUser: (users) => dispatch(authActions.setUser(users)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CourseView)
