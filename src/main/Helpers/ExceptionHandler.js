import { app, dialog } from 'electron'
import is from 'electron-is'

const defaults = {
  showDialog: !is.dev(),
}

function ExceptionHandler (options) {
  let opts = {
    ...defaults,
    ...options,
  }
   const { showDialog } = opts
    process.on('uncaughtException', (err) => {
      const { message, stack } = err
      logger.error(`App : Uncaught exception: ${message}`)
      logger.error(stack)

      if (showDialog && app.isReady()) {
        dialog.showErrorBox('Error: ', message)
      }
    })
}

export default ExceptionHandler