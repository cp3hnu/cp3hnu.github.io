const { path } = require("@vuepress/shared-utils");

module.exports = (options = {}, ctx) => ({
  define: {
    selector: options.selector || 'div[class*="language-"]',
    align: options.align || "top",
    color: options.color || "#ffffff",
    backgroundColor: options.backgroundColor || "#000000",
    backgroundTransition: options.backgroundTransition !== false,
    successText: options.successText || "已复制!",
    isHover: options.isHover || true
  },
  enhanceAppFiles: [path.resolve(__dirname, "appFile.js")],
  clientRootMixin: path.resolve(__dirname, "clientRootMixin.js")
});
