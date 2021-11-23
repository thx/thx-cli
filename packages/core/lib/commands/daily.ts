
/**
 * 依赖 DEF 的云构建，需要项目里有 abc.json
 */
import { EventEmitter } from 'events'
import { release, getProjectInfo } from '../platforms/def'

import { blueBright, greenBright, grey } from 'chalk'
import * as moment from 'moment'
import { checkMasterUpdate } from '../utils/git'

async function dailyDeploy ({ cwd, branch }, emitter) {
  try {
    // 检测本地包版本与线上 builder 版本一致，则执行云构建
    await release({
      publishBranch: branch,
      publishType: 'daily',
      internationalCdn: null,
      isCheck: null,
      log (message: string) {
        emitter.emit('data', message)
      },
      cwd
    })
  } catch (error) {
    emitter.emit('error', error)
    emitter.emit('close', 1)
    throw error
  }
}

export async function prepare ({ cwd, branch, uncheck = false, message }, emitter) {
  await checkMasterUpdate({
    log (...args: Array<any>) {
      emitter.emit('data', ...args)
    },
    cwd,
    branch,
    uncheck,
    message,
    verify: false
  })
}

export interface IDailyParams {
  /** 应用目录 */
  cwd: string,
  /** 当前分支 */
  branch: string,
  /** 自动提交代码时的 commit message */
  message?: string,
  /** 收集的环境变量，用于修改 abc.json */
  env?: {
    PAGE?: string,
    ANALYZE?: boolean | number
  },
  /** MO TODO 干什么用呢 */
  uncheck?: boolean,
  /** MO TODO 其他 */
  [key: string]: any
}

/**
 * params 参数
 * params.cwd [string]
 * params.branch [string] 要发布的分支
 * params.message [string] 发布会自动提交当前代码的 commit 信息
 * params.uncheck [boolean] webui 使用时请设置为 true
 */
export default async function daily (params: IDailyParams, emitter: EventEmitter) {
  const { cwd, branch, uncheck, message, env = {} } = params

  try {
    const { repoName } = await getProjectInfo(cwd)
    const version = branch.replace(/.+\//, '')

    await prepare({ cwd, branch, uncheck, message }, emitter)
    emitter.emit('data',
      `${blueBright('ⓘ [MM CLI]')} [${moment().format('HH:mm:ss')}] 开始发布到日常环境`
    )
    await dailyDeploy({ cwd, branch }, emitter)
    emitter.emit('data',
      `${greenBright(`✔ [MM CLI] [${moment().format('HH:mm:ss')}] 日常环境发布成功，版本号`)} ${blueBright(version)}`
    )
    emitter.emit('data',
    `${grey(`[${moment().format('HH:mm:ss')}] 资源已发布到 https://dev.g.alicdn.com/${repoName}/${version}/ 目录下`)}`
    )

    emitter.emit('close', 0)
  } catch (error) {
    emitter.emit('error', error)
    emitter.emit('close', 1)
    throw error
  }
}
