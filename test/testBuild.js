let path = require('path')

let buildIcon = require('../lib/index').default



buildIcon({
    src: path.join(__dirname, '../svg'),
    dist: path.join(__dirname, '../dist')
})
