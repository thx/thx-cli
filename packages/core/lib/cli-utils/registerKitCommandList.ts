import checkModuleOutdated from './checkModuleOutdated'
import {
  ICommandConfig,
  IKitInfo,
  ICommandList,
  ICommandMap
} from '../../types'
import { CommanderStatic } from 'commander'
import * as utils from '../utils/index'
import logger from '../logger'
import registerCommand from './registerCommand'
const { MM_HOME } = utils

// const SUB_COMMAND = process.argv[2] // 当前执行的命名名，如 init, dev 等
// 例如 node rmx init react => node bin command kit
const [, , SUB_COMMAND] = process.argv

// 获取套件模块，通过套件本地安装地址。
function getKitCommandListModule(kitInfo: IKitInfo) {
  const { type = 'kit', name: kitName, package: packageName } = kitInfo
  let kitCommandListModule
  try {
    utils.took(
      'getKitCommandListModule',
      () => {
        try {
          kitCommandListModule = require(`${MM_HOME}/${type}/${kitName}/node_modules/${packageName}/dist/commands`)
        } catch (error) {
          logger.error(error)
          console.error(error)
        }
      },
      logger
    )

    kitCommandListModule = kitCommandListModule.__esModule
      ? kitCommandListModule.default
      : kitCommandListModule
  } catch (error) {
    logger.error(error)
    console.error(error)
  }
  return kitCommandListModule
}

// 获取套件命令列表
async function getKitCommandList(kitInfo: IKitInfo): Promise<ICommandList> {
  const kitCommandListModule = getKitCommandListModule(kitInfo)
  if (!kitCommandListModule) return

  const kitCommandList = await kitCommandListModule()
  return kitCommandList
}

function isSystemCommand(
  kitCommandConfig: ICommandConfig,
  systemCommandList
): boolean {
  const kitCommandName = kitCommandConfig.name || kitCommandConfig.command
  const existed = !!systemCommandList.find(
    ({ name, command, alias }) =>
      [name, command, alias].indexOf(kitCommandName) !== -1
  )
  return existed
}

// 注册套件命令
// 返回 [boolean]: 当前命令是否是套件里的命令
// MO TODO => src/commands/registerKitCommandList
export default async function registerKitCommandList(
  program: CommanderStatic,
  kitInfo: IKitInfo,
  systemCommandList,
  defaultKitCommandList
) {
  const defaultKitCommandMap: ICommandMap = {}
  defaultKitCommandList.forEach(item => {
    defaultKitCommandMap[item.name || item.command] = item
  })

  logger.info('registerKitCommandList', kitInfo)
  const { name: kitName, package: packageName } = kitInfo
  if (!kitName || !packageName) return
  let isKitCommand = false

  // if (kitName && packageName) {
  // 检测套件更新
  await checkModuleOutdated('kit', kitName, packageName)

  // 获取套件命令列表，合并套件默认命令和自定义命令的配置。
  const kitCommandList: ICommandList = await getKitCommandList(kitInfo)
  if (!kitCommandList) return
  const mergedKitCommandMap: ICommandMap = { ...defaultKitCommandMap }
  kitCommandList.forEach(kitCommandConfig => {
    mergedKitCommandMap[kitCommandConfig.name || kitCommandConfig.command] = {
      ...mergedKitCommandMap[kitCommandConfig.name || kitCommandConfig.command],
      ...kitCommandConfig
    }
  })
  // 遍历套件命令列表，逐个注册。
  Object.values(mergedKitCommandMap).forEach(kitCommandConfig => {
    // 如果套件命令与系统命令重名，则忽略套件命令，避免污染系统命令。
    if (isSystemCommand(kitCommandConfig, systemCommandList)) {
      return
    }

    // 允许套件禁用某个默认命令
    if (kitCommandConfig.disabled) {
      return
    }

    registerCommand(program, kitCommandConfig) // 移除最后一个参数 kitName，没有消费场景

    // 判断是否是套件命令
    const { name, command, alias } = kitCommandConfig
    if (SUB_COMMAND && [name, command, alias].indexOf(SUB_COMMAND) !== -1) {
      isKitCommand = true
    }
  })

  return isKitCommand
}
