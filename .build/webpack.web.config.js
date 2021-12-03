'use strict'

process.env.BABEL_ENV = 'web'

const devMode = process.env.NODE_ENV !== 'production'
const path = require('path')

const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let webConfig = {
  devtool: 'source-map',
  entry: {
    index: path.join(__dirname, '../src/view/index.ui.js'),
  },
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
    new webpack.DefinePlugin({
      'process.env.IS_WEB': 'true',
    }),
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
    path: path.join(__dirname, '../dist/web'),
    globalObject: 'this',
    filename: '[name].js',
  },
  target: 'web',
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/view'),
      '@common': path.join(__dirname, '../src/common'),
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node'],
  },
}

module.exports = webConfig
