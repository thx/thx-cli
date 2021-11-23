'use strict'
/**
 * 同步chartPark的图表配置信息到项目中
 */
import * as chalk from 'chalk'
import chartparkApi from '../apis/chartpark'

export default async (options) => {
  chartparkApi
    .exec()
    .on('data', msg => {
      console.log(msg)
    })
    .on('close', resp => {
      if (resp.error) {
        console.log(chalk.red(`✘ ${resp.error}`))
      }
    })
}
