import { ICommandConfig } from '@ali/mm-cli-core/types'
import { CommanderStatic } from 'commander'
import { utils } from '@ali/mm-cli-core'
import logger from '../logger'
const { checkSudo } = utils

function isDefined (program: CommanderStatic, commandConfig: ICommandConfig) {
  for (const cmd of program.commands) {
    if (cmd._name === commandConfig.command) {
      return true
    }
  }
  return false
}

/**
 * 配置 commander 命令
 * @param program commander 实例
 * @param commandConfig 当前命令配置
 * @param ~~name~~ 套件或插件名称（废弃）
 * 参数 name 没有消费场景，废弃
 */
export default function registerCommand (program: CommanderStatic, commandConfig: ICommandConfig) {
  // 配置的额外参数，命令执行前后的钩子函数
  const { params = {}, before, after } = commandConfig

  // 如果命令重复了，则以原来定义的为主，不再重复定义
  if (isDefined(program, commandConfig)) {
    logger.warn('忽略发现重复定义的命令', commandConfig)
    console.warn('忽略发现重复定义的命令', commandConfig)
    return
  }

  // 命令名称
  const subcommand = program.command(commandConfig.command || commandConfig.name)
  // 命令别名
  if (commandConfig.alias) subcommand.alias(commandConfig.alias)
  // 命令描述
  if (commandConfig.description) subcommand.description(commandConfig.description)
  // 命令参数
  if (commandConfig.options) {
    commandConfig.options.forEach(option => {
      const [flags, description, ...extra] = option
      subcommand.option(flags, description, ...extra)
    })
  }
  // 命令响应函数
  // action 必填
  // MO 支持动态参数，例如直接执行 mm init react
  subcommand.action(async (...argv) => {
    const start = Date.now()

    // 默认允许 sudo 执行。如果配置了 disableSudo:true，不允许。
    if (params.disableSudo) checkSudo()

    // 命令前勾子
    if (before) {
      try {
        const beforeResult = await before(...argv)
        if (beforeResult === false) return
      } catch (error) {
        console.error(error)
        return
      }
    }
    // 命令主函数
    const actionResult = commandConfig.action && await commandConfig.action(...argv, params)

    // 命令后勾子
    if (after) await after(...argv, actionResult)

    logger.debug(`⌚️ The execution of command '${commandConfig.name || commandConfig.command}' took ${Date.now() - start}ms`)
  })

  // 命令 option 监听函数（通常用于注册帮助信息）
  if (commandConfig.on) {
    commandConfig.on.forEach(item => {
      try {
        const [event, listener] = item
        subcommand.on(event, listener)
      } catch (error) {
        console.error(error)
        logger.error(commandConfig, error)
      }
    })
  }
}
