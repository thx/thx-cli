
import { utils } from 'thx-cli-core'
import * as chalk from 'chalk'
import dailyApi from '../apis/daily'
import util from '../../util/util'

//
export default async (options) => {
  const branch = await utils.getPrecentBranch()
  const magixCliConfig = await util.getMagixCliConfig()

  // 命令行里没有--nospm的话， 读取magixCliConfig.noSpmlog配置
  const nospm = options.nospm === undefined ? magixCliConfig.noSpmlog : options.nospm

  dailyApi.exec({
    branch,
    message: options.message,
    uncheck: false,
    nospm
  }).on('data', msg => {
    console.log(msg)
  }).on('close', resp => {
    if (resp && resp.error) {
      console.log(chalk.red(`✘ ${resp.error}`))
    } else {
      // mm daily 完成后的钩子，可以执行一次自定义任务
      if (magixCliConfig.dailyCompleted) {
        console.log('执行自定义 dailyCompleted 钩子命令...')
        const commandSplit = magixCliConfig.dailyCompleted.split(/\s+/)
        const command = commandSplit.shift()
        utils.spawnCommand(command, commandSplit)
      }
    }
  }).on('error', error => {
    console.log(chalk.red(`✘ ${error}`))
  })
}
