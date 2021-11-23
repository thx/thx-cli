'use strict'
/**
 * mm iconfont
 * --check 比对项目与iconfont平台的icon，列出项目中没有用到的icon
 */
import * as chalk from 'chalk'
import iconfontApi from '../apis/iconfont'

export default async (options) => {
  /**
     * mm iconfont --check 检测项目中的失效icon
     */
  if (options.check) {
    iconfontApi
      .check()
      .on('data', msg => {
        console.log(msg)
      })
      .on('close', resp => {
        if (resp.error) {
          console.log(chalk.red(`x ${resp.error}`))
        }
      })
  }

  /**
    * mm iconfont 同步字体文件配置到项目中
    */
  else {
    iconfontApi
      .exec()
      .on('data', msg => {
        console.log(msg)
      })
      .on('close', resp => {
        if (resp.error) {
          console.log(chalk.red(`x ${resp.error}`))
        }
      })
  }
}
