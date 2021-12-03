import React, { useEffect } from 'react'
import { HashRouter, Route } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
import 'normalize.css'

import ListPage from './Pages/ListPage'

import '../Styles/custom.css'
import '../Styles/simple-line-icons.min.css'


const App = props => {
  useEffect(() => {
    document.addEventListener('contextmenu', (event) => event.preventDefault())

  },[])
  return (
    <HashRouter>
      
      <Route path="/" exact component={ListPage} />
    </HashRouter>
  )
}

export default App
