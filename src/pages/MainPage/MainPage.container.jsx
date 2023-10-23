import { connect } from 'react-redux'
import { brigadesActions } from '../../redux/action/brigades'
import MainPage from './MainPage'

const mapStateToProps = (state) => ({
	brigades: state.brigades.brigades
})

const mapDispatchToProps = (dispatch) => ({
	setBrigades: (data) => {
		dispatch(brigadesActions.setBrigades(data))
	},
	getBrigades: () => {
		dispatch(brigadesActions.getBrigades())
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(MainPage)
