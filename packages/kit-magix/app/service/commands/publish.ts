'use strict'

import { utils } from '@ali/mm-cli-core'
import * as chalk from 'chalk'
import publishApi from '../apis/publish'
import util from '../../util/util'

//
export default async (options) => {
  const branch = await utils.getPrecentBranch()
  const magixCliConfig = await util.getMagixCliConfig()

  // 命令行里没有--nospm的话， 读取magixCliConfig.noSpmlog配置
  const nospm = options.nospm === undefined ? magixCliConfig.noSpmlog : options.nospm

  publishApi.exec({
    branch,
    message: options.message,
    uncheck: false,
    nospm,
    international: options.international,
    prod: options.prod,
    allReviewer: options.allReviewer,
    codeReviewers: options.codeReviewers
  }).on('data', msg => {
    console.log(msg)
  }).on('close', resp => {
    if (resp && resp.error) {
      console.log(chalk.red(`✘ ${resp.error}`))
    } else {
      // mm publish 完成后的钩子，可以执行一次自定义任务
      if (magixCliConfig.publishCompleted) {
        console.log('执行自定义 publishCompleted 钩子命令...')
        const commandSplit = magixCliConfig.publishCompleted.split(/\s+/)
        const command = commandSplit.shift()
        utils.spawnCommand(command, commandSplit)
      }
    }
  }).on('error', error => {
    console.log(chalk.red(`✘ ${error}`))
  })
}
