/**
 * rmx install 卸载套件或组件
 * 先选择套件还是插件
 * 然后列出本地已经安装的套件/插件
 * 最后选择删除
 */

import { uninstall as coreUninstallCommand, utils } from '@ali/mm-cli-core'
import * as inquirer from 'inquirer' // A collection of common interactive command line user interfaces.
import { blueBright, grey, yellowBright } from 'chalk'
import { CommanderStatic } from 'commander'
import { IModuleType, IKitInfo, IPluginInfo, ICommandConfig } from '@ali/mm-cli-core/types'
import { prepareTypeQuestionList, prepareModuleQuestionList } from './install'
import { EventEmitter } from 'events'
import logger from '../logger'
const { MODULE_TYPE_MAP } = utils

async function uninstallModule (type: IModuleType, module: IKitInfo | IPluginInfo) {
  const emitter = new EventEmitter()
  emitter
    .on('data', (message) => logger.info(message))
    .on('error', (error) => logger.error(error))
    .on('close', (code) => logger.info(code))
  coreUninstallCommand(emitter, {
    type,
    module,
    link: process.env.MM_MODE === 'development'
  })
}

async function commandAction (type: IModuleType | undefined, name: string | undefined, command: CommanderStatic) {
  // 类型：套件 | 插件
  if (type === undefined) {
    const answers = await inquirer.prompt(prepareTypeQuestionList(type))
    type = answers.type
  }

  // 本地已经安装的模块（套件或插件）列表
  const installedModuleList = await utils.getInstalledModuleList(type)
  if (!installedModuleList.length) {
    const message = yellowBright(`ⓘ 尚未安装${MODULE_TYPE_MAP[type]} ${name || ''}`)
    logger.warn(message)
    console.log(message)
    return
  }

  // 指定卸载的模块（套件或插件）
  let module: IKitInfo | IPluginInfo
  if (name === undefined) {
    const installedModuleQuestionList = await prepareModuleQuestionList(type, installedModuleList)
    const installedModuleAnswers = await inquirer.prompt(installedModuleQuestionList)
    module = installedModuleAnswers.module
  } else {
    module = installedModuleList.find(module => module.package === name || module.name === name)
  }
  if (name && !module) {
    const message = yellowBright(`ⓘ 尚未安装${MODULE_TYPE_MAP[type]} ${name}`)
    logger.warn(message)
    console.log(message)
    return
  }

  // 执行模块卸载
  await uninstallModule(type, module)
}

const commandConfig: ICommandConfig = {
  name: 'uninstall',
  command: 'uninstall [kit|plugin] [name]',
  alias: 'uni',
  description: '卸载套件和插件',
  // 必须为异步方法
  async action (type: IModuleType, name: string, command: CommanderStatic) {
    await commandAction(type, name, command)
  },
  on: [
    ['--help', () => {
      console.log('\nExamples:')
      console.log(`  ${grey('$')} ${blueBright('mm uninstall')}`)
    }]
  ]
}

export default commandConfig
