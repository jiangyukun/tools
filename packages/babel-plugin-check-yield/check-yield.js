const t = require('@babel/types')
// const generator = require('@babel/generator').default


function checkYield(api, options) {
  return {
    visitor: {
      CallExpression(path) {

      }
    }
  }
}

module.exports = checkYield
