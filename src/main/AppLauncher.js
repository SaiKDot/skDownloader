import { EventEmitter } from 'events'
import { app } from 'electron'
import is from 'electron-is'

 import ExceptionHandler from './Helpers/ExceptionHandler'
import MainProcess from './MainProcess'
function AppLauncher () {
  // TODO
      //Single instance
      //open at login
  let url = ''
  let file = ''
 handleAppEvents()
  
   
}
function handleAppEvents () {
     handelAppReady()
    //  handleOpenUrl()
    //  handleOpenFile()    
     handleAppWillQuit()
     
}

function handelAppReady() {
    console.log('ready')
    
    app.on('ready', () => {       
      global.main = new MainProcess()   
      const   openedAtLogin   = false

      global.main.start('index', {
        openedAtLogin,
      })

     
    })
}

function handleAppWillQuit() {
  app.on('will-quit', () => {
    logger.info('[Motrix] will-quit')
    if (global.application) {
      global.application.stop()
    }
  })
}
export default  AppLauncher