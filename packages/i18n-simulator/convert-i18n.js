const path = require('path')
const t = require('@babel/types')
const {convertCodeUseAst, addImportItem, isModuleImported} = require('../astUtil')
const {bootstrap, sepLine} = require('../utils')
const {srcRoot, projectRoot} = require('../constants')
const zh = require('./zh')

function convertFile(code, namespace, filePath) {
  if (filePath.indexOf('.ts') == -1 && filePath.indexOf('.tsx') == -1) {
    return
  }
  if (filePath.indexOf('graph.helper.ts') != -1) {
    return
  }
  if (filePath.indexOf('i18n') != -1) {
    return
  }
  let converted = false
  let resultCode = convertCodeUseAst(code, {
    Program(rootPath) {
      rootPath.traverse({
        JSXText(textPath) {
          let value = textPath.node.value
          let value1 = value.replace(/[\r|\n| ]/g, '')
          if (value1) {
            if (value1.match(/[\u4e00-\u9fa5]/)) {
              let result = replacePath(textPath, value1, filePath)
              converted = converted || result
            }
          }
        },
        StringLiteral(stringPath) {
          let node = stringPath.node
          let value = node.value
          if (value && value.match(/[\u4e00-\u9fa5]/)) {
            let d = replacePath(stringPath, value, filePath)
            converted = converted || d
          }
        }
      })
      if (converted) {
        let isImported = isModuleImported(rootPath, 'intl')
        if (!isImported) {
          let relativePath = path.relative(filePath, path.join(srcRoot, 'utils/commonUtil')).replace(/\\/g, '/').substring(3)
          addImportItem(rootPath, `import {intl} from '${relativePath}'`)
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
  {path: sepLine('components'), ns: 'empty'},
  {path: sepLine('container'), ns: 'empty'},
  {path: sepLine('core'), ns: 'empty'},
])

function replacePath(path, value, filePath) {
  let last = value.substring(value.length - 1)
  let parent = path.parent
  if (parent.type == 'CallExpression') {
    return false
  }
  if (last == ':' || last == '：') {
    value = value.substring(0, value.length - 1)
  } else {
    last = ''
  }
  let key = Object.keys(zh).find(k => zh[k] == value)
  if (!key) {
    console.log(`未找到对应的key：${value}   ${filePath}`)
    return false
  } else {
    // console.log(key)
  }
  if (path.type == 'JSXText') {
    path.replaceWithMultiple([
      t.jsxExpressionContainer(
        t.callExpression(t.identifier('intl'), [t.stringLiteral(key)])
      ),
      t.jsxText(last + '\n')
    ])
  } else if (parent.type == 'JSXAttribute') {
    path.replaceWith(
      t.jsxExpressionContainer(
        t.callExpression(t.identifier('intl'), [t.stringLiteral(key)])
      )
    )
  } else {
    path.replaceWith(
      t.callExpression(t.identifier('intl'), [t.stringLiteral(key)])
    )
  }
  return true
}
