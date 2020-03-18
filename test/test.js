let webpack = require('webpack')
let config = require('./webpack.config')

let compiler = webpack(config)




compiler.run((err) => {
    // console.log(err)
})
