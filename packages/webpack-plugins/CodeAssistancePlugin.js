let fs = require("fs");

class CodeAssistantPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap("CodeAssistantPlugin", (compilation) => {
      compilation.hooks.buildModule.tap("TT", (module) => {
        if (!module.userRequest) {
          return;
        }
        let extensions = [".js", ".ts", ".jsx", "tsx", ".css", ".less", ".scss"];
        let match = extensions.find(ext => module.userRequest.indexOf(ext) !== -1);
        if (!match) {
          return;
        }

        if (module.userRequest.indexOf("node_modules") !== -1) {
          return;
        }
        fs.readFile(module.userRequest, (err, buffer) => {
          if (err) {
            return;
          }
          let code = buffer.toString();
          let codeLine = code.split("\n").length;
          if (codeLine > 300) {
            console.log(`${module.userRequest}, ${codeLine}行，代码行数过长\n`);
          }
        });
      });
    });
  }
}

module.exports = CodeAssistantPlugin;
