var webpack = require('webpack');
let path = require('path')

var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: [
        path.join(__dirname, './packages/svg-to-antd-component/index.ts')
    ],
    output: {
        path: path.join(__dirname, './'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/},
            {test: /\.ts$/, loaders: ['ts-loader'], exclude: /node_modules/},
        ]
    },
    resolve: {
        extensions: ['.js', '.ts', '.json']
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin(),
    ],
};
