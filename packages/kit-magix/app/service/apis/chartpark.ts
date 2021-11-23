/**
 * 同步chartPark的图表配置信息到项目中
 */
import util from '../../util/util'
import * as chalk from 'chalk'
import { EventEmitter } from 'events'
import { chartpark } from '@ali/mm-cli-core'

export default {
  /**
     * params.cwd [string] 项目根目录
     */
  exec (params: any = {}) {
    const cwd = params.cwd
    const emitter = new EventEmitter()

    setTimeout(async () => {
      const magixCliConfig = await util.getMagixCliConfig(cwd)
      const chartParkId = magixCliConfig.chartParkId
      const chartUrl = await chartpark.getOptions(chartParkId, msg => {
        emitter.emit('data', msg)
      })

      if (!chartUrl) {
        return emitter.emit('close', {})
      }

      emitter.emit('data', chalk.green('♨ 开始同步chartpark图表配置，请稍候...'))
      const loadingTips = 'chartpark配置'
      const configPathKey = 'chartParkIndexPath'
      try {
        await util.generateLocalConfig({
          loadingTips,
          api: `https://${chartUrl}`,
          defaultConfigTmplPath: '../tmpl/chartpark-index.js', // 默认生成config文件的模板的地址
          // defaultConfigPath: 'src/app/chartpark/index.js',//默认生成的config文件存放在项目中的路径
          configTmplKey: 'chartParkIndexTmpl', // magixCliConfig中的相关模板路径配置的key值
          configPathKey, // magixCliConfig中的相关生成路径配置的key值
          magixCliConfig,
          cwd
        })
        emitter.emit('data', chalk.green(`✔ ${loadingTips} ${chalk.cyan(magixCliConfig[configPathKey])} 创建完毕`))
        return emitter.emit('close', {})
      } catch (error) {
        return emitter.emit('close', {
          error
        })
      }
    }, 0)

    return emitter
  }
}
