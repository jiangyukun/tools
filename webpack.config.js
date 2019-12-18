var webpack = require('webpack')
let path = require('path')

var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

class PrintModuleNamePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('PrintModuleNamePlugin', (compilation) => {
      compilation.hooks.finishModules.tap('PrintModuleNamePlugin', modules => {
        modules.map(module => console.log(module.request))
      })
    })
  }
}

module.exports = {
  target: 'node',
  mode: 'none',
  entry: [
    path.join(__dirname, './packages/svg-to-antd-component/index.ts')
  ],
  output: {
    path: path.join(__dirname, './lib'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin()
    // new PrintModuleNamePlugin()
  ]
}
