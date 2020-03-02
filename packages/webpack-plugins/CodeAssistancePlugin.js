let fs = require('fs')

let { convertCodeUseAst } = require('../utils')

class CodeAssistantPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('CodeAssistantPlugin', (compilation) => {
      this.checkLine(compilation)
      this.checkYield(compilation)
    })
  }

  checkYield(compilation) {
    compilation.hooks.buildModule.tap('CheckYield', (module) => {
      if (!module.userRequest) {
        return
      }
      let extensions = ['.js', '.ts']

      const moduleName = module.userRequest

      if (moduleName.indexOf('node_modules') !== -1) {
        return
      }
      let match = extensions.find(ext => moduleName.indexOf(ext) !== -1)
      if (!match) {
        return
      }
      if (moduleName.indexOf('model') == -1) {
        return
      }

      fs.readFile(moduleName, (err, buffer) => {
        if (err) {
          return
        }
        let code = buffer.toString()
        convertCodeUseAst(code, {
          FunctionDeclaration(path) {
            if (path.node.generator) {
              path.traverse({
                CallExpression(path) {
                  const node = path.node
                  const callee = node.callee
                  if (callee.name == 'put') {
                    if (path.parent.type != 'YieldExpression') {
                      // throw Error('put没有添加yield')
                      compilation.warnings.push('put没有添加yield')
                    }
                  }
                }
              })
            }
          }
        }, module.userRequest)
      })
    })
  }

  checkLine(compilation) {
    compilation.hooks.buildModule.tap('TT', (module) => {
      if (!module.userRequest) {
        return
      }
      let extensions = ['.js', '.ts', '.jsx', 'tsx', '.css', '.less', '.scss']
      let match = extensions.find(ext => module.userRequest.indexOf(ext) !== -1)
      if (!match) {
        return
      }

      if (module.userRequest.indexOf('node_modules') !== -1) {
        return
      }
      fs.readFile(module.userRequest, (err, buffer) => {
        if (err) {
          return
        }
        let code = buffer.toString()
        let codeLine = code.split('\n').length
        if (codeLine > 300) {
          compilation.warnings.push(`${module.userRequest}, ${codeLine}行，代码行数过长\n`)
          // console.log(`${module.userRequest}, ${codeLine}行，代码行数过长\n`)
        }
      })
    })
  }
}

module.exports = CodeAssistantPlugin
