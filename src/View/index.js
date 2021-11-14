 
import React from "react"
import ReactDOM from "react-dom"
import App from './components/App'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import reducers from './reducers'
import thunk from 'redux-thunk'
import { StylesProvider } from '@mui/styles'

const store = createStore(reducers, applyMiddleware(thunk, ipc))

ReactDOM.render(
	<Provider store={ store }>
		<StylesProvider injectFirst={true}>
			<App />
		</StylesProvider>
		
	</Provider>
	
	, 
	document.getElementById("root")
);