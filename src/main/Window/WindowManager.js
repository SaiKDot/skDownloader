import { join , resolve} from 'path'
import { EventEmitter } from 'events'
import { app, shell, screen, BrowserWindow } from 'electron'
import is from 'electron-is'
let commonEmitter = require('../Helpers/Emitter').commonEmitter
 


function WindowManager (options = {}) {
  const emitter = new EventEmitter()
  const windows = {}
  const willQuit = false
  const defaultBrowserOptions = {
    titleBarStyle: 'hiddenInset',
    show: false,
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false,
      webviewTag: true,
      contextIsolation: false,
       
    },
  }

  const customAttrs = {
    attrs: {
      title: 'Motrix',
      width: 1024,
      height: 768,
      minWidth: 400,
      minHeight: 420,
      // backgroundColor: '#FFFFFF',
      transparent: !is.windows(),
    },
    bindCloseToHide: true,
    url: is.dev() ? 'http://localhost:3002' : `file://${__dirname}/index.html`,
  }
  const userConfig = options.userConfig || {}

  function getPageOptions(page) {
    const result = customAttrs  || {}
    const hideAppMenu = userConfig['hide-app-menu']
    if (hideAppMenu) {
      result.attrs.frame = false
    }

    // Optimized for small screen users
    
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    const widthScale = width >= 1280 ? 1 : 0.875
    const heightScale = height >= 800 ? 1 : 0.875
    result.attrs.width *= widthScale
    result.attrs.height *= heightScale
     
    if (is.linux()) {
      result.attrs.icon = join(__static, './512x512.png')
    }

    return result
  }

  function getPageBounds (page) {
    const enabled =  userConfig['keep-window-state'] || false
    const windowStateMap =  userConfig['window-state'] || {}
    let result = null
    if (enabled) {
      result = windowStateMap[page]
    }

    return result
  }

  this.openWindow = function (page, options = {}) {
    const pageOptions = getPageOptions(page)
    const { hidden } = options
    const autoHideWindow = userConfig['auto-hide-window']
    let window = windows[page] || null
    if (window) {
      window.show()
      window.focus()
      return window
    }

    window = new BrowserWindow({
      ...defaultBrowserOptions,
      ...pageOptions.attrs,
    })

    // const bounds = getPageBounds(page)
    // if (bounds) {
    //   window.setBounds(bounds)
    // }

    window.webContents.on('new-window', (e, url) => {
      e.preventDefault()
      shell.openExternal(url)
    })

    if (pageOptions.url) {
      window.loadURL(pageOptions.url)
    }

    window.once('ready-to-show', () => {
      if (!hidden) {
        window.show()
      }
    })

    window.on('enter-full-screen', () => {
      this.emit('enter-full-screen', window)
    })

    window.on('leave-full-screen', () => {
      this.emit('leave-full-screen', window)
    })

    // handleWindowState(page, window)
    //TODO
    //store window state
    handleWindowClose(pageOptions, page, window)

    bindAfterClosed(page, window)

    addWindow(page, window)
    if (autoHideWindow) {
      this.handleWindowBlur()
    }
    return window
  }

   function getWindow(page) {
     return this.windows[page]
   }

   function getWindows() {
     return windows || {}
   }

  function addWindow(page, window) {
    windows[page] = window
  }


  function handleWindowClose(pageOptions, page, window) {
    window.on('close', (event) => {
      console.log('closed')
      if (pageOptions.bindCloseToHide && !willQuit) {
        event.preventDefault()

        if (window.isFullScreen()) {
          window.once('leave-full-screen', () => window.hide())

          window.setFullScreen(false)
        } else {
          window.hide()
        }
      }
      const bounds = window.getBounds()
      //TODO 
        //window store bounds
      commonEmitter.emit('window-closed', { page, bounds })
    })
  }


  function destroyWindow(page) {
    const win = getWindow(page)
    removeWindow(page)
    win.removeListener('closed')
    win.removeListener('move')
    win.removeListener('resize')
    win.destroy()
  }


 

  function removeWindow(page) {
    windows[page] = null
  }


  function destroyWindow(page) {
    const win = getWindow(page)
    removeWindow(page)
    win.removeListener('closed')
    win.removeListener('move')
    win.removeListener('resize')
    win.destroy()
  }

  function bindAfterClosed(page, window) {
    window.on('closed', (event) => {
      removeWindow(page)
    })
  }
}


export default WindowManager