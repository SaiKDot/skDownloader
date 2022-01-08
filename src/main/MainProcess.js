/* eslint-disable */
import { EventEmitter } from 'events'
import { app, shell, dialog, ipcMain } from 'electron'
import is from 'electron-is'
import { readFile, unlink } from 'fs'
import { extname, basename } from 'path'
import { isEmpty } from 'lodash'
import getIcons from '@shared//icons'
import {
  APP_RUN_MODE,
  AUTO_SYNC_TRACKER_INTERVAL,
  AUTO_CHECK_UPDATE_INTERVAL,
  ENGINE_RPC_HOST
} from '@shared/constants'
import {
  checkIsNeedRun,
  compactUndefined,
  mergeTaskResult
} from '@shared/utils'
import {
  convertTrackerDataToComma,
  fetchBtTrackerFromSource,
  reduceTrackerString
} from '@shared/utils/tracker'
import logger from './Helpers/Logger'
import ConfigManager from './Controllers/ConfigManager'
import Engine from './Controllers/Engine'
import EngineClient from './Controllers/EngineClient'
import WindowManager from './Window/WindowManager'
import MenuManager from './Window/MenuManager' 
import { getSessionPath } from './utils'
import { Aria2 } from '@shared/aria2'
const commonEmitter = require('./Helpers/Emitter').commonEmitter

function MainProcess () {

  const menuManager = new MenuManager()
  const configManager = new ConfigManager()
  let engineClient
  let engine
  let windowManager
  init()
 
  function init () {

    windowManager = new WindowManager({
       userConfig: {}
     })

    WindowController()
    handleIpcMessages()
    setupApplicationMenu()
    handleIpcInvokes()
    startEngine()
    initEngineClient()
    fetchDownloadingTaskList()
    getIcons(function(data){
           console.log({data}); 
      });
        
    
  }  

  this.start = function (page, options = {}) {
    const win = showPage(page, options)

    win.once('ready-to-show', () => {
      this.isReady = true
      commonEmitter.emit('ready')
    })
  }

  function setupApplicationMenu () {
    menuManager.setup()
  }

  function fetchDownloadingTaskList (params = {}) {
    const { offset = 0, num = 20, keys } = params
    const activeArgs = compactUndefined([keys])
    const waitingArgs = compactUndefined([offset, num, keys])
    const host = ENGINE_RPC_HOST
    const port = 16800
    const secret = ''
    const client = new Aria2({
      host,
      port,
      secret
    })

    return new Promise((resolve, reject) => {
      client
        .multicall([
          ['aria2.tellActive', ...activeArgs],
          ['aria2.tellWaiting', ...waitingArgs]
        ])
        .then((data) => {
          console.log('[Motrix] fetch downloading task list data:', data)
          const result = mergeTaskResult(data)
          resolve(result)
        })
        .catch((err) => {
          console.log('[Motrix] fetch downloading task list fail:', err)
          reject(err)
        })
    })
  }

  function adjustMenu () {
    if (is.mas()) {
      const visibleStates = {
        'app.check-for-updates': false,
        'task.new-bt-task': false
      }
      this.menuManager.updateMenuStates(visibleStates, null, null)
      // this.trayManager.updateMenuStates(visibleStates, null, null)
    }
  }

  function showPage (page, options = {}) {
    const { openedAtLogin } = options
    return windowManager.openWindow(page, {
      hidden: openedAtLogin
    })
  }

  function WindowController () {
     
    commonEmitter.on('window-closed', (data) => {     
      handleWindowClosed(data)
    })
  }


  function startEngine () {
    const self = this

    try {
      engine = new Engine({
        systemConfig: configManager.getSystemConfig(),
        userConfig: configManager.getUserConfig()
      })
      engine.start()
    } catch (err) {
      const { message } = err
      dialog.showMessageBox({
        type: 'error',
        title: 'System Error',
        message: `Application startup failed: {{message}} ${message}`
      }).then(_ => {
        setTimeout(() => {
          handleWindowClosed()
        }, 100)
      })
    }
  }

  async function stopEngine () {
    try {
      await engineClient.shutdown({ force: true })
      setImmediate(() => {
        engine.stop()
      })
    } catch (err) {
      logger.warn('>> App << shutdown engine fail: ', err.message)
    } finally {
      // no finally
    }
  }

  function initEngineClient () {
    const port = configManager.getSystemConfig('rpc-listen-port')
    const secret = configManager.getSystemConfig('rpc-secret')
    engineClient = new EngineClient({
      port,
      secret
    })
  } 
 
  async function stop () {
    try {
      // await this.shutdownUPnPManager()

      // this.energyManager.stopPowerSaveBlocker()

      await stopEngine()

      // this.trayManager.destroy()
      logger.info('>> App << processes stopping')
    } catch (err) {
      logger.warn('>> App << stop error: ', err.message)
    }
  }

  async function handleWindowClosed () {
    await stop()
    app.exit()
  }

  async function relaunch () {
    await stop()
    app.relaunch()
    app.exit()
  }

  function handleIpcMessages () {
    ipcMain.on('command', (event, command, ...args) => {
      logger.log('>> App << ipc receive command', command, ...args)
      this.emit(command, ...args)
    })

    ipcMain.on('event', (event, eventName, ...args) => {
      logger.log('>> App <<  ipc receive event', eventName, ...args)
      this.emit(eventName, ...args)
    })
  }

  function handleIpcInvokes () {
    ipcMain.handle('get-app-config', async () => {
      const systemConfig = configManager.getSystemConfig()
      const userConfig = configManager.getUserConfig()

      const result = {
        ...systemConfig,
        ...userConfig
      }
      return result
    })
  }

}

// end


export default MainProcess
/* eslint-disable */
