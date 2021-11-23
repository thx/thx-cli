
/**
 * 用来本地测试构建结果
 */
import { CommanderStatic } from 'commander'
import { EventEmitter } from 'events'
import { utils, build as coreBuildCommand } from '@ali/mm-cli-core'
import logger from '../logger'
import { ICommandConfig } from '@ali/mm-cli-core/types'
const { getPrecentBranch } = utils

async function commandAction (command: CommanderStatic) {
  const cwd = process.cwd()
  const branch = await getPrecentBranch()

  const emitter = new EventEmitter()
  emitter
    .on('data', (chunk) => logger.info(chunk))
    .on('error', (error) => logger.error(error))
    .on('close', (code) => logger.info(code))

  await coreBuildCommand({ cwd, branch }, emitter)
}

/**
 * 内置的本地构建命令
 * 用的是 def 的云端构建，依赖项目中的 abc.json 配置
 */
const commandConfig: ICommandConfig = {
  command: 'build',
  description: '在本地执行云构建，并下载构建结果到本地。', // 本地构建
  // 必须为异步方法
  async action (command: CommanderStatic) {
    return await commandAction(command)
  }
}

export default commandConfig
