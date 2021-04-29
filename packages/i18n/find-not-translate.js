const path = require('path')
const {convertCodeUseAst} = require('../astUtil')
const {bootstrap, sepLine} = require('../utils')
const {srcRoot, projectRoot} = require('../constants')

let data = require('E:\\Project2021\\solar-platform-view\\src\\public\\locale\\en_US.json')

let list = []

function convertFile(code, namespace, filePath) {
  if (filePath.indexOf('.ts') == -1 && filePath.indexOf('.tsx') == -1) {
    return
  }
  if (filePath.indexOf('mock.ts') != -1) {
    return
  }
  let converted = false
  let resultCode = convertCodeUseAst(code, {
    CallExpression(callPath) {
      let callNode = callPath.node
      let callee = callNode.callee
      if (callee.type == 'MemberExpression') {
        if (callee.object.type == 'Identifier' && callee.property.type == 'Identifier') {
          if (callee.object.name == 'utils' && callee.property.name == 'intl') {
            let strToTranslate = callNode.arguments[0].value
            if (!data[strToTranslate]) {
              if (list.indexOf(strToTranslate) == -1) {
               list.push(strToTranslate)
              }
            }
          }
        }
      }
    }
  })
  if (converted) {
    return resultCode
  }

  return null
}

let handle = bootstrap(convertFile)

handle(srcRoot, [
  {path: sepLine('storage-run-strategy'), ns: 'abc'},
  // {path: sepLine('storage-optimize'), ns: null},
])


list.forEach(item=> {
  console.log(item);
})
