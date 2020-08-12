const path = require('path')
const t = require('@babel/types')
const {convertCodeUseAst, addImportItem, isModuleImported} = require('../astUtil')
const {bootstrap, sepLine} = require('../utils')
const {srcRoot, projectRoot} = require('../constants')

function replacePath(path, value) {
  let last = value.substring(value.length - 1)
  let parent = path.parent
  if (parent.type == 'CallExpression') {
    return false
  }
  if (path.type == 'JSXText') {
    if (last == ':' || last == '：') {
      let prefix = value.substring(0, value.length - 1)
      path.replaceWithMultiple([
        t.jsxExpressionContainer(
          t.callExpression(t.memberExpression(t.identifier('utils'), t.identifier('intl')), [t.stringLiteral(prefix)])
        ),
        t.jsxText(last)
      ])
    } else {
      path.replaceWith(
        t.jsxExpressionContainer(
          t.callExpression(t.memberExpression(t.identifier('utils'), t.identifier('intl')), [t.stringLiteral(value)])
        )
      )
    }
  } else {
    if (parent.type == 'JSXAttribute') {
      path.replaceWith(
        t.jsxExpressionContainer(
          t.callExpression(t.memberExpression(t.identifier('utils'), t.identifier('intl')), [t.stringLiteral(value)])
        )
      )
    } else {
      path.replaceWith(
        t.callExpression(t.memberExpression(t.identifier('utils'), t.identifier('intl')), [t.stringLiteral(value)])
      )
    }
  }
  return true
}

function convertFile(code, namespace, filePath) {
  if (filePath.indexOf('.ts') == -1 && filePath.indexOf('.tsx') == -1) {
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
              let result = replacePath(textPath, value1)
              converted = converted || result
            }
          }
        },
        StringLiteral(stringPath) {
          let node = stringPath.node
          let value = node.value
          if (value && value.match(/[\u4e00-\u9fa5]/)) {
            let d = replacePath(stringPath, value)
            converted = converted || d
          }
        }
      })
      if (converted) {
        let isImported = isModuleImported(rootPath, 'utils')
        if (!isImported) {
          let relativePath = path.relative(filePath, path.join(projectRoot, 'src/public/js/utils')).replace(/\\/g, '/').substring(3)
          addImportItem(rootPath, `\nimport utils from '${relativePath}'`)
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
  {path: sepLine('statistical-form', 'station-form'), ns: 'empty'},
])
