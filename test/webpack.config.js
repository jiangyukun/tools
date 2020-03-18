let webpack = require('webpack')
let FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
let AutoExportColumn = require('../packages/webpack-plugins/AutoExportColumn')

let config = {
  mode: 'development',
  devtool: 'source-map',
  context: __dirname,
  watch: true,
  entry: {
    index: './input/index.tsx'
  },
  resolve: {
    symlinks: false,
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  externals: {
    jquery: 'jQuery'
  },
  output: {
    path: __dirname + '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  plugins: [
    new FriendlyErrorsPlugin(),
    new AutoExportColumn(),
  ]
}

module.exports = config
