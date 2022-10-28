import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import CrashHandler from './pages/CrashHandler'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(
	document.getElementById('root')
)

root.render(
	<React.StrictMode>
		<CrashHandler>
			<Provider store={store}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</Provider>
		</CrashHandler>
	</React.StrictMode>
)

reportWebVitals()
