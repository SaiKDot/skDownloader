import React, { useState } from 'react'
import { HashRouter, Route } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
import 'normalize.css'

import ListPage from './Pages/ListPage'

import '../Styles/custom.css'
import '../Styles/simple-line-icons.min.css'


const App = props => {
  return (
    <HashRouter>
      
      <Route path="/" exact component={ListPage} />
    </HashRouter>
  )
}

export default App
