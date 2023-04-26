import { EventEmitter } from 'events'
import { greenBright, redBright, yellowBright, whiteBright } from 'chalk'
import * as moment from 'moment'
import * as ora from 'ora' // https://github.com/AndiDittrich/Node.CLI-Progress
import * as cliProgress from 'cli-progress'

export function getLength(target: any) {
  if (target === undefined) target = 'undefined'
  if (typeof target !== 'string') target = target.toString()
  const rcjk =
    /[\u2E80-\u2EFF\u2F00-\u2FDF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FBF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF]+/g
  let re = 0
  for (let i = 0; i < target.length; i++) {
    if (target[i].match(rcjk)) re += 2
    else re += 1
  }
  return re
}

/** 在尾部填充空格，直到指定长度 */
export function fixLength(target: any, max: number) {
  if (target === undefined) target = 'undefined'
  if (typeof target !== 'string') target = target.toString()
  return target + new Array(max - getLength(target)).fill(' ').join('')
}

/** 在头部填充空格，直到指定长度 */
export function prefixLength(target: any, max: number) {
  if (target === undefined) target = 'undefined'
  if (typeof target !== 'string') target = target.toString()
  return new Array(max - getLength(target)).fill(' ').join('') + target
}

export function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null)
    }, ms)
  })
}

/** 自动为任务 task 添加控制台加载动画 */
export function withSpinner(
  title: string,
  task: Function,
  errorHandler?: Function
) {
  return async (emitter?: EventEmitter, ...args) => {
    const start = Date.now()
    const spinner = ora(`${title} ...`).start()
    emitter && emitter.emit('data', `⠋ ${title} ...`)
    try {
      const result = await task(emitter, ...args)
      // await delay(3000)
      spinner.succeed(`${greenBright(title)} ${Date.now() - start}ms`)
      // logger.debug(grey(`'withSpinner' done in ${Date.now() - start}ms.`))
      emitter &&
        emitter.emit('data', greenBright(`✔ ${title} ${Date.now() - start}ms`))
      // emitter.emit('close', 0)
      return result
    } catch (error) {
      spinner.fail(redBright(`${title} 失败`))
      emitter && emitter.emit('data', redBright(`✘ ${title}`))
      emitter && emitter.emit('error', error)
      // emitter.emit('close', 1)
      if (errorHandler) {
        errorHandler(error)
      } else {
        throw error // 提供外部 try catch 捕获错误的能力
      }
    }
  }
}

export function withProgress() {
  const cliProgressBar = new cliProgress.SingleBar(
    {
      format:
        '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | {message}'
    },
    cliProgress.Presets.legacy
  )
  return cliProgressBar
}

// 格式化输出信息，带时间戳
export function printError(msg, cate?) {
  console.log(
    redBright(
      `✘ [${moment().format('HH:mm:ss')}] ${cate ? `${cate} ` : ''}${msg}`
    )
  )
}

export function printSuccess(msg, cate?) {
  console.log(
    greenBright(
      `✔ [${moment().format('HH:mm:ss')}] ${cate ? `${cate} ` : ''}${msg}`
    )
  )
}

export function printInfo(msg, cate?) {
  console.log(
    whiteBright(
      `  [${moment().format('HH:mm:ss')}] ${cate ? `${cate} ` : ''}${msg}`
    )
  )
}

export function printWarn(msg, cate?) {
  console.log(
    yellowBright(
      `ⓘ [${moment().format('HH:mm:ss')}] ${cate ? `${cate} ` : ''}${msg}`
    )
  )
}
