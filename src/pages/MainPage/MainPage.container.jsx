import { connect } from 'react-redux'
import { brigadesActions } from '../../redux/action/brigades'
import MainPage from './MainPage'
import { AlertsAction } from '../../redux/action/alerts'
import { errorsAction } from '../../redux/action/errors'

const mapStateToProps = (state) => ({
	brigades: state.brigades.brigades
})

const mapDispatchToProps = (dispatch) => ({
	setBrigades: (data) => {
		dispatch(brigadesActions.setBrigades(data))
	},
	getBrigades: () => {
		dispatch(brigadesActions.getBrigades())
	},
	deleteSuccses: () => {
		dispatch(AlertsAction.generateAlerts('Бригаду успішно видалено', 'success'))
	},
	deleteFailed : () => {
		dispatch(errorsAction.genericError('Не вдалося видалити бригаду'))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(MainPage)
