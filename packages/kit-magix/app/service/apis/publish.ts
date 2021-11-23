
import { EventEmitter } from 'events'
import { utils, publish as corePublishCommand } from '@ali/mm-cli-core'
import util from '../../util/util'
import * as utilCheck from '../../util/check'
import * as chalk from 'chalk'
import spmlogApi from './spmlog'
import { genModuleList, genPreloadModule } from '../../util/preload-module-list'
import * as moment from 'moment'

export default {
  /**
   * params.cwd [string] 项目目录
   * params.branch [string] 要发布的分支
   * params.message [string] 发布会自动提交当前代码的commit信息
   * params.uncheck [boolean] webui使用时请设置为true
   * params.nospm [boolean] 发布前是否执行spm打点，默认为false
   * params.international [boolean] 是否同时发布到国际版cdn，默认为false
   * params.prod [boolean] 是否跳过daily发布直接发布线上，默认为false
   * params.allReviewer [boolean] //是否全选已配置的代码审阅人员
   * params.codeReviewers [string] //直接指定代码审阅人员工号，多工号以逗号分隔
   */
  exec (params: any = {}) {
    const emitter = new EventEmitter()
    const cwd = params.cwd
    const currentBranch = params.branch

    setTimeout(async () => {
      const appPath = await utils.getAppPath(cwd)
      const appPkg = await utils.getAppPkg(appPath)
      const startTime = new Date().getTime()
      if (await utils.isMaster(cwd)) {
        return emitter.emit('close', {
          error: '请在日常分支下执行'
        })
      }

      const magixCliConfig = await util.getMagixCliConfig(cwd)
      // magix5 标识
      const isMagix5 = magixCliConfig.magixVersion === '5'
      const internationalCdn = params.international === undefined ? magixCliConfig.internationalCdn : params.international
      const buildCommand = magixCliConfig.buildCommand === false ? false : (magixCliConfig.buildCommand || 'gulp build')

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
      if (!params.nospm && !params.prod) {
        spmlogApi.exec({ cwd }).on('data', msg => {
          emitter.emit('data', msg)
        }).on('close', resp => {
          if (resp.error) {
            emitter.emit('data', chalk.yellow(`✘ ${resp.error}`))
          }
          run()
        })
      } else {
        run()
      }

      // 主菜
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

        // 如果配置了publishCommand，则直接执行publishCommand配置的命令
        if (magixCliConfig.publishCommand) {
          const commands = magixCliConfig.publishCommand.trim().split(/\s+/)
          if (params.preview) {
            commands.push('--preview')
          }
          await utils.spawnCommand('npx', commands, { cwd })
          return
        }

        // 默认云构建
        if (magixCliConfig.cloudBuild === undefined) {
          magixCliConfig.cloudBuild = true
        }

        /**
         * 项目中buildCommand没有填的话，执行cli内建构建命令
         */
        if (magixCliConfig.buildCommand === undefined) {
          try {
            // DEF云构建发布线上环境
            const options = {
              uncheck: params.uncheck,
              cwd,
              branch: currentBranch,
              message: params.message,
              international: internationalCdn,
              prod: params.prod,
              allReviewer: params.allReviewer,
              codeReviewers: params.codeReviewers || magixCliConfig.codeReviewers
            }
            await corePublishCommand(options, emitter)

            // 计时
            const endTime = new Date().getTime()
            emitter.emit('data', chalk.grey(`[${moment().format('HH:mm:ss')}] 发布过程总耗时：${Math.round((endTime - startTime) / 1000)} 秒`))
          } catch (error) {
            return emitter.emit('close', {
              error: `发布失败：${error}`
            })
          }
        } else {
          // 有buildCommand，并且有cloudBuild:true，则先进行本地build构建，然后进行云构建
          if (magixCliConfig.cloudBuild) {
            // 先本地构建
            emitter.emit(chalk.cyan('🕑 执行项目构建任务，请稍候...'))
            const buildNameSplit = buildCommand.trim().split(/\s+/)
            // 只在gulp命令时生效，其他命令可能会报错，例如grunt
            if (buildNameSplit[0] === 'gulp') {
              // 将父pid传给子进程，以便出错时kill掉进程
              buildNameSplit.push('--pid')
              buildNameSplit.push(process.pid)
            }

            try {
              // DEF云构建发布线上环境
              const options = {
                uncheck: params.uncheck,
                cwd,
                branch: currentBranch,
                message: params.message,
                international: internationalCdn,
                prod: params.prod,
                allReviewer: params.allReviewer,
                codeReviewers: params.codeReviewers || magixCliConfig.codeReviewers
              }
              await corePublishCommand(options, emitter)
            } catch (error) {
              return emitter.emit('close', {
                error: `发布失败：${error}`
              })
            }
          }
        }
      }
    }, 0)

    return emitter
  }
}
