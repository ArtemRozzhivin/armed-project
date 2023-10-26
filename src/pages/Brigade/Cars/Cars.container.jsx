import { connect } from 'react-redux'
// import { brigadesActions } from '../../redux/action/brigades'
import Cars from './Cars'
import { AlertsAction } from '../../../redux/action/alerts'
import { errorsAction } from '../../../redux/action/errors'

const mapStateToProps = (state) => ({
	brigades: state.brigades.brigades
})

const mapDispatchToProps = (dispatch) => ({
	deleteSuccses: () => {
		dispatch(AlertsAction.generateAlerts('Автомобіль успішно видалено', 'success'))
	},
	deleteFailed : () => {
		dispatch(errorsAction.genericError('Не вдалося видалити дані автомобіля'))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(Cars)
