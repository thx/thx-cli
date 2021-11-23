'use strict'
/**
 * 执行spmlog打点
 */
import * as chalk from 'chalk'
import spmlogApi from '../apis/spmlog'

export default async (options) => {
  spmlogApi.exec({
    removeSpm: options.removeSpm
  }).on('data', msg => {
    console.log(msg)
  }).on('close', resp => {
    if (resp.error) {
      console.log(chalk.red(`✘ ${resp.error}`))
    }
  })
}
