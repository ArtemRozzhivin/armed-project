import { connect } from 'react-redux'
import CarSettings from './CarSettings'
import { AlertsAction } from '../../../../redux/action/alerts'
import { errorsAction } from '../../../../redux/action/errors'
import { brigadesActions } from '../../../../redux/action/brigades'

const mapStateToProps = (state) => ({
	brigades: state.brigades.brigades,
	userEmail: state.auth.user.email
})

const mapDispatchToProps = (dispatch) => ({
	getBrigades: () => {
		dispatch(brigadesActions.getBrigades())
	},
	updateSuccses: () => {
		dispatch(AlertsAction.generateAlerts('Автомобіль бригади успішно оновлено', 'success'))
	},
	updateFailed: () => {
		dispatch(errorsAction.genericError('Не вдалося оновити дані автомобіля'))
	},
	createSuccses: () => {
		dispatch(AlertsAction.generateAlerts('Автомобіль успішно створено', 'success'))
	},
	createFailed: () => {
		dispatch(errorsAction.genericError('Не вдалося створити автомобіль'))
	},
})

export default connect(mapStateToProps, mapDispatchToProps)(CarSettings)
