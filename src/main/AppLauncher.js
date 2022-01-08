/* eslint-disable */
import { EventEmitter } from 'events'
import { app } from 'electron'
import is from 'electron-is'

import ExceptionHandler from './Helpers/ExceptionHandler'
import logger from './Helpers/Logger'
import MainProcess from './MainProcess'
import {
  splitArgv,
  parseArgvAsUrl,
  parseArgvAsFile
} from './utils'
import { EMPTY_STRING } from '@shared/constants'

function  Launcher () {
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

export default Launcher
/* eslint-disable */