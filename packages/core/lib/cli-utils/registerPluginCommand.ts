import { cyan } from 'chalk'
import checkModuleOutdated from './checkModuleOutdated'
import { IPluginInfo } from '../../types'
import { CommanderStatic } from 'commander'
import * as utils from '../utils/index'
import logger from '../logger'
import registerCommand from './registerCommand'
const { MM_HOME } = utils

// const SUB_COMMAND = process.argv[2] // 当前执行的命名名，如 init, dev 等
// 例如 node rmx init react => node bin command kit
const [, , SUB_COMMAND] = process.argv

// 获取插件模块，通过插件本地安装地址。
function getPluginCommandModule(pluginInfo: IPluginInfo) {
  logger.debug(cyan(__filename))
  logger.info('getPluginCommandModule', pluginInfo)
  const { type, name: pluginName, package: packageName } = pluginInfo
  let pluginCommandModule
  try {
    pluginCommandModule = require(`${MM_HOME}/${type}/${pluginName}/node_modules/${packageName}`)
    pluginCommandModule = pluginCommandModule.__esModule
      ? pluginCommandModule.default
      : pluginCommandModule
  } catch (error) {
    logger.error(error)
    // console.error(error)
  }
  return pluginCommandModule
}

// 获取插件命令
async function getPluginCommand(pluginInfo: IPluginInfo) {
  const pluginCommandModule = getPluginCommandModule(pluginInfo)
  if (!pluginCommandModule) return

  const pluginCommand = await pluginCommandModule()
  return pluginCommand
}

// 注册插件命令
// MO TODO => src/commands/registerPluginCommand
export default async function registerPluginCommand(
  program: CommanderStatic,
  pluginInfo: IPluginInfo
) {
  logger.info('registerPluginCommand', pluginInfo)
  const {
    name: pluginName,
    package: packageName,
    command: { command, alias }
  } = pluginInfo
  if (!pluginName || !packageName) return

  // 检测插件是否有新版本
  if (SUB_COMMAND && [pluginName, command, alias].indexOf(SUB_COMMAND) !== -1) {
    await checkModuleOutdated('plugin', pluginName, packageName)
  }

  const pluginCommand = await getPluginCommand(pluginInfo)
  if (pluginCommand) registerCommand(program, pluginCommand) // 移除最后一个参数 pluginName，没有消费场景
}
