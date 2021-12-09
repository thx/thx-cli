/**
 * mm dev时注入到页面上的环境变量
 */

import * as minimist from 'minimist'
const argv = minimist(process.argv.slice(2))

export default () => {
  return function* combine(next) {
    yield next

    let html = this.body.toString()
    if (html === 'Not Found') {
      throw new Error('路径：' + this.path + ' 对应的文件没有找到')
    }
    // 注入到页面上的js
    const injectJs = `
            ${argv.d ? 'window.__isDaily__ = true;' : ''}
            ${argv.o ? 'window.__isOnline__ = true;' : ''}
            ${!argv.o && !argv.d ? 'window.__isRap__ = true;' : ''}`

    html = html.replace('<head>', `<head> <script>${injectJs}</script>`)
    this.body = html
  }
}
