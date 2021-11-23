import { CommanderStatic } from 'commander'
import { blueBright, grey, redBright } from 'chalk'
import { EventEmitter } from 'events'
import { utils, publish as corePublishCommand } from '@ali/mm-cli-core'
import logger from '../logger'
import { ICommandConfig } from '@ali/mm-cli-core/types'
const { isMaster, getPrecentBranch } = utils

/**
 * params参数
 * params.cwd [string]
 * params.branch [string] 要发布的分支
 * params.message [string] 发布会自动提交当前代码的commit信息
 * params.uncheck [boolean] webui使用时请设置为true
 * params.international [boolean] 是否同时发布到国际版
 *
 * 新发布流程不允许在master下执行mm publish，详见 https://thx.github.io/magix-cli-book/#/publish
 */
async function commandAction(command: CommanderStatic) {
  if (await isMaster()) {
    return console.log(redBright('✘ 请在日常分支下执行'))
  }

  const emitter = new EventEmitter()
  emitter
    .on('data', chunk => {
      logger.info(chunk)
      console.log(chunk)
    })
    .on('error', error => {
      logger.error(error)
      // console.log(redBright(`✘ 发布失败：${error}`))
    })
    .on('close', code => logger.info(code))

  try {
    await corePublishCommand(
      {
        cwd: process.cwd(),
        branch: await getPrecentBranch(),
        message: command.message,
        international: command.international,
        prod: command.prod,
        allReviewer: command.allReviewer,
        codeReviewers: command.codeReviewers
      },
      emitter
    )
  } catch (error) {
    console.log(redBright(`✘ 发布失败：${error}`))
  }
}

/**
 * 内置的正式发布命令
 */
const commandConfig: ICommandConfig = {
  command: 'publish',
  alias: 'p',
  description:
    '将当前的开发分支发布到线上正式环境(会删除掉当前分支并回到master)',
  options: [
    ['-m, --message <message>', 'commit信息'],
    ['-i, --international', '是否要同时发布到国际版本环境'],
    ['-p, --prod', '是否绕过daily直接发布线上环境'],
    ['-a, --all-reviewer', '是否全选已配置的代码审阅人员'],
    [
      '-c, --code-reviewers <reviews>',
      '直接指定代码审阅人员工号，多工号以逗号分隔'
    ]
  ],
  async action(command: CommanderStatic) {
    return commandAction(command)
  },
  on: [
    [
      '--help',
      () => {
        console.log('\nExamples:')
        console.log(`  ${grey('$')} ${blueBright('mm publish')}`)
      }
    ]
  ]
}

export default commandConfig
