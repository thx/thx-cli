/**
 * 安装dependencies包，并同步到项目中
 */
import * as chalk from 'chalk'
import { sync as syncApi } from 'thx-magix-scripts'
//
export default async options => {
  syncApi
    .exec({
      pkgManager: 'npm',
      args: ['install']
    })
    .on('data', msg => {
      console.log(msg)
    })
    .on('close', resp => {
      if (resp.error) {
        console.log(chalk.red(`✘ ${resp.error}`))
      }
    })
}
