import { connect } from 'react-redux'
import { authActions } from '../../../redux/action/auth'
import { errorsAction } from '../../../redux/action/errors'
import Signin from './Signin'

const mapDispatchToProps = (dispatch) => ({
	login: (data, callback) => {
		dispatch(authActions.loginAsync(data, callback))
	},
	loginSuccess: (user) => {
		dispatch(authActions.loginSuccess(user))
	},
	loginFailed: (error) => {
		dispatch(errorsAction.loginFailed(error))
	},
})

export default connect(null, mapDispatchToProps)(Signin)
