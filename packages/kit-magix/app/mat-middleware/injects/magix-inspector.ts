/**
 * mm dev时注入到页面上的环境变量
 */
import * as fse from 'fs-extra'
import * as path from 'path'
export default () => {
  return function * combine (next) {
    yield next

    let html = this.body.toString()
    if (html === 'Not Found') {
      throw new Error('路径：' + this.path + ' 对应的文件没有找到')
    }

    const inspectorJs = fse.readFileSync(path.resolve(__dirname, '../../libs/magix-inspector.js'), 'utf8')

    html = html.replace('</body>', `<script>${inspectorJs}</script> </body>`)
    this.body = html
  }
}
