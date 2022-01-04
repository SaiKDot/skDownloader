import { EventEmitter } from 'events'
import { app, shell, dialog, ipcMain } from 'electron'
import is from 'electron-is'
import { readFile } from 'fs'
import { extname, basename } from 'path'
import { isEmpty } from 'lodash'

import logger from './Helpers/Logger'
import WindowManager from './Window/WindowManager'
import MenuManager from './Window/Menu/MenuManager'
import ConfigManager from './Controllers/ConfigManager'
import Engine from './Controllers/Engine'
import EngineClient from './Controllers/EngineClient'
import UPnPManager from './Controllers/UPnPManager'
let commonEmitter = require('./Helpers/Emitter').commonEmitter
import { ENGINE_RPC_HOST } from '@common/constants'
import { Aria2 } from '@common/aria2'
import {
  separateConfig,
  compactUndefined,
  formatOptionsForEngine,
  mergeTaskResult,
  changeKeysToCamelCase,
  changeKeysToKebabCase,
} from '@common/utils'
 
const configManager = new ConfigManager()
let engine
let engineClient
function MainProcess   ()  {
  const menuManager = new MenuManager()

  init()
  var windowManager = new WindowManager({
      userConfig: {},
    })
  function init() {
   
    WindowController()
    handleIpcMessages()
    setupApplicationMenu()
    handleIpcInvokes()
    startEngine()
    initEngineClient()
    fetchDownloadingTaskList()
    initUPnPManager()
  }

  const em = new EventEmitter()

  this.start = function (page, options = {}) {
    const win = showPage(page, options)

    win.once('ready-to-show', () => {
      this.isReady = true
      em.emit('ready')
    })
  }

  function setupApplicationMenu() {
    menuManager.setup()
  }

  function fetchDownloadingTaskList(params = {}) {
    const { offset = 0, num = 20, keys } = params
    const activeArgs = compactUndefined([keys])
    const waitingArgs = compactUndefined([offset, num, keys])
     const host = ENGINE_RPC_HOST
        const port = 16800
        const secret = ''
      let client = new Aria2({
        host,
        port,
        secret,
      })
    return new Promise((resolve, reject) => {
       client
        .multicall([
          ['aria2.tellActive', ...activeArgs],
          ['aria2.tellWaiting', ...waitingArgs],
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

  function adjustMenu() {
    if (is.mas()) {
      const visibleStates = {
        'app.check-for-updates': false,
        'task.new-bt-task': false,
      }
      this.menuManager.updateMenuStates(visibleStates, null, null)
      // this.trayManager.updateMenuStates(visibleStates, null, null)
    }
  }

  function showPage(page, options = {}) {
    const { openedAtLogin } = options
    return windowManager.openWindow(page, {
      hidden: openedAtLogin,
    })
  }

  function WindowController() {
    commonEmitter.on('window-closed', (data) => {
      console.log('yes closef')
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
        message:`Application startup failed: {{message}} ${message}`,
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

  initUPnPManager () {
    this.upnp = new UPnPManager()

    this.watchUPnPEnabledChange()

    this.watchUPnPPortsChange()

    const enabled = this.configManager.getUserConfig('enable-upnp')
    if (!enabled) {
      return
    }

    this.startUPnPMapping()
  }

  async startUPnPMapping () {
    const btPort = this.configManager.getSystemConfig('listen-port')
    const dhtPort = this.configManager.getSystemConfig('dht-listen-port')

    const promises = [
      this.upnp.map(btPort),
      this.upnp.map(dhtPort)
    ]
    try {
      await Promise.allSettled(promises)
    } catch (e) {
      logger.warn('[Motrix] start UPnP mapping fail', e)
    }
  }

  async stopUPnPMapping () {
    const btPort = this.configManager.getSystemConfig('listen-port')
    const dhtPort = this.configManager.getSystemConfig('dht-listen-port')

    const promises = [
      this.upnp.unmap(btPort),
      this.upnp.unmap(dhtPort)
    ]
    try {
      await Promise.allSettled(promises)
    } catch (e) {
      logger.warn('[Motrix] stop UPnP mapping fail', e)
    }
  }

  function watchUPnPPortsChange () {
    const { systemConfig } = this.configManager
    const watchKeys = ['listen-port', 'dht-listen-port']

    watchKeys.forEach((key) => {
      this.configListeners[key] = systemConfig.onDidChange(key, async (newValue, oldValue) => {
        logger.info('[Motrix] detected port change event:', key, newValue, oldValue)
        const enable = this.configManager.getUserConfig('enable-upnp')
        if (!enable) {
          return
        }

        const promises = [
          this.upnp.unmap(oldValue),
          this.upnp.map(newValue)
        ]
        try {
          await Promise.allSettled(promises)
        } catch (e) {
          logger.info('[Motrix] change UPnP port mapping failed:', e)
        }
      })
    })
  }

  function watchUPnPEnabledChange () {
    const { userConfig } = this.configManager
    const key = 'enable-upnp'
    this.configListeners[key] = userConfig.onDidChange(key, async (newValue, oldValue) => {
      logger.info('[Motrix] detected enable-upnp value change event:', newValue, oldValue)
      if (newValue) {
        this.startUPnPMapping()
      } else {
        await this.stopUPnPMapping()
        this.upnp.closeClient()
      }
    })
  }

  async function shutdownUPnPManager () {
    const enable = this.configManager.getUserConfig('enable-upnp')
    if (enable) {
      await this.stopUPnPMapping()
    }

    this.upnp.closeClient()
  }

  function handleCommands() {
    this.on('application:quit', () => {
      handleWindowClosed()
    })
  }

  async function stop() {
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

  async function handleWindowClosed() {
    await stop()
    app.exit()
  }

  async function relaunch() {
    await stop()
    app.relaunch()
    app.exit()
  }
}

// end

function handleIpcMessages() {
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
      const systemConfig =  configManager.getSystemConfig()
      const userConfig =  configManager.getUserConfig()

      const result = {
        ...systemConfig,
        ...userConfig
      }
      return result
    })
  }


export default MainProcess