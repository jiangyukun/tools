let fs = require('fs')

let { convertCodeUseAst } = require('../utils')

const callNames = ['call', 'put' , 'select', 'take', 'fork', 'updateState', 'updateQuery', 'getState']

class CodeAssistantPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('CodeAssistantPlugin', (compilation) => {
      this.checkLine(compilation)
      this.checkYield(compilation)
    })
  }

  checkYield(compilation) {
    const checkModuleYield = (module) => {
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
          ObjectMethod(path) {
            if (path.node.generator) {
              path.traverse({
                CallExpression(path) {
                  const node = path.node
                  const callee = node.callee
                  if (callNames.some(item=> item == callee.name)) {
                    if (path.parent.type != 'YieldExpression') {
                      compilation.warnings.push(new Error(`${callee.name}没有添加yield, ${moduleName}`))
                    }
                  }
                }
              })
            }
          }
        }, module.userRequest)
      })
    }
    compilation.hooks.buildModule.tap('CheckYield', checkModuleYield)
    compilation.hooks.rebuildModule.tap('CheckYield', checkModuleYield)
  }

  checkLine(compilation) {
    const checkModuleLine = (module) => {
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
          compilation.warnings.push(new Error(`${module.userRequest}, ${codeLine}行，代码行数过长\n`))
        }
      })
    }
    compilation.hooks.buildModule.tap('TT', checkModuleLine)
    compilation.hooks.rebuildModule.tap('TT', checkModuleLine)
  }

}

module.exports = CodeAssistantPlugin
