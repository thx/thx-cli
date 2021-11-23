/**
 * 用来本地测试构建结果
 */
import { join } from 'path'
import { green } from 'chalk'
import { EventEmitter } from 'events'
import { getConfig } from '../utils/mm'
import { run } from '@ali/cloudbuild-client'
import logger from '../logger'
import { readJSON, writeJSON } from 'fs-extra'

interface BuildParams {
  /** 项目目录 */
  cwd: string,
  /** 当前分支 */
  branch: string,
  /** 环境变量 */
  env?: any
}

/**
 * 在本地执行 DEF 云构建
 * @param params
 * @param emitter
 */
export default async function build (params: BuildParams, emitter: EventEmitter) {
  emitter.emit('data', green('ⓘ 开始执行 DEF 云构建，请稍候...'))

  const { cwd, branch } = params
  const options: any = {
    cwd,
    buildTo: `${cwd}/build`,
    env: 'production',
    empId: getConfig('user.extern_uid'),
    appcode: '01d9f600bff6ad7f170ccafd7a0ec706',
    branch,
    debug: undefined,
    type: 'assets',
    argv: [],
    api: undefined
  }

  // https://builder.alibaba-inc.com/document?slug=client
  try {
    // const builder = new CloudBuild()
    // const res = await builder.run(options)
    logger.info('build', options)
    const res = await run(options)
    logger.info('build', res)
    if (res.error) {
      emitter.emit('error', res.error)
      emitter.emit('close', 1)
      return
    }
  } catch (error) {
    emitter.emit('error', error)
    emitter.emit('close', 1)
    return
  }
  emitter.emit('data', green(`✔ 构建完成 (构建结果在目录：${cwd}/build)`))
  emitter.emit('close', 0)
}
