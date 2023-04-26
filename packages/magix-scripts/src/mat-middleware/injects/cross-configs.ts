import { utils } from 'thx-cli-core'

export default isRap => {
  return function* combine(next) {
    yield next

    let html = this.body.toString()
    if (html === 'Not Found') {
      throw new Error('路径：' + this.path + ' 对应的文件没有找到')
    }

    const appPath = utils.getAppPath()
    const pkg = utils.getAppPkg(appPath)
    const magixCliConfig = pkg.magixCliConfig || {}
    // mm dev 用 crossConfigsRap， 其他用 crossConfigs
    const crossConfigs = isRap
      ? magixCliConfig.crossConfigsRap ?? magixCliConfig.crossConfigs // 没有crossConfigsRap兼容使用 crossConfigs
      : magixCliConfig.crossConfigs

    // 注入到页面上的js
    const injectJs = `window.crossConfigs = ${JSON.stringify(
      crossConfigs,
      null,
      2
    )}`

    // 固定放在入口js文件前面（id="boot"的js文件）
    html = html.replace(
      /(<script.+id\s*=\s*['"]boot['"][^>]*>\s*<\/script>)/,
      `<script>${injectJs}</script>\n$1`
    )
    this.body = html
  }
}
