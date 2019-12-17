var webpack = require('webpack');
let path = require('path')

var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

module.exports = {
    mode: 'development',
    target: "node",
    entry: [
        path.join(__dirname, './packages/svg-to-antd-component/index.ts')
    ],
    output: {
        path: path.join(__dirname, './lib'),
        filename: 'index.js'
    },
    module: {
        rules: [
            {test: /\.ts$/, loaders: ['ts-loader'], exclude: /node_modules/},
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin(),
    ],
};
