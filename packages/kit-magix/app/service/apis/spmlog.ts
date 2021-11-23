/**
 * 执行spmlog打点
 */
import util from '../../util/util'
import { utils } from '@ali/mm-cli-core'
import * as chalk from 'chalk'
import * as combineTool from 'magix-combine'
import * as path from 'path'
import { EventEmitter } from 'events'
import * as magixCombineToolConfig from '@ali/magix-combine-tool-config'
import * as crypto from 'crypto'

export default {
  /**
     * params.cwd [string] 项目根目录
     * params.removeSpm [boolean] removeSpm为true则进行清除打点
     */
  exec (params: any = {}) {
    const emitter = new EventEmitter()

    setTimeout(async () => {
      const cwd = params.cwd
      const magixCliConfig = await util.getMagixCliConfig(cwd)
      const magixCombineConfig = magixCliConfig.magixCombineConfig || {}
      const combineToolConfig = await magixCombineToolConfig(magixCliConfig, magixCombineConfig, cwd)
      const spmCommand = magixCliConfig.spmCommand || 'gulp spmlog'
      const spmCommands = spmCommand.trim().split(/\s+/)
      const spmFolder = magixCliConfig.spmFolder || 'src/app/views'
      const rootPath = await utils.getAppPath(cwd)
      const spmFolderAbs = path.resolve(rootPath, spmFolder) // 最终绝对路径
      const fromMap = {}

      //
      combineToolConfig.tmplSnippetInScript = magixCombineConfig.tmplSnippetInScript === undefined ? true : magixCombineConfig.tmplSnippetInScript
      combineToolConfig.tmplFolder = spmFolderAbs

      // mm spmlog -r 删除所有spm打点
      if (params.removeSpm) {
        emitter.emit('data', chalk.green('ⓘ 开始清除spm打点'))
        const oldspmReg = /\sdata-spm-click\s*=\s*(['"])[^'"]+?locaid=([^'"]+)\1/g
        const oldspmcReg = /\s(?:data-spm-exp\s+)?data-spm\s*=\s*(['"])[^'"]+?\1/g
        combineToolConfig.tmplTagProcessor = (tag, from) => {
          if (!fromMap[from]) {
            emitter.emit('data', `${chalk.green('[spmlog file]')} ${chalk.cyan(from)}`)
          }
          fromMap[from] = true

          tag = tag.replace(oldspmReg, (m, q, id) => {
            return ''
          }).replace(oldspmcReg, '')
          return tag
        }

        combineTool.config(combineToolConfig)

        await combineTool.processTmpl()
        emitter.emit('data', chalk.green('✔ spm打点清除完毕'))
      } else {
        // spma是必填
        if (!magixCliConfig.spma) {
          return emitter.emit('close', {
            error: '检测到package.json的magixCliConfig.spma尚未配置，无法执行spm埋点'
          })
        }

        emitter.emit('data', chalk.green('ⓘ 开始进行spm打点'))

        // mm spmlog会执行spm打点，同时同步数据小站的配置到本地
        // 兼容老的方式，执行项目中的gulp spmlog任务
        if (magixCliConfig.spmCommand) {
          await utils.spawnCommand('npx', spmCommands)
        } else {
          // 新的方式spmlog收敛到cli工具内部，不再在项目中的gulpfile里配置

          const spmCache = Object.create(null)
          const oldspmReg = /\sdata-spm-click\s*=\s*(['"])[^'"]+?locaid=([^'"]+)\1/g
          const getRandom = () => {
            const buf = crypto.randomBytes(16)
            return buf.toString('hex').slice(0, 8)
          }

          // magixCliConfig.spmPropertyMatch 可配置自定义的属性进行spmlog打点
          let spmPropertyMatch = magixCliConfig.spmPropertyMatch
          if (typeof spmPropertyMatch === 'string') {
            spmPropertyMatch = [spmPropertyMatch]
          } else if (spmPropertyMatch === undefined) {
            spmPropertyMatch = []
          }

          const customSpmPropertyMatch = spmPropertyMatch.length
            ? spmPropertyMatch.join('|') + '|'
            : ''

          const setSpmRules = new RegExp(`[\\s\\u0007](?:${customSpmPropertyMatch}mx-mouseover|mx-dragstart|mx-drop|mx-click|mx-change|mx-keyup|mx-keydown|mx-mousedown|mx-spm-ph|href="|mx-view="${magixCliConfig.rootAppName || 'app'}/gallery)`)
          const setSpmcRules = new RegExp('(?:<mx-vframe|[\\s\\u0007]mx-view|[\\s\\u0007]mx-spmc|[\\s\\u0007]mx-header|[\\s\\u0007]mx-footer)')
          const selfClose = /\/>\s*$/g

          combineToolConfig.tmplTagProcessor = (tag, from) => {
            if (!fromMap[from]) {
              emitter.emit('data', `${chalk.green('[spmlog file]')} ${chalk.cyan(from)}`)
            }
            fromMap[from] = true

            // 自动纠正项目中重复的key,如果不需要则删除该逻辑
            tag = tag.replace(oldspmReg, (m, q, id) => {
              if (!spmCache[id]) {
                spmCache[id] = from
                return m
              } else {
                emitter.emit('data', 'duplicate ', m, from, 'prev', spmCache[id])
                return ''
              }
            })
            // spmd段
            if (tag.indexOf('data-spm-click') === -1 && setSpmRules.test(tag)) {
              let id = getRandom()
              while (spmCache[id]) id = getRandom() // 防止重复
              spmCache[id] = from
              selfClose.lastIndex = 0
              const sc = selfClose.test(tag)
              return tag.slice(0, sc ? -2 : -1) + ` data-spm-click="gostr=/${magixCliConfig.logkey};locaid=d${id}"${sc ? '/' : ''}>`
            }
            // spmc段
            if (!/data-spm=/.test(tag) && setSpmcRules.test(tag)) {
              let id = getRandom()
              while (spmCache[id]) id = getRandom() // 防止重复
              spmCache[id] = from
              selfClose.lastIndex = 0
              const sc = selfClose.test(tag)
              return tag.slice(0, sc ? -2 : -1) + ` data-spm="c${id}"${sc ? '/' : ''}>`
            }
            return tag
          }

          combineTool.config(combineToolConfig)

          await combineTool.processTmpl()
          emitter.emit('data', chalk.green('✔ spm打点完毕'))

          /**
                     * 执行同步数据小站的数据到项目中
                     */
          emitter.emit('data', chalk.green('♨ 开始同步数据小站配置，请稍候...'))
          const loadingTips = '数据小站配置'
          const configPathKey = 'dataPlusConfigPath'
          try {
            const _params = {
              spma: magixCliConfig.spma
            }
            await util.generateLocalConfig({
              loadingTips,
              api: `https://fether.m.taobao.com/analytics/getScaffold?params=${encodeURIComponent(JSON.stringify(_params))}`,
              // api: `https://data.alimama.net/api/spmb-config/scaffold.json?spma=${magixCliConfig.spma}`,
              defaultConfigTmplPath: '../tmpl/dataplus-config.js', // 默认生成config文件的模板的地址
              // defaultConfigPath: 'src/app/dataplus/config.js',//默认生成的config文件存放在项目中的路径
              configTmplKey: 'dataPlusConfigTmpl', // magixCliConfig中的相关模板路径配置的key值
              configPathKey, // magixCliConfig中的相关生成路径配置的key值
              magixCliConfig,
              cwd
            })

            emitter.emit('data', chalk.green(`✔ ${loadingTips} ${chalk.cyan(magixCliConfig[configPathKey])} 创建完毕`))
          } catch (error) {
            emitter.emit('data', chalk.yellow(error))
          }
        }
      }

      return emitter.emit('close', {})
    }, 0)

    return emitter
  }
}
