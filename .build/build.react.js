'use strict'

const chalk = require('chalk')
const electron = require('electron')
const path = require('path')
const { say } = require('cfonts')
const { spawn } = require('child_process')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackHotMiddleware = require('webpack-hot-middleware')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const rendererConfig = require('./webpack.web.config')

const doneLog = chalk.bgGreen.white(' DONE ') + ' '
const errorLog = chalk.bgRed.white(' ERROR ') + ' '
const okayLog = chalk.bgBlue.white(' OKAY ') + ' '
const isCI = process.env.CI || false

let hotMiddleware

function logStats(proc, data) {
  let log = ''

  log += chalk.yellow.bold(
    `┏ ${proc} Process ${new Array(19 - proc.length + 1).join('-')}`
  )
  log += '\n\n'

  if (typeof data === 'object') {
    data
      .toString({
        colors: true,
        chunks: false,
      })
      .split(/\r?\n/)
      .forEach((line) => {
        log += '  ' + line + '\n'
      })
  } else {
    log += `  ${data}\n`
  }

  log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n'

  console.log(log)
}

function web() {
  rendererConfig.entry.index = rendererConfig.entry.index
  rendererConfig.mode = 'development'
  const compiler = webpack(rendererConfig)
  hotMiddleware = webpackHotMiddleware(compiler, {
    log: false,
    heartbeat: 2500,
  })

  compiler.hooks.compilation.tap('compilation', (compilation) => {
    HtmlWebpackPlugin.getHooks(compilation).afterEmit.tapAsync(
      'html-webpack-plugin-after-emit',
      (data, cb) => {
        hotMiddleware.publish({ action: 'reload' })
        cb()
      }
    )
  })

  compiler.hooks.done.tap('done', (stats) => {
    logStats('RendererStats', stats)
  })

  const server = new WebpackDevServer(compiler, {
    contentBase: path.join(__dirname, '../'),
    quiet: true,
    open: true,
    // publicPath: path.join(__dirname, '../dist/'),
    publicPath: '/', // if you don't put the "/" here, you get this error:
    before(app, ctx) {
      app.use(hotMiddleware)
      ctx.middleware.waitUntilValid(() => {
        // resolve()
      })
    },
  })

  server.listen(3001)
}

function greeting() {
  const cols = process.stdout.columns
  let text = ''

  if (cols > 104) text = 'electron-React'
  else if (cols > 76) text = 'electron-|React'
  else text = false

  if (text) {
    say(text, {
      colors: ['yellow'],
      font: 'simple3d',
      space: false,
    })
  } else console.log(chalk.yellow.bold('\n  electron-React'))
  console.log(chalk.blue('  getting ready...') + '\n')
}

function init() {
  greeting()

  web()
}

init()
