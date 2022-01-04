'use strict'

process.env.BABEL_ENV = 'main'

const devMode = process.env.NODE_ENV !== 'production'
const path = require('path')
const { dependencies, build } = require('../package.json')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
 

let mainConfig = {
  entry: {
    main: path.join(__dirname, '../src/main/index.js'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.csx$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/',
        },
      },
    ],
  },

  node: {
    __dirname: devMode,
    __filename: devMode,
  },
  plugins: [],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron'),
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/main'),
      '@common': path.join(__dirname, '../src/common'),
    },
    extensions: ['.js', '.json', '.node'],
  },
  target: 'electron-main',
  externals: {
    'electron-edge-js': 'commonjs2 electron-edge-js',
    'utf-8-validate': 'commonjs utf-8-validate',
    bufferutil: 'commonjs bufferutil',
  },
}
if (devMode) {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`,
      'appId': `"${build.appId}"`
    })
  )
}


module.exports = mainConfig