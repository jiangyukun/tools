let path = require('path')

let buildIcon = require('../lib/svg-to-antd-component/index').default


buildIcon({
    src: path.join(__dirname, '../svg'),
    dist: path.join(__dirname, '../dist')
})
