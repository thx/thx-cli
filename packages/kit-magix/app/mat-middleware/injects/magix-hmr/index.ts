import * as portfinder from 'portfinder'
import * as fs from 'fs'
import * as chalk from 'chalk'
import * as path from 'path'
import * as WebSocket from 'ws'
import hmrjsfn from './hmr'
import * as chokidar from 'chokidar'

export default ({
  customLog = console.log,
  cwd = process.cwd(),
  // 热更新监听的文件
  watchFiles = [
    'src/**/*.js',
    'src/**/*.ts',
    'src/**/*.mx',
    'src/**/*.css',
    'src/**/*.html',
    'src/**/*.scss',
    'src/**/*.less'
  ],
  // 全局的样式，必须触发全页刷新
  scopedCss,
  rootAppName = 'app', // 默认的项目app目录名
  // 可以固定websocket的端口号，不自动生成
  wsPort,
  combineTool,
  host = '127.0.0.1',
  isMagix5 = false // 是否是新 magix5
}, ws) => {
  let watcher

  if (wsPort) {
    watcher = startServer()
  } else {
    // 获取一个未被占用的端口
    portfinder.getPort((err, _wsPort) => {
      wsPort = _wsPort
      watcher = startServer()
    })
  }

  function startServer () {
    if (!ws) {
      ws = new WebSocket.Server({
        port: wsPort
      })
    }

    customLog(chalk.green('[HMR] 服务已启动'))
    const watcher = chokidar.watch(watchFiles)

    watcher.on('change', (_filePath) => {
      let filePath = path.resolve(cwd, _filePath)
      customLog(`[HMR] ${chalk.green('file changed')} ${chalk.cyan(filePath)}`)

      /**
             * 针对less/scss文件可以指定它所被import的父级文件，以实现热更新
             * 样式文件中注释表明被引用的来源文件
             * 注释写法:
             *   @dependent: ./index.less
             */
      const supportStyles = /(:?\.css|\.less|\.sass|\.scss)/
      if (supportStyles.test(path.extname(filePath))) {
        const styleContent = fs.readFileSync(filePath, 'utf8')
        const exec = /\/\*\s*@dependent\s*:\s*([^;\s]+)\s*;?\s*\*\//.exec(styleContent) // 注释形式 '/*...*/'
        const exec2 = /\/\/\s*@dependent\s*:\s*([^;\s]+);?/.exec(styleContent) // 注释形式 '//'

        if (exec && exec[1]) {
          filePath = path.resolve(path.dirname(filePath), exec[1])
        } else if (exec2 && exec2[1]) {
          filePath = path.resolve(path.dirname(filePath), exec2[1])
        }
      }

      const pathObjs = {
        originPath: filePath,
        depsPaths: [],
        isReload: false // 强制直接刷新页面的标识
      }

      if (combineTool.removeCache) {
        combineTool.removeCache(filePath)
      }

      // HMR 热更新只针对 views 目录下的文件生效，其他则全页刷新
      if (!filePath.includes(`${rootAppName}/src/${rootAppName}/views/`)) {
        pathObjs.isReload = true
      }

      // combine-tool-config 里配置的 scopedCss 特殊处理，直接全页刷新，不再HMR
      if (scopedCss && scopedCss.length) {
        scopedCss.forEach((cssPath) => {
          if (path.relative(filePath, cssPath) === '') {
            pathObjs.isReload = true
          }
        })
      }

      function resolvePath2View (_path) {
        const rexp = new RegExp(`.+(${rootAppName}\/[^\.]+)(?:\.[^\.]+)?`)
        const parse = rexp.exec(_path)
        return parse && parse[1]
      }

      // less/html等文件找到最终依赖viewjs
      // js文件即是本身
      const extname = path.extname(filePath)
      let depsPaths = []
      const supportJs = ['.js', '.ts', '.es']
      if (supportJs.indexOf(extname) > -1) {
        depsPaths = [resolvePath2View(filePath)]
      } else {
        const deps = combineTool.getFileDependents(filePath)
        for (const k in deps) {
          depsPaths.push(resolvePath2View(k))
        }
      }

      // const originPathResolve = `${combineTool.config().projectName}_${resolvePath2View(filePath).replace(/\//g, '_')}_`
      const originPathResolve = combineTool.getStyleFileUniqueKey(filePath)

      Object.assign(pathObjs, {
        originPathResolve,
        depsPaths
      })

      // 多窗口多客户端同时发送信息
      ws.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(pathObjs))
        }
      })
    })

    return watcher
  }

  const returnComb = function * combine (next) {
    yield next
    let body = this.body.toString()
    if (body == 'Not Found') {
      throw new Error('路径：' + this.path + ' 对应的文件没有找到')
    }

    // 浏览器端的websocket代码
    host = host.replace(/^https?:\/\//, '')
    const hmrJs = hmrjsfn(wsPort, host, isMagix5)

    // 插入热更新所需要的js文件
    body = body.replace('</body>', `
            <script>${hmrJs}</script>
            </body>
        `)
    this.body = body
  }
  returnComb.watcher = watcher
  return returnComb
}
