
import { utils, daily as coreDailyCommand } from '@ali/mm-cli-core'
import { cyan, grey, redBright, yellow } from 'chalk'
import util from '../../util/util'
import * as utilCheck from '../../util/check'
import { EventEmitter } from 'events'
import spmlogApi from './spmlog'
import logger from '../../logger'
import { genModuleList, genPreloadModule } from '../../util/preload-module-list'
import * as moment from 'moment'

//
export default {
  /**
     * params.cwd [string] 项目目录
     * params.branch [string] 要发布的分支
     * params.message [string] 发布会自动提交当前代码的commit信息
     * params.uncheck [boolean] webui使用时请设置为true
     * params.nospm [boolean] 发布前是否执行spm打点，默认为false
     */
  exec (params: any = {}) {
    const emitter = new EventEmitter()
    const cwd = params.cwd
    const currentBranch = params.branch

    setTimeout(async () => {
      const appPath = await utils.getAppPath(cwd)
      const appPkg = await utils.getAppPkg(appPath)
      const startTime = new Date().getTime()
      const magixCliConfig = await util.getMagixCliConfig(cwd)
      // magix5 标识
      const isMagix5 = magixCliConfig.magixVersion === '5'

      if (await utils.isMaster(cwd)) {
        return emitter.emit('close', {
          error: ' 请在日常分支下执行'
        })
      }

      // 版本不一致给出提示，中止发布，提供一键升级套件
      if (magixCliConfig.buildCommand === undefined) {
        const checkBuilder = await utilCheck.checkBuilder(isMagix5)
        if (!checkBuilder.isMatch) {
          await utilCheck.checkBuilderUpdateTips(checkBuilder.unmatchPkg)
          return emitter.emit('close', {})
        }
      }

      // 如果项目有 dependencies 则执行 mm sync 同步包到项目中(基于 snowpack)
      if (appPkg.dependencies && Object.keys(appPkg.dependencies).length) {
        // 然后 magix-combine 解析包路径到 snowpack 生成的包路径里
        await utils.spawnDowngradeSudo('mm', ['sync'])
      }

      // 先打点spmlog
      if (!params.nospm) {
        spmlogApi.exec({ cwd }).on('data', msg => {
          emitter.emit('data', msg)
        }).on('close', resp => {
          if (typeof resp === 'object') {
            logger.debug(__filename)
            logger.warn(redBright('@deprecated 请不要在 close 事件中返回一个对象'), resp)
          }

          if (resp.error) {
            emitter.emit('data', yellow(`✘ ${resp.error}`))
          }
          run()
        })
      } else {
        run()
      }

      //
      async function run () {
        if (magixCliConfig.preloadModuleList) {
          // 遍历项目生成所有模块list，配合项目代码用于预加载资源
          await utils.withSpinner(
            'generate module list',
            async () => {
              await Promise.all([genModuleList(), genPreloadModule()])
            },
            err => {
              emitter.emit('error', err)
            }
          )()
        }

        //
        const buildCommand = magixCliConfig.buildCommand === false ? false : (magixCliConfig.buildCommand || 'gulp build')

        // 默认云构建
        if (magixCliConfig.cloudBuild === undefined) {
          magixCliConfig.cloudBuild = true
        }

        // 如果配置了dailyCommand，则直接执行dailyCommand配置的命令
        if (magixCliConfig.dailyCommand) {
          utils.spawnCommand('npx', magixCliConfig.dailyCommand.trim().split(/\s+/), { cwd })
          return emitter.emit('close', {})
        }

        /**
         * 项目中buildCommand没有填的话，执行cli内建构建命令
         */
        if (magixCliConfig.buildCommand === undefined) {
          try {
            // 云构建
            await coreDailyCommand({
              cwd,
              branch: currentBranch,
              message: params.message,
              uncheck: params.uncheck
            }, emitter)

            // 计时
            const endTime = new Date().getTime()
            emitter.emit('data', grey(`[${moment().format('HH:mm:ss')}] 发布过程总耗时：${Math.round((endTime - startTime) / 1000)} 秒`))
            return
          } catch (error) {
            return emitter.emit('close', {
              error: `发布失败：${error}`
            })
          }
        } else {
          // 有buildCommand，并且有cloudBuild:true，则先进行本地build构建，然后进行云构建
          if (magixCliConfig.cloudBuild) {
            // 先本地构建
            emitter.emit(cyan('🕑 执行项目构建任务，请稍候...'))
            const buildNameSplit = buildCommand.trim().split(/\s+/)
            // 只在gulp命令时生效，其他命令可能会报错，例如grunt
            if (buildNameSplit[0] === 'gulp') {
              // 将父pid传给子进程，以便出错时kill掉进程
              buildNameSplit.push('--pid')
              buildNameSplit.push(process.pid)
            }

            // 利用npx运行gulp build之类的命令，可以避免全局安装gulp工具
            await utils.spawnCommand('npx', buildNameSplit, { cwd })
            await coreDailyCommand({
              cwd,
              branch: currentBranch,
              message: params.message,
              uncheck: params.uncheck
            }, emitter)
          }
        }
      }
    }, 0)

    return emitter
  }
}
