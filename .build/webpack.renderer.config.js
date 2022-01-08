'use strict'

process.env.BABEL_ENV = 'renderer'

const devMode = process.env.NODE_ENV !== 'production'
const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
 
 
 

let rendererConfig = {
  entry: {
     index: path.join(__dirname, '../src/renderer/index.js'),
  },
  module: {
    rules: [
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: { filename: '[name].js' }
        }
      },     
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
       {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.js$/,
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
        use: 'node-loader'
      },   
      {
        test: /\.(png|jp?g)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: '/',
          },
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]',
             publicPath: '/',
          }
        }
      }
    ]
  },
  node: {
    __dirname: devMode,
    __filename: devMode
  },
  plugins: [
   
    new HtmlWebpackPlugin({
      title: 'BSK',
      filename: 'index.html',
      chunks: ['index'],
      template: path.resolve(__dirname, '../src/renderer/index.html'),
      // minify: {
      //   collapseWhitespace: true,
      //   removeAttributeQuotes: true,
      //   removeComments: true
      // },
      isBrowser: false,
      isDev: process.env.NODE_ENV !== 'production',
      nodeModules: devMode
        ? path.resolve(__dirname, '../node_modules')
        : false
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    
  ],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron'),
    globalObject: 'this',
    
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      '@shared': path.join(__dirname, '../src/shared')       
    },
    extensions: ['.js', '.json', '.css', '.node']
  },
  externals: {
    'electron-edge-js': 'commonjs2 electron-edge-js',    
  },
  target: 'electron-renderer',
  optimization: {
    minimize: !devMode,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
  },
}

/**
 * Adjust rendererConfig for development settings
 */
if (devMode) {
  rendererConfig.devtool = 'eval-cheap-module-source-map'

  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
}

/**
 * Adjust rendererConfig for production settings
 */
if (!devMode) {
  rendererConfig.plugins.push(
    new CopyWebpackPlugin({
      patterns: [{
        from: path.join(__dirname, '../static'),
        to: path.join(__dirname, '../dist/electron/static'),
        globOptions: { ignore: [ '.*' ] }
      }]
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: false
    })
  )
}

module.exports = rendererConfig
