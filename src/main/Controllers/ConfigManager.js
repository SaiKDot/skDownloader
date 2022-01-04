import { app } from 'electron'
import is from 'electron-is'
import Store from 'electron-store'
import { resolve } from 'path'
import {
  ENGINE_MAX_CONNECTION_PER_SERVER,
  LOGIN_SETTING_OPTIONS,
} from '../utils/constants'
import  { separateConfig } from '@common/utils'
let systemConfig = {}
let userConfig = {}

function ConfigManager() {
  
   init()
   this.getSystemConfig = function (key, defaultValue) {
    if (typeof key === 'undefined' &&
        typeof defaultValue === 'undefined') {
      return systemConfig.store
    }

    return systemConfig.get(key, defaultValue)
  };

  this.getUserConfig = function (key, defaultValue) {
    if (typeof key === 'undefined' && typeof defaultValue === 'undefined') {
      return userConfig.store
    }
    return userConfig.get(key, defaultValue)
  }

  this.setSystemConfig  = function(...args) {
    systemConfig.set(...args)
  }

  this.setUserConfig =  function (...args) {
    this.userConfig.set(...args)
  }

  function fixUserConfig() {
    // Fix the value of open-at-login when the user delete
    // the App self-starting item through startup management.
    const openAtLogin = app.getLoginItemSettings(
      LOGIN_SETTING_OPTIONS
    ).openAtLogin
    if (getUserConfig('open-at-login') !== openAtLogin) {
      this.setUserConfig('open-at-login', openAtLogin)
    }
  }
  
}




function init() {
      initSystemConfig()
      initUserConfig()
}
function initSystemConfig () {
    systemConfig = new Store({
      name: 'system',      
      defaults: {
        'all-proxy': '',
        'allow-overwrite': false,
        'auto-file-renaming': true,     
        'continue': true,
        'dht-file-path': getDhtPath(4),
        'dht-file-path6': getDhtPath(6),
        'dht-listen-port': 26701,
        'dir': getUserDownloadsPath(),        
        'listen-port': 21301,
        'max-concurrent-downloads': 5,
        'max-connection-per-server': getMaxConnectionPerServer(),
        'max-download-limit': 0,
        'max-overall-download-limit': 0,
        'max-overall-upload-limit': '256K',
        'min-split-size': '1M',
        'no-proxy': '',
        'pause': true,
        'pause-metadata': false,
        'rpc-listen-port': 16800,
        'rpc-secret': '',       
        'split': getMaxConnectionPerServer(),
        'user-agent': 'Transmission/2.94'
      }
       
    })
    //ConfigManager().fixSystemConfig()
}

function initUserConfig () {
   userConfig = new Store({
      name: 'user',
      defaults: {
        'all-proxy-backup': '',
        'auto-check-update': is.macOS(),
        'auto-hide-window': false,
        'auto-sync-tracker': true,
        'enable-upnp': true,
        'engine-max-connection-per-server': getMaxConnectionPerServer(),
        'hide-app-menu': is.windows() || is.linux(),
        'keep-seeding': false,
        'keep-window-state': false,
        'last-check-update-time': 0,
        'log-path': getLogPath(),
        'new-task-show-downloading': true,
        'no-confirm-before-delete-task': false,
        'open-at-login': false,         
        'resume-all-when-app-launched': false,
        'run-mode': 'standard',
        'session-path': getSessionPath(),
        'task-notification': true,
        // 'theme': APP_THEME.AUTO,     
        // 'tray-theme': APP_THEME.AUTO,        
        'update-channel': 'latest',
        'use-proxy': false,
        'window-state': {}
      }      
    })
    //fixUserConfig()
}

function  fixSystemConfig () {
    // Remove aria2c unrecognized options
    const { others } = separateConfig(systemConfig.store)
    if (!others) {
      return
    }
    Object.keys(others).forEach(key => {
      systemConfig.delete(key)
    })  
}



export function getDhtPath (protocol) {
  const name = protocol === 6 ? 'dht6.dat' : 'dht.dat'
  return resolve(app.getPath('userData'), `./${name}`)
}


export const getMaxConnectionPerServer = () => {
  return ENGINE_MAX_CONNECTION_PER_SERVER
}

export function getUserDownloadsPath() {
  return app.getPath('downloads')
}

export function getLogPath() {
  return app.getPath('logs')
}

export function getSessionPath() {
  return resolve(app.getPath('userData'), './download.session')
}

export function getEnginePidPath() {
  return resolve(app.getPath('userData'), './engine.pid')
}

export function getUserDataPath() {
  return app.getPath('userData')
}


export function reset() {
    systemConfig.clear()
    userConfig.clear()
}

export default ConfigManager