/* eslint-disable */
import { app } from 'electron'
import is from 'electron-is'
import Store from 'electron-store'

import {
  getDhtPath,
  getLogPath,
  getSessionPath,
  getUserDownloadsPath,
  getMaxConnectionPerServer
} from '../utils/index'
import {
  APP_RUN_MODE,
  APP_THEME,
  EMPTY_STRING,
  IP_VERSION,
  LOGIN_SETTING_OPTIONS,
  NGOSANG_TRACKERS_BEST_IP_URL_CDN,
  NGOSANG_TRACKERS_BEST_URL_CDN
} from '@shared/constants'
import { separateConfig } from '@shared/utils'
import { reduceTrackerString } from '@shared/utils/tracker'

function ConfigManager() {
  
   init()
   let systemConfig
   let userConfig

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


   

    function reset() {
      systemConfig.clear()
      userConfig.clear()
  }
  
}






export default ConfigManager
/* eslint-disable */