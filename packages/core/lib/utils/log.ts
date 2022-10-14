import fetch from 'node-fetch'
import { getRmxConfig } from './mm'
import { cyanBright } from 'chalk'
import logger from '../logger'

// 黄金令箭 https://log.alibaba-inc.com/track/tools/applyGold
// 日志格式 http://gm.mmstat.com/mm-cli.system.command?argv=[$]&end=[$]&start=[$]&t={时间戳}
export async function goldlog(
  key = 'mm-cli.system.command',
  argv: Array<string> | string = process.argv,
  start: number = Date.now(),
  end?: number | undefined
) {
  const rmxConfig = getRmxConfig()
  const cna = rmxConfig?.user?.username || '-'
  const url = `http://gm.mmstat.com/${key}?cna=${cna}&cwd=${process.cwd()}&argv=${argv}&start=${
    start || ''
  }&end=${end || ''}&t=${Date.now()}`
  logger.trace('goldlog', '🏹️', url)
  try {
    await fetch(url)
  } catch (error) {
    logger.error(error.message)
  }
}

export async function took(label: string, task: Function, byoLogger?) {
  const start = Date.now()
  const nextLogger = byoLogger || logger
  try {
    nextLogger.debug(`⌚️ The task ${cyanBright(label)} ...`)
    await task()
  } finally {
    nextLogger.debug(
      `⌚️ The task ${cyanBright(label)} took ${Date.now() - start}ms.`
    )
  }
}
