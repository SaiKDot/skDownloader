import { app } from 'electron'
import is from 'electron-is'
import { existsSync, writeFile, unlink } from 'fs'
import { resolve, join } from 'path'
import { spawn } from 'child_process'
import engineBinMap from '../utils/engine'
import logger from '../Helpers/Logger'
 
// import {
//   getEngineBin,
//   getEnginePidPath,
//   getSessionPath,
//   transformConfig,
// } from '../utils/index'

const { platform } = process

export default class Engine {
  // ChildProcess | null
  static instance = null

  constructor(options = {}) {
    this.options = options

    
    this.systemConfig = options.systemConfig
    this.userConfig = options.userConfig
    this.basePath = this.getBasePath()
  }

  start() {
    const pidPath = getEnginePidPath()
    logger.info('>> App << Engie pid path:', pidPath)

    if (this.instance) {
      return
    }

    const binPath = this.getBinPath()
    const args = this.getStartArgs()
    this.instance = spawn(binPath, args, {
      windowsHide: false,
      stdio: is.dev() ? 'pipe' : 'ignore',
    })
    const pid = this.instance.pid.toString()
    this.writePidFile(pidPath, pid)

    this.instance.once('close', function () {
      try {
        unlink(pidPath, function (err) {
          if (err) {
           logger.warn(`>> App << Unlink engine process pid file failed: ${err}`)
          }
        })
      } catch (err) {
       logger.warn(`>> App << Unlink engine process pid file failed: ${err}`)
      }
    })

    if (is.dev()) {
      this.instance.stdout.on('data', function (data) {
       logger.log('>> App << engine stdout===>', data.toString())
      })

      this.instance.stderr.on('data', function (data) {
       logger.log('>> App << engine stderr===>', data.toString())
      })
    }
  }

  stop() {
    if (this.instance) {
      this.instance.kill()
      this.instance = null
    }
  }

  writePidFile(pidPath, pid) {
    writeFile(pidPath, pid, (err) => {
      if (err) {
       logger.error(`>> App << Write engine process pid failed: ${err}`)
      }
    })
  }

  getBinPath() {
    const binName = getEngineBin(platform)
    if (!binName) {
      throw new Error('The engine is damaged, please reinstall : (')
    }

    const result = join(this.basePath, `/engine/${binName}`)
    const binIsExist = existsSync(result)
    if (!binIsExist) {
     logger.error('>> App << engine bin is not exist:', result)
      throw new Error('The engine is missing, please reinstall : (')
    }

    return result
  }

  getBasePath() {
    let result = resolve(app.getAppPath(), '..')

    if (is.dev()) {
      result = resolve(__dirname, `../../../src/extra/${platform}`)
    }

    return result
  }

  getStartArgs() {
    const confPath = join(this.basePath, '/engine/aria2.conf')

    const sessionPath = this.userConfig['session-path'] || getSessionPath()
    const sessionIsExist = existsSync(sessionPath)

    let result = [`--conf-path=${confPath}`, `--save-session=${sessionPath}`]
    if (sessionIsExist) {
      result = [...result, `--input-file=${sessionPath}`]
    }

    const extraConfig = {
      ...this.systemConfig,
    }
    const keepSeeding = this.userConfig['keep-seeding']
    const seedRatio = this.systemConfig['seed-ratio']
    if (keepSeeding || seedRatio === 0) {
      extraConfig['seed-ratio'] = 0
      delete extraConfig['seed-time']
    }
    console.log('extraConfig===>', extraConfig)

    const extra = transformConfig(extraConfig)
    result = [...result, ...extra]

    return result
  }

  isRunning(pid) {
    try {
      return process.kill(pid, 0)
    } catch (e) {
      return e.code === 'EPERM'
    }
  }

  restart() {
    this.stop()
    this.start()
  }


}


function getEngineBin(platform) {
  console.log({platform})
  const result = engineBinMap[platform] || ''
  return result
}

function getEnginePidPath() {
  return resolve(app.getPath('userData'), './engine.pid')
}


function getSessionPath() {
  return resolve(app.getPath('userData'), './download.session')
}

function transformConfig(config) {
  const result = []
  for (const [k, v] of Object.entries(config)) {
    if (v !== '') {
      result.push(`--${k}=${v}`)
    }
  }
  return result
}
