import { app } from 'electron'
import is from 'electron-is'

import AppLauncher from './AppLauncher'

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

// if (process.env.NODE_ENV !== 'development') {
//   global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
// }
 
if (is.windows()) {
  app.setAppUserModelId(appId)
}

require('electron-debug')({
  // devToolsMode: 'right',
  showDevTools: false
})

 

 
// require('electron').app.whenReady().then(() => {
//   let installExtension = require('electron-devtools-installer')
//   installExtension.default(installExtension.REACT_DEVELOPER_TOOLS)
//     .then(() => {})
//     .catch(err => {
//       console.log('Unable to install `react-devtools`: \n', err)
//     })
// })

 
//  AppLauncher()



global.appLauncher = new AppLauncher()