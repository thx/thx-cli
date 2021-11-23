export default (crossConfigs = []) => {
  return function * combine (next) {
    yield next

    let html = this.body.toString()
    if (html === 'Not Found') {
      throw new Error('路径：' + this.path + ' 对应的文件没有找到')
    }

    // 注入到页面上的js
    const injectJs = `window.crossConfigs = ${JSON.stringify(crossConfigs, null, 2)}`

    html = html.replace('</body>', ` <script>${injectJs}</script> </body>`)
    this.body = html
  }
}
