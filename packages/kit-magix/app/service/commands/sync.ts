/**
 * 安装dependencies包，并同步到项目中
 */
import * as chalk from 'chalk'
import syncApi from '../apis/sync'
//
export default async (options) => {
  syncApi.exec({}).on('data', msg => {
    console.log(msg)
  }).on('close', resp => {
    if (resp.error) {
      console.log(chalk.red(`✘ ${resp.error}`))
    }
  })
}
