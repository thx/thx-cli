/**
 * 安装dependencies包，并同步到项目中
 */
import syncApi from './sync'
// import { utils } from 'thx-cli-core'
// const { IS_OPEN_SOURCE } = utils

//
export default () => {
  return new Promise((resolve, reject) => {
    const syncApiEmitter = syncApi.exec({
      // pkgManager: IS_OPEN_SOURCE ? 'npm' : 'tnpm',
      // args: ['install'],
      cwd: process.cwd()
    })

    function dataCallback(msg) {
      console.log(msg)
    }

    function closeCallback(resp) {
      if (resp.error) {
        reject(resp.error)
      } else {
        resolve(null)
      }

      // 移除监听器
      syncApiEmitter.removeAllListeners()
    }

    syncApiEmitter.on('data', dataCallback).on('close', closeCallback)
  })
}
