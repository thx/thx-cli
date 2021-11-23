import { install as coreInstallCommand, utils } from '@ali/mm-cli-core'
import { IModuleType, IKitInfo, IPluginInfo, IKitMap, IPluginMap, ICommandConfig, IModuleInfo } from '@ali/mm-cli-core/types'
import { EventEmitter } from 'events'
import * as inquirer from 'inquirer'
import * as fse from 'fs-extra' // A collection of common interactive command line user interfaces.
import { CommanderStatic } from 'commander'
import { grey, green, white, blueBright } from 'chalk'
import logger from '../logger'
const { RMX_HOME, getLength, fixLength, MODULE_TYPE_LIST, MODULE_TYPE_MAP } = utils

export function prepareTypeQuestionList (type: IModuleType) {
  return [
    {
      type: 'list',
      name: 'type',
      message: '请选择类型', // 请选择要安装（或更新）的类型，类型 => 模块
      choices: MODULE_TYPE_LIST.map(item => ({
        name: `${fixLength(item.title, 10)} ${grey(item.description)}`,
        value: item.name,
        short: item.title
      })),
      when: type === undefined
    }
  ]
}

export async function prepareModuleQuestionList (type: IModuleType, modules: Array<IKitInfo | IPluginInfo>) {
  const moduleDir = `${RMX_HOME}/${type}`
  // 本地已经安装的套件或插件
  const installedModuleList = await utils.getInstalledModuleList(type)
  const installedModuleMap: IKitMap | IPluginMap = installedModuleList.reduce((acc, cur) => {
    acc[cur.name] = cur
    return acc
  }, {})
  const maxNameLength = Math.max(...modules.map(module => getLength(module.name)), 10)
  const maxPackageLength = Math.max(...modules.map(module => getLength(module.package)), 10)
  const moduleChoiceList: Array<any> = modules.map(module => {
    // 找出本地安装的套件，打上已安装的标识
    const installedModule = installedModuleMap[module.name]
    const exist = fse.pathExistsSync(`${moduleDir}/${module.name}/node_modules/${module.package}`)
    const fixedName = (installedModule && exist)
      ? `${fixLength(module.name, maxNameLength)}  ${fixLength(module.package, maxPackageLength)}  ${green('已安装')}${grey('（本地版本')} ${white(installedModule.version)}${grey('，最新版本')} ${green(installedModule.latest)}${grey('）')} ${grey(module.description)}`
      : `${fixLength(module.name, maxNameLength)}  ${fixLength(module.package, maxPackageLength)}  ${grey(module.description)}`
    return {
      name: fixedName,
      value: module,
      short: module.name
    }
  })

  // name: `${module.name}: ${grey(module.description)}`,
  return [
    {
      type: 'list',
      name: 'module',
      message: `请选择${MODULE_TYPE_MAP[type]}`,
      choices: moduleChoiceList
    }
  ]
}

/** 安装某个套件或插件 */
export async function installModule (type: 'kit' | 'plugin' /* IModuleType */, module: IModuleInfo | IKitInfo | IPluginInfo, command?: CommanderStatic) {
  const emitter = new EventEmitter()
  emitter
    .on('data', (message) => logger.info(message))
    .on('error', (error) => logger.error(error))
    .on('close', (code) => logger.info(code))
  await coreInstallCommand(emitter, {
    type,
    module,
    link: command?.link || process.env.MM_MODE === 'development'
  })
}

async function commandAction (type: IModuleType | undefined, name: string | undefined, command: CommanderStatic) {
  // 类型：套件 | 插件
  if (type === undefined) {
    const answers = await inquirer.prompt(prepareTypeQuestionList(type))
    type = answers.type
  }

  // 模块：套件 | 插件
  let module: IKitInfo | IPluginInfo
  const { kits, plugins } = await utils.getModuleList()
  const modules:Array<IKitInfo | IPluginInfo> = { kit: kits, plugin: plugins }[type]
  if (name === undefined) {
    const moduleQuestionList = await prepareModuleQuestionList(type, modules)
    const answers = await inquirer.prompt(moduleQuestionList)
    module = answers.module
  } else {
    module = modules.find(module => module.package === name || module.name === name)
  }

  if (!module) throw new Error(`未知的套件或插件 ${name}`)

  // 执行模块安装
  await installModule(type, module, command)
}

// MO TODO 支持 mm link，用于本地开发套件和插件。
const commandConfig: ICommandConfig = {
  name: 'install',
  command: 'install [kit|plugin] [name]',
  alias: 'i',
  options: [
    ['--link', '以链接方式安装']
  ],
  description: '安装（或更新）套件和插件',
  async action (type: IModuleType, name: string, command: CommanderStatic) {
    await commandAction(type, name, command)
  },
  on: [
    ['--help', () => {
      console.log('\nExamples:')
      console.log(`  ${grey('$')} ${blueBright('mm install')}`)
    }]
  ]
}

export default commandConfig
