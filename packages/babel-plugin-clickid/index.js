const t = require('@babel/types')
// const generator = require('@babel/generator').default

let fileUId = 10
const fileAndIdList = []

function addDataClickId(api, options) {
  const clickElements = options.clickElements
  return {
    visitor: {
      Program(path) {
        let moduleName = this.file.opts.filename
        let currentFileId
        const match = fileAndIdList.find(item => item.filepath == moduleName)
        if (match) {
          currentFileId = match.fileId
        } else {
          currentFileId = fileUId++
          fileAndIdList.push({
            filepath: moduleName,
            fileId: currentFileId
          })
        }
        let clickUId = 1 // 当前模块click id

        path.traverse({
          JSXOpeningElement(jsxPath) {
            let node = jsxPath.node
            const match = clickElements.find(ele => ele === node.name.name)
            if (!match) {
              return
            }
            if (!node.attributes) {
              node.attributes = []
            }
            for (let attr of node.attributes) {
              if (attr.name.name == 'data-clickId') {
                return
              }
            }
            // let buttonTxt = generator(node).code
            node.attributes.push(
              t.jsxAttribute(t.jsxIdentifier('data-clickId'), t.stringLiteral(currentFileId + clickUId.toString().padStart(2, '0')))
            )
            clickUId++
          }
        })
      }
    }
  }
}

module.exports = addDataClickId
