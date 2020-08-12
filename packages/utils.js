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

function bootstrap(doConvert, getMatch) {
  return function (dir, pathInfo) {
    traverseAndSelect(dir, getMatch ? getMatch(pathInfo) : getDefaultMatch(pathInfo))((code, namespace, filePath) => {
      return doConvert(code, namespace, filePath)
    })
  }
}

const traverseAndSelect = (dir, match) => (callback) => {
  reserveFile(dir, (filePath) => {
    const result = match(filePath)
    if (result) {
      const namespace = result
      const code = fs.readFileSync(filePath).toString()
      let convertedCode = callback(code, namespace, filePath)
      if (convertedCode == null) {
        return
      }
      if (convertedCode != code) {
        fs.writeFileSync(filePath, convertedCode, {})
        // console.log(filePath, '  --converted')
      }
    }
  })
}

function sepLine(dir, sub) {
  return `${path.sep}${dir}${path.sep}${sub || ''}`
}

function getDefaultMatch(pathInfoList) {
  return function (filePath) {
    let list = pathInfoList.filter(item => filePath.indexOf(item.path) != -1)
    if (list.length == 0) {
      return
    }
    if (list.length == 1) {
      return list[0].ns
    } else {
      console.log('多个模式匹配： ' + filePath)
    }
    return null
  }
}

module.exports = {
  reserveFile,
  bootstrap,
  sepLine
}