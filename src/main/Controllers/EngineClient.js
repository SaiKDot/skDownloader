'use strict'

import { Aria2 } from '@common/aria2'

import logger from '../Helpers/Logger'
import { compactUndefined, formatOptionsForEngine } from '@common/utils'
import {
  ENGINE_RPC_HOST,
  ENGINE_RPC_PORT,
  EMPTY_STRING,
} from '@common/constants'

const defaults = {
  host: ENGINE_RPC_HOST,
  port: ENGINE_RPC_PORT,
  secret: EMPTY_STRING,
}

export default class EngineClient {
  static instance = null
  static client = null

  constructor(options = {}) {
    this.options = {
      ...defaults,
      ...options,
    }

    this.init()
  }

  init() {
    this.connect()
  }

  connect() {
    logger.info('>> App << main engine client connect', this.options)
    const { host, port, secret } = this.options
    this.client = new Aria2({
      host,
      port,
      secret,
    })
  }

  async call(method, ...args) {
    return this.client.call(method, ...args).catch((err) => {
      logger.warn('>> App << call client fail:', err.message)
    })
  }

  async changeGlobalOption(options) {
    logger.info('>> App << change engine global option:', options)
    const args = formatOptionsForEngine(options)

    return this.call('changeGlobalOption', args)
  }

  async shutdown(options = {}) {
    const { force = false } = options
    const { secret } = this.options

    const method = force ? 'forceShutdown' : 'shutdown'
    const args = compactUndefined([secret])
    return this.call(method, ...args)
  }
}
