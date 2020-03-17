const t = require('@babel/types')
const traverse = require('@babel/traverse').default
let { convertCodeUseAst } = require('../astUtil')
let { getFileContent, writeCodeToFile, getFileName } = require('../fileUtil')

function handleJsxPath(path) {
  let node = path.node

  path.replaceWithMultiple(node.children.map(item => {
    if (item.type == 'JSXElement') {
      return item
    }
    if (item.type == 'JSXText') {
      let value = item.value.replace(/[\n| ]/g, '')
      if (value != '') {
        return t.stringLiteral(item.value)
      }
    }
    if (item.type == 'JSXExpressionContainer') {
      return item.expression
    }
  }).filter(item => item != undefined))
}

function convertRender(path) {
  let copyNode = t.cloneNode(path.node)
  traverse(copyNode, {
    JSXElement(path1) {
      handleJsxPath(path1)
    },
    JSXFragment(path1) {
      handleJsxPath(path1)
    }
  }, {}, {}, path)

  return copyNode.value
}

class AutoExportColumn {
  constructor() {
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('AutoExportColumn', (compilation, { normalModuleFactory }) => {
      compilation.hooks.succeedModule.tap('AutoExportColumn', (module) => {
        let resource = module.resource
        if (resource.indexOf('node_modules') != -1) {
          return
        }
        if (resource.indexOf('.tsx') == -1) {
          return
        }
        let code = getFileContent(resource)
        if (code.indexOf('auto-column') == -1) {
          return
        }
        if (code.indexOf('disable-auto-column') != -1) {
          return
        }
        code = code.replace('auto-column', 'disable-auto-column')
        try {
          let result = convertCodeUseAst(code, {
            Program(path) {
              let hasColumnDefinition = false
              let arrayObjectList = []

              path.traverse({
                ClassMethod(path1) {
                  let node = path1.node
                  let method = node.key.name
                  if (method == 'getColumns') {
                    hasColumnDefinition = true
                  }
                  path1.traverse({
                    ObjectExpression(path2) {
                      let node2 = path2.node
                      let objPropertyList = []
                      path2.traverse({
                        ObjectProperty(path3) {
                          let node3 = path3.node

                          let keyName = node3.key.name
                          let valueName = node3.value.value
                          if (keyName == 'title') {
                            objPropertyList.push({
                              key: 'title',
                              value: valueName
                            })
                          }
                          if (keyName == 'dataIndex') {
                            objPropertyList.push({
                              key: 'dataIndex',
                              value: valueName
                            })
                          }
                          if (keyName == 'render') {
                            objPropertyList.push({
                              key: 'render',
                              value: convertRender(path3)
                            })
                          }
                        }
                      })
                      arrayObjectList.push(objPropertyList)
                    }
                  })
                }
              })
              if (hasColumnDefinition) {
                let returnAst = t.returnStatement(
                  t.arrayExpression(
                    arrayObjectList.map(item => {
                      return t.objectExpression(
                        item.map(property => {
                          if (property.key == 'title' || property.key == 'dataIndex') {
                            return t.objectProperty(t.identifier(property.key), t.stringLiteral(property.value))
                          }
                          if (property.key == 'render') {
                            return t.objectProperty(t.identifier(property.key), property.value)
                          }
                          throw new Error('未知property.key')
                        })
                      )
                    })
                  )
                )
                let fileShortName = getFileName(resource)
                path.node.body.push(
                  t.functionDeclaration(t.identifier(`export${fileShortName}Columns`), [], t.blockStatement([returnAst]))
                )
              }
            }
          }, resource)
          writeCodeToFile(resource, result)
        } catch (e) {
        }
      })
    })
  }
}

module.exports = AutoExportColumn
