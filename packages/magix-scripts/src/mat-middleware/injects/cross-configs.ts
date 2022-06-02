export default (crossConfigs = []) => {
  return function* combine(next) {
    yield next

    let html = this.body.toString()
    if (html === 'Not Found') {
      throw new Error('路径：' + this.path + ' 对应的文件没有找到')
    }

    // 注入到页面上的js
    const injectJs = `window.crossConfigs = ${JSON.stringify(
      crossConfigs,
      null,
      2
    )}`

    // 固定放在boot.js前面
    html = html.replace(
      /(<script.+id\s*=\s*['"]boot['"][^>]*>\s*<\/script>)/,
      `<script>${injectJs}</script>\n$1`
    )
    this.body = html
  }
}
