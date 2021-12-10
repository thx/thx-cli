/**
 * 简单的本地静态文件服务器
 * rmx dev -p <port>: 指定服务器的端口号
 */

import { ICommandConfig } from 'thx-cli-core/types'
import { blueBright, greenBright, grey } from 'chalk'
import { CommanderStatic } from 'commander'
import * as Koa from 'koa'
import * as koaStatic from 'koa-static'
const app = new Koa()

async function commandAction(command: CommanderStatic) {
  const port = command.port
  const home = koaStatic(process.cwd())
  // 3.分配路由（MO TODO 3？）
  app.use(home)
  app.listen(port)

  console.log(greenBright('✔ 启动本地静态文件服务'))
  console.log(`${grey('请访问：')}${blueBright(`http://localhost:${port}`)}`)
}

/**
 * 内置的 dev 本地开发服务
 */
const commandConfig: ICommandConfig = {
  command: 'dev',
  description: '启动本地开发服务',
  options: [['-p, --port <port>', '本地服务端口', 3000]],
  async action(command: CommanderStatic) {
    return commandAction(command)
  },
  on: [
    [
      '--help',
      () => {
        console.log('\nExamples:')
        console.log(`  ${grey('$')} ${blueBright('mm dev')}`)
        console.log()
      }
    ]
  ]
}

export default commandConfig
