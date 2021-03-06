import { yellowBright } from 'chalk'
import { IKitInfo, IPluginInfo } from '../../types'
import * as utils from '../utils/index'
import * as fse from 'fs-extra'
import logger from '../logger'
import { EventEmitter } from 'events'
import * as inquirer from 'inquirer' // A collection of common interactive command line user interfaces.
import { install as coreInstallCommand } from '../commands/index'
// import { installModule as sysInstallModule } from '../system/install'
const { MM_HOME } = utils

/**
 * 判断安装套件/插件
 * moduleInfo.name：包的名称，如: magix
 * moduleInfo.value: 包名，如: @ali/mm-kit-magix
 * type: 套件：kit, 插件：plugin
 */
export default async function checkModuleMissed(
  type: 'kit' | 'plugin',
  moduleInfo: IKitInfo | IPluginInfo
) {
  const { name: moduleName, package: modulePackageName } = moduleInfo

  // 套件(插件)安装地址
  const modulePath = `${MM_HOME}/${type}/${moduleName}`
  const moduleRealPath = `${modulePath}/node_modules/${modulePackageName}`

  if (await fse.pathExists(moduleRealPath)) return

  // 判断套件(插件)是否安装，没有的先安装套件(插件)
  const questions = [
    {
      type: 'confirm',
      name: 'install',
      message: {
        kit: `检测到依赖的套件 ${yellowBright(
          moduleName
        )} 尚未安装，要安装吗？`,
        plugin: `检测到该命令依赖的插件 ${yellowBright(
          moduleName
        )} 尚未安装，要安装吗？`
      }[type]
    }
  ]

  const answer = await inquirer.prompt(questions)
  if (!answer.install) {
    return process.exit(0)
  }

  // await sysInstallModule(type, moduleInfo)

  /** 安装某个套件或插件 */
  const emitter = new EventEmitter()
  emitter
    .on('data', message => logger.info(message))
    .on('error', error => logger.error(error))
    .on('close', code => logger.info(code))
  await coreInstallCommand(emitter, {
    type,
    module: moduleInfo
  })
}
