import { combineReducers } from 'redux';
 
import uiReducer from './uiReducer'
import appReducer from './appReducer'
import formsReducer from './formsReducer'
// import settings from './settingsReducer'

export default combineReducers({
  ui: uiReducer,
  app: appReducer,
  forms: formsReducer,
})