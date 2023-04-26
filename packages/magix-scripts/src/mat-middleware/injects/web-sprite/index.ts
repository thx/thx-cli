/**
 * mm dev时注入到页面上的帮助文档
 */
import * as chalk from 'chalk'
import { getInjectJs } from './inject-js'
import { utils } from 'thx-cli-core'
import { WEB_SPRITE_NAME } from '../../constant'

export default (ws, wsPort) => {
  return function* combine(next) {
    yield next

    let body = this.body.toString()
    if (body === 'Not Found') {
      throw new Error('路径：' + this.path + ' 对应的文件没有找到')
    }

    // 先清除监听器
    ws.removeAllListeners('connection')

    // websocket
    ws.addListener('connection', client => {
      utils.printSuccess('websocket握手成功', WEB_SPRITE_NAME)

      // 先清除
      client.removeAllListeners('message')

      // 来自webui的websocket接口处理
      client.addListener('message', async msg => {
        const data = JSON.parse(msg)

        if (data.type === 'webSprite') {
          let method
          try {
            method = require(`./apis/${data.api}`)
            method = method.__esModule ? method.default : method
          } catch (error) {
            return utils.printError(`接口${data.api}不存在`, WEB_SPRITE_NAME)
          }

          utils.printInfo(
            `接口请求：${data.api} ${chalk.grey(
              `参数：${JSON.stringify(data.params) || '无'}`
            )}`,
            WEB_SPRITE_NAME
          )

          const resp = await method(data.params)
          client.send(JSON.stringify(resp))
        }
      })
    })

    // 注入到页面上的js
    const injectJs = getInjectJs(wsPort)

    body = body.replace(
      '</body>',
      `
        <script>${injectJs}</script> 
        </body>`
    )

    this.body = body
  }
}
