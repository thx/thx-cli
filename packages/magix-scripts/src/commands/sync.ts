/**
 * 安装dependencies包，并同步到项目中
 */
import * as chalk from 'chalk'
import { EventEmitter } from 'events'
import * as sn from 'thx-snowpack-v1'
import { utils } from 'thx-cli-core'
import * as path from 'path'

//@ts-ignore
const { withSpinner } = utils

/**
 * params参数：
 * params.cwd [string] 项目目录
 * params.pkgManager [string] 包管理器：npm|tnpm
 * params.args [array]
 */

export default {
  exec(
    params: any = {
      cwd: process.cwd()
      // pkgManager: 'npm',
      // args: ['install']
    }
  ) {
    const emitter = new EventEmitter()

    setTimeout(async () => {
      const appPath = await utils.getAppPath(params.cwd)
      const pkg = await utils.getAppPkg(appPath)
      const { magixCliConfig = {} } = pkg
      const rootAppName = magixCliConfig.rootAppName ?? pkg.name

      // snowpack 同步包到项目中的目录地址，默认在 web_modules 下
      const { snowpackModulesDest = `src/${rootAppName}/web_modules` } =
        magixCliConfig

      const snowpackConfig = {
        webDependencies: [],
        installOptions: { dest: snowpackModulesDest }
      }

      if (!pkg.dependencies || !Object.keys(pkg.dependencies).length) {
        emitter.emit(
          'data',
          chalk.yellowBright('ⓘ 没有检测到项目的 dependencies 依赖包')
        )
        emitter.emit('close', {})
        return
      }

      // 先安装依赖包
      // @deprecated 不再每次dev时自动安装包，项目依赖的包应先手动 npm install 进来
      // await withSpinner('安装依赖包', async () => {
      //   const rootUser = process.env.USER
      //   process.env.USER = '' // tnpm install 需要判断 USER 不为 root
      //   await utils.spawnDowngradeSudo(params.pkgManager, params.args)
      //   process.env.USER = rootUser
      // })()

      for (const pkgName in pkg.dependencies) {
        snowpackConfig.webDependencies.push(pkgName)
      }

      await withSpinner(
        '同步依赖包到项目中',
        async () => {
          await sn.cli(process.argv, snowpackConfig)
        },
        error => {
          emitter.emit('close', {
            error
          })
        }
      )()

      try {
        const moduleDest = path.resolve(appPath, snowpackModulesDest)
        // 降权生成的文件
        await utils.chmod777(moduleDest)
      } catch (error) {
        console.log(error)
      }

      emitter.emit(
        'data',
        chalk.greenBright(
          `✔ 依赖包已经同步到目录 ${chalk.cyanBright(
            `${snowpackConfig.installOptions.dest}`
          )} 下`
        )
      )
      emitter.emit('close', {})
    }, 0)

    return emitter
  }
}
