const path = require('path')
const {sepLine} = require('./utils')

const projectRoot = ''

const pagesRoot = path.join(projectRoot, 'src/pages')
const srcRoot = path.join(projectRoot, 'src')
const layoutsRoot = path.join(projectRoot, 'src/layouts')
const modelsRoot = path.join(projectRoot, 'src/models')

module.exports = {
  projectRoot,
  pagesRoot,
  srcRoot,
  layoutsRoot,
  modelsRoot,
}
