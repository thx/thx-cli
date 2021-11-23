const path = require('path')
const WebSocket = require('ws')

/**
 * 分析js,打包view
 */
export default function (combineTool, ws, cwd) {
  const _cwd = cwd || process.cwd()

  return function * combine (next) {
    yield next

    let body
    try {
      body = this.body.toString()
    } catch (error) { }

    if (body === 'Not Found' || !body) {
      throw new Error('路径：' + this.path + ' 对应的文件没有找到')
    }

    try {
      body = yield combineTool.processContent(path.join(_cwd, this.path), '', body)
    } catch (err) {
      // 多窗口多客户端同时发送信息
      ws.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            message: `[MXC ERROR: ] ${err.message} - from ${this.path}`,
            type: 'error'
          }))
        }
      })
    }

    this.body = body.content
  }
}
