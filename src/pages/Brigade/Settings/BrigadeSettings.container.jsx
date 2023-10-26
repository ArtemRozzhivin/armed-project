import { connect } from 'react-redux'
import BrigadeSettings from './BrigadeSettings'
import { AlertsAction } from '../../../redux/action/alerts'
import { errorsAction } from '../../../redux/action/errors'

const mapStateToProps = (state) => ({
	userEmail: state.auth.user.email
})

const mapDispatchToProps = (dispatch) => ({
	createSuccses: () => {
		dispatch(AlertsAction.generateAlerts('Бригаду успішно створено', 'success'))
	},
	createFailed: () => {
		dispatch(errorsAction.genericError('Не вдалося створити бригаду'))
	},
	updateSuccses: () => {
		dispatch(AlertsAction.generateAlerts('Бригаду успішно оновлено', 'success'))
	},
	updateFailed: () => {
		dispatch(errorsAction.genericError('Не вдалося оновити дані бригади'))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(BrigadeSettings)
