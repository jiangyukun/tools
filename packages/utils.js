const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const recast = require('recast')

function convertCodeUseAst(code, visitor, filePath) {
  try {
    const ast = recast.parse(code, {
      parser: {
        parse(source) {
          return parser.parse(source, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript', 'classProperties', 'optionalChaining'],
            tokens: true
          })
        }
      }
    })
    traverse(ast, visitor)
  } catch (e) {
    console.log(filePath + '  -- parse failure')
    throw e
  }
}

module.exports = {
  convertCodeUseAst
}