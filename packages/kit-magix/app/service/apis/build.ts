/**
 * 用来本地测试构建结果
 */
import { EventEmitter } from 'events'
import { utils, build as coreBuildCommand } from 'thx-cli-core'
// import * as chalk from 'chalk'
// import * as CloudBuildClient from '@ali/cloudbuild-client'

/**
 * params参数：
 * params.cwd [string] 项目目录
 * params.branch [string] 分支
 */

export default {
  exec (params: any = {}) {
    const emitter = new EventEmitter()
    const cwd = params.cwd || process.cwd()

    setTimeout(async () => {
      if (!await utils.isInAppRoot(cwd)) {
        return emitter.emit('close', {
          error: '请在项目根目录下执行本命令'
        })
      }

      // DEF云构建，构建结构在本地build下
      try {
        await coreBuildCommand({
          cwd,
          branch: params.branch
        }, emitter)
      } catch (error) {
        return emitter.emit('close', {
          error
        })
      }
    }, 0)

    return emitter
  }
}
