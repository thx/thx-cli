/**
 * mm dev时注入到页面上的帮助文档
 */
import * as chalk from 'chalk'
import * as moment from 'moment'
import { getInjectJs } from './inject-js'

// MO 这个文件是干什么用的？
// MO 目录 webui 和 web 的区别是什么？

export default (ws, wsPort) => {
  return function * combine (next) {
    yield next

    let body = this.body.toString()
    if (body === 'Not Found') {
      throw new Error('路径：' + this.path + ' 对应的文件没有找到')
    }

    // 先清除监听器
    ws.removeAllListeners('connection')

    // websocket
    ws.addListener('connection', client => {
      console.log(chalk.green('websocket握手成功'))

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
            return console.log(chalk.red(`[WEB_SPRITE] [${moment().format('HH:mm:ss')}] ✘ 接口${data.api}不存在`))
          }

          const params = JSON.stringify(data.params)
          console.log(chalk.green(`[WEB_SPRITE] [${moment().format('HH:mm:ss')}] 接口请求：${data.api}  ${chalk.grey(`参数：${params || '无'}`)}`))

          const resp = await method(data.params)
          client.send(JSON.stringify(resp))
        }
      })
    })

    // 注入到页面上的js
    const injectJs = getInjectJs(wsPort)

    body = body.replace('</body>', `
        <script>${injectJs}</script> 
        </body>`)

    this.body = body
  }
}
