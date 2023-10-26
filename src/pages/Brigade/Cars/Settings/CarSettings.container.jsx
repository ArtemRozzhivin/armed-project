import { connect } from 'react-redux'
import { brigadesActions } from '../../redux/action/brigades'
import CarSettings from './CarSettings'
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
		dispatch(AlertsAction.generateAlerts('Автомобіль успішно видалено', 'success'))
	},
	deleteFailed : () => {
		dispatch(errorsAction.genericError('Не вдалося видалити дані автомобіля'))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(CarSettings)
