import { connect } from 'react-redux'
import { brigadesActions } from '../../redux/action/brigades'
import MainPage from './MainPage'

const mapStateToProps = (state) => ({
	brigades: state.brigades.brigades
})

const mapDispatchToProps = (dispatch) => ({
	setBrigades: (data) => {
		dispatch(brigadesActions.setBrigades(data))
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(MainPage)
