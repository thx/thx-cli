import { blueBright, grey, redBright } from 'chalk'
import { CommanderStatic } from 'commander'
import start from '@ali/mm-cli-server'
import { utils } from 'thx-cli-core'
import logger from '../logger'
import { ICommandConfig } from 'thx-cli-core/types'
const { RMX_HOST, RMX_PORT, portIsOccupied, killPort } = utils

async function commandAction (command?: CommanderStatic) {
  const port = command.port || RMX_PORT
  try {
    // 检测端口是否可用
    const occupied = await portIsOccupied(port)
    if (occupied) await killPort(port)
    // 启动服务，打开本地工作台界面
    await start(port)
  } catch (error) {
    logger.error(error)
    console.log(redBright(`✘ 已经启动本地研发工作台，请访问 http://${RMX_HOST}:${port}`))
    console.log(`或者执行 lsof -i tcp:${RMX_PORT} 查看端口占用情况`)
  }
}

// MO TODO 自动注入预览页面，是否更好？
const commandConfig: ICommandConfig = {
  command: 'web',
  options: [
    [
      '-p, --port <port>',
      '本地服务端口',
      (value: string) => {
        return parseInt(value)
      },
      6868
    ]
  ],
  description: '启动本地研发工作台',
  async action (command: CommanderStatic) {
    await commandAction(command)
  },
  on: [
    ['--help', () => {
      console.log('\nExamples:')
      console.log(`  ${grey('$')} ${blueBright('mm web')}`)
    }]
  ]
}

export default commandConfig
