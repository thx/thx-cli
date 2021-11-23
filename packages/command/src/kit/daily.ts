import { CommanderStatic } from 'commander'
import { blueBright, grey, redBright } from 'chalk'
import { EventEmitter } from 'events'
import { utils, daily as coreDailyCommand } from '@ali/mm-cli-core'
import logger from '../logger'
import { ICommandConfig } from '@ali/mm-cli-core/types'
const { isMaster, getPrecentBranch } = utils

/**
 * 依赖 DEF 云构建，需要项目里有 abc.json
 */
async function commandAction (command: CommanderStatic) {
  if (await isMaster()) {
    return console.log(redBright('✘ 请在日常分支下执行'))
  }

  const emitter = new EventEmitter()
  emitter
    .on('data', (chunk) => {
      logger.info(chunk)
      console.log(chunk)
    })
    .on('error', (error) => {
      logger.error(error)
      // console.log(redBright(`✘ 发布失败：${error}`))
    })
    .on('close', (code) => logger.info(code))

  try {
    await coreDailyCommand({
      cwd: process.cwd(),
      branch: await getPrecentBranch(),
      message: command.message,
      env: {}
    }, emitter)
  } catch (error) {
    console.log(redBright(`✘ 发布失败：${error}`))
  }
}

/**
 * 内置的日常发布命令
 */
const commandConfig: ICommandConfig = {
  command: 'daily',
  alias: 'd',
  description: '将当前分支发布到日常环境',
  options: [
    ['-m, --message <message>', 'commit信息']
  ],
  // 必须为异步方法
  async action (command: CommanderStatic) {
    return commandAction(command)
  },
  on: [
    ['--help', () => {
      console.log('\nExamples:')
      console.log(`  ${grey('$')} ${blueBright('mm daily')}`)
      console.log()
    }]
  ]
}

export default commandConfig
