const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const recast = require('recast')

function reserveFile(dir, callback) {
  let list = fs.readdirSync(dir)
  list.forEach(function (fileName) {
    let filePath = path.join(dir, fileName)
    let stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      // 递归子文件夹
      reserveFile(filePath, callback)
    } else {
      callback(filePath)
    }
  })
}

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
  convertCodeUseAst,
  reserveFile
}