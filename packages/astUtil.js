const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')
const template = require('@babel/template').default
const recast = require('recast')

function convertCodeUseAst(code, visitor, filePath) {
  try {
    const ast = recast.parse(code, {
      parser: {
        parse(source) {
          return parser.parse(source, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator'],
            tokens: true
          })
        }
      }
    })
    traverse(ast, visitor)
    return recast.print(ast, {wrapColumn: 180}).code
  } catch (e) {
    console.log(filePath + '  -- parse failure')
    throw e
  }
}

function getAstBody(code) {
  const ast = recast.parse(code, {
    parser: {
      parse(source) {
        return parser.parse(source, {
          sourceType: 'module',
          plugins: ['jsx', 'typescript'],
          tokens: true
        })
      }
    }
  })
  return ast.program.body
}

function restNameAst(name) {
  return t.objectProperty(t.identifier(name), t.identifier(name), false, true)
}

function restObj(keys) {
  return t.objectPattern(keys.map(key => restNameAst(key)))
}

function isModuleImported(rootPath, moduleName, searchType = 'import') {
  let isImported = false
  rootPath.traverse({
    ImportSpecifier(importPath) {
      if (importPath.node.imported.name == moduleName) {
        isImported = true
      }
    },
    ImportDefaultSpecifier(importPath) {
      if (importPath.node.local.name == moduleName) {
        isImported = true
      }
    }
  })
  return isImported
}

function addImportItem(rootPath, importStr) {
  let body = rootPath.node.body
  let index = body.findIndex(statement => statement.type != 'ImportDeclaration')
  body.splice(index, -1, template.ast(importStr))
}

function putObjAst(typeName, payloadExpression) {
  return t.objectExpression([
    t.objectProperty(t.identifier('type'), t.stringLiteral(typeName)),
    t.objectProperty(t.identifier('payload'), payloadExpression),
  ])
}

module.exports = {
  convertCodeUseAst,
  getAstBody,
  restNameAst,
  restObj,
  isModuleImported,
  addImportItem,
  putObjAst,
}
