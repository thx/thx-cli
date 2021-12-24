import * as fse from 'fs-extra'
import { utils } from 'thx-cli-core'
import { EventEmitter } from 'events'
import { ICreateAppInfo } from 'thx-cli-core/types'
import { util } from 'thx-magix-scripts'
import { blueBright, cyanBright, grey } from 'chalk'

const { execCommand, withSpinner, CLI_NAME } = utils
const { replace: replaceUtil } = util

export default async (appInfo, emitter) => {
  const { snapshoot = {}, cwd, app } = appInfo
  const appPath = `${cwd}/${app}`
  const pkgPath = `${appPath}/package.json`
  const pkg = await fse.readJSON(pkgPath)

  /**
   * 初始化项目后，进行全文件的项目名称的替换，目前只支持zs_scaffold脚手架
   */

  if (snapshoot?.scaffoldInfo?.replaceable) {
    await withSpinner(
      '开始进行脚手架的项目全局项目名称替换',
      async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
        await replaceUtil.adjustProject(appInfo)
      }
    )(emitter, appInfo)
  }

  // initCompleted配置：允许 mm init 完执行一些自定义的命令
  if (pkg.magixCliConfig.initCompleted) {
    await execCommand(pkg.magixCliConfig.initCompleted, { cwd: appPath })
  }

  console.log(`\n应用 ${cyanBright(app)} 创建成功！你可以执行以下命令：\n`)
  console.log(`  ${grey('●')} ${blueBright(`cd ${app}`)}`)
  console.log(
    `  ${grey('●')} ${blueBright(`${CLI_NAME} dev`)}      ${grey(
      '启动本地开发服务'
    )}`
  )
  console.log(
    `  ${grey('●')} ${blueBright(`${CLI_NAME} build`)}      ${grey(
      '本地构建项目'
    )}`
  )

  console.log(
    `  ${grey('●')} ${blueBright(`${CLI_NAME} -h`)}       ${grey(
      '查看所有命令帮助'
    )}`
  )
  console.log('')
}
