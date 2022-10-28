/* eslint-disable react/prop-types */
import React from 'react'
import _toString from 'lodash/toString'

class CrashHandler extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			appCrashed: false,
			crashStack: '',
			errorMessage: '',
			crashStackShown: false,
		}
	}

	static getDerivedStateFromError(error) {
		return {
			errorMessage: _toString(error),
			crashStack: error?.stack,
			appCrashed: true,
		}
	}

	onCrashStackClick = () => {
		this.setState((prevState) => ({
			crashStackShown: !prevState.crashStackShown,
		}))
	}

	render() {
		const {
			appCrashed, crashStack, errorMessage, crashStackShown,
		} = this.state
		const { children } = this.props

		if (appCrashed) {
			return (
			// Using style because for some reason min-h-screen doesn't work
				<div style={{ minHeight: '100vh' }}>
					<div>
						<div>
							<p>
                  The app has crashed.
							</p>
							<p>
								{errorMessage}
								<br />
								<span onClick={this.onCrashStackClick}>
									{crashStackShown ? (
										<>
                        Hide crash stack
										</>
									) : (
										<>
                        Show crash stack
										</>
									)}
								</span>
								{crashStackShown && (
									<span>
										{crashStack}
									</span>
								)}
							</p>
						</div>
					</div>
				</div>
			)
		}

		return children
	}
}

export default CrashHandler
