'use strict'

process.env.BABEL_ENV = 'renderer'

const devMode = process.env.NODE_ENV !== 'production'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

let rendererConfig = {
  entry: {
    index: path.join(__dirname, '../src/view/index.js'),
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jp?g)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: '/',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(woff|woff2|eot|ttf)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/',
        },
      },
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            'react-hot-loader/babel',
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-transform-runtime',
          ],
        },
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  node: {
    __dirname: devMode,
    __filename: devMode,
    global: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'BSK',
      filename: 'index.html',
      chunks: ['index'],
      template: path.resolve(__dirname, '../src/view/index.html'),

      nodeModules: devMode ? path.resolve(__dirname, '../node_modules') : false,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  optimization: {
    minimize: !devMode,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
      }),
    ],
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron'),
    sourceMapFilename: '[file].map[query]',
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/view'),
      '@common': path.join(__dirname, '../src/common'),
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node'],
  },
  externals: [
    {
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    },
  ],

  target: 'electron-renderer',
}

/**
 * Adjust rendererConfig for development settings
 */
if (devMode) {
  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      __static: `"${path
        .join(__dirname, '../src/view/images')
        .replace(/\\/g, '\\\\')}"`,
    })
  )
}

module.exports = rendererConfig
