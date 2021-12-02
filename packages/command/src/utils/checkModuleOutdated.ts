import { grey, greenBright, yellowBright, blueBright } from 'chalk'
import { utils } from 'thx-cli-core'
import * as inquirer from 'inquirer'
import { installModule as sysInstallModule } from '../system/install'
import { IModuleInfo } from 'thx-cli-core/types'
import * as minimist from 'minimist'
import { needBlockProcessByModuleOutdated } from 'thx-cli-core/dist/utils'
const argv = minimist(process.argv.slice(2))
const { checkUpdateModule, getModuleList } = utils

/**
 * 检测套件/插件更新
 * @param type
 * @param name
 * @param pkgName
 */
export default async function checkModuleOutdated (type: 'kit' | 'plugin', name: string, pkgName: string) {
  // --skip-update-check跳过检测
  if (argv['skip-update-check']) {
    return
  }

  const result = await checkUpdateModule(type, name, pkgName)
  if (result === false) return

  const versionDiffInfo = `（${grey('本地版本：')}${result.localPkg.version}${grey('，最新版本：')}${greenBright(result.latestPkg.version)}）`
  if (!needBlockProcessByModuleOutdated(pkgName)) {
    const message = {
      kit: `检测到当前套件 ${blueBright(name)} 有新版本，请运行 ${blueBright('mm install')} 更新 ${versionDiffInfo}`,
      plugin: `检测到该插件有新版本，请运行 ${blueBright('mm install')} 更新 ${versionDiffInfo}`
    }[type]
    console.log(`⚠️  ${yellowBright(message)}\n`)
    return
  }

  // MO FIXED 问题常量，代码实现不清晰
  const questions = [{
    type: 'confirm',
    name: 'isUpdate',
    message: {
      kit: `检测到当前套件 ${yellowBright(name)} 有新版本，要更新吗 ${versionDiffInfo}？`,
      plugin: `检测到该插件有新版本，要更新吗 ${versionDiffInfo}？`
    }[type]
  }]

  const answer = await inquirer.prompt(questions)
  if (answer.isUpdate === false) return

  const { kits, plugins } = await getModuleList()
  const modules: Array<IModuleInfo> = { kit: kits, plugin: plugins }[type]
  const module = modules.find((module: IModuleInfo) => module.name === name)

  await sysInstallModule(type, module)
}
