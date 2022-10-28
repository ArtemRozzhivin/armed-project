import { connect } from 'react-redux'
import { errorsAction } from '../../redux/action/errors'
// import { coursesActions } from '../../redux/action/courses'
import Courses from './Courses'

const mapStateToProps = (state) => ({
	isLoading: state.courses.isLoading,
	courses: state.courses.courses,
	error: state.courses.error
})

const mapDispatchToProps = (dispatch) => ({
	setError: (error) => dispatch(errorsAction.genericError(error))
})

export default connect(mapStateToProps, mapDispatchToProps)(Courses)
