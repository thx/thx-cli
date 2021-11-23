/**
 * 依赖 DEF 的云构建，需要项目里有 abc.json
 */
import { EventEmitter } from 'events'
import { release, getProjectInfo } from '../platforms/def'
import { green, blueBright, greenBright, grey } from 'chalk'
import * as open from 'open'
import * as utils from '../utils'
import * as inquirer from 'inquirer'
import { execCommand } from '../utils/process'
import * as moment from 'moment'
import { prepare } from './daily'
const CR_KEY_WORD = '代码审阅'

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
  international?: any,
  prod?: any,
  workIds?: any[],
  codeReviewers?: any[],
  allReviewer?: boolean
}

// MO TODO 等于同于 `def publish --daily`
async function dailyDeploy ({ cwd, branch, prod }: IDailyParams, emitter) {
  if (prod) return
  try {
    await release({
      publishBranch: branch,
      publishType: 'daily',
      internationalCdn: null,
      isCheck: true,
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

// MO TODO 等于同于 `def publish --prod`
async function prodDeploy ({ cwd, branch, prod, international, codeReviewers, workIds }: IDailyParams, emitter) {
  try {
    await release({
      publishBranch: branch,
      publishType: 'prod',
      internationalCdn: international,
      isCheck: null,
      log (message: string) {
        emitter.emit('data', message)
      },
      cwd,
      checkMenshen: prod
    })
  } catch (error) {
    // 如果是code review报错，则自动打开CR页面
    if (error.message && error.message.includes(CR_KEY_WORD)) {
      emitter.emit('data', error.message)

      let title = ''
      if (codeReviewers.length) {
        // 如果有配置codeReviewers，则自动发送审阅
        const workNames = codeReviewers.filter(reviewer => workIds.includes(reviewer.value)).map(reviewer => reviewer.name).join(',')

        // 获取项目仓库名称 (例：mm/dmp-new)
        const { repoName } = await getProjectInfo()
        const crParams = {
          repo: repoName,
          branch,
          workIds: workIds.join(','),
          workNames
        }
        // open(`https://fether.m.alibaba-inc.com/business/commitCodereview?_f_needLogin=1&params=${JSON.stringify(crParams)}`)
        open(`https://mmwork.alibaba-inc.com/page_20201224_175842_411?params=${JSON.stringify(crParams)}`)

        // 轮询等待审阅通过后继续发布流程
        title = `已发送代码审阅给 ${green(workNames)}，系统轮询等待审阅中，审阅完毕会继续完成发布流程`
      } else {
        // 没有配置审阅人员的项目，打开DEF审阅页面手动提交审阅
        const crUrl = /(https:\/\/.+\/\d+)/.exec(error.message)
        if (crUrl && crUrl[1]) {
          open(crUrl[1])
        }

        title = '检测到当前分支还未通过代码审阅，已自动打开 DEF 审阅页面，请提交或跳过审阅，系统轮询等待中，审阅通过会继续完成当前发布流程'
      }

      await utils.withSpinner(title, async () => {
        return await pollingPublish({ cwd, branch, international })
      }, (err) => {
        throw err
      })(emitter)
    } else {
      emitter.emit('error', error)
      emitter.emit('close', 1)
      throw error
    }
  }
}

// 获取代码审阅人员
async function getCodeReviewers ({ codeReviewers: cmdCodeReviewers, allReviewer }) {
  const appPath = await utils.getAppPath()
  const pkg = await utils.getAppPkg(appPath)

  let workIds = []
  let codeReviewers = []

  // 命令行带了审阅人员列表
  if (cmdCodeReviewers && typeof cmdCodeReviewers === 'string') {
    codeReviewers = cmdCodeReviewers.split(',').map(cr => {
      const workId = cr.replace(/^0+/, '')
      return {
        value: workId,
        name: workId
      }
    })
    workIds = codeReviewers.map(cr => cr.value)
  } else if (pkg.contributors || cmdCodeReviewers) {
    // 兼容下 magixCliConfig.codeReviewers 配置
    const _contributors = cmdCodeReviewers || pkg.contributors

    // 如果项目package.json配置了contributors，则先选择审阅人员
    // contributors 范例：
    //  [{
    //    "name": "崇志",
    //    "id": "50763"
    //  }]
    // 先选择代码审阅人员
    codeReviewers = _contributors.map(reviewer => {
      const id = reviewer.id ?? reviewer.workId // 兼容老的 workId
      const name = reviewer.name ?? reviewer.workName // 兼容老的 workName
      const value = id.toString().replace(/^0+/, '') // 去掉前缀0
      return {
        name,
        value
      }
    })

    // 过滤掉自己
    const currWorkId = utils.getConfig('user.extern_uid') // 自己的工号
    codeReviewers = codeReviewers.filter(cr => {
      return cr.value !== currWorkId
    })

    // 全选了审阅人员
    if (allReviewer) {
      //
      workIds = codeReviewers.map(cr => cr.value)
    } else {
      // 非全选让用户选择
      const questions = [{
        validate: (workers) => {
          if (!workers.length) {
            return '请至少选择一个审阅人员'
          } else {
            return true
          }
        },
        required: true,
        type: 'checkbox',
        name: 'workIds',
        message: greenBright('『请选择代码审阅人员』：'),
        choices: codeReviewers
      }]
      const answers = await inquirer.prompt(questions)
      workIds = answers.workIds
    }
  }

  return {
    workIds,
    codeReviewers
  }
}

// 轮询 publish，直到审阅通过
const POLLING_TIMEOUT = 3 * 1000
async function pollingPublish ({ cwd, branch, international }) {
  return new Promise((resolve, reject) => {
    function polling () {
      setTimeout(async () => {
        try {
        // 轮询publish
          await release({
            publishBranch: branch,
            publishType: 'prod',
            internationalCdn: international,
            isCheck: false,
            log: (message) => {},
            cwd,
            checkMenshen: false
          })
          resolve(null)
        } catch (error) {
          if (error.message && error.message.includes(CR_KEY_WORD)) {
            polling()
            return
          }
          reject(error)
        }
      }, POLLING_TIMEOUT)
    }

    polling()
  })
}

/**
 * params 参数
 * params.cwd [string]
 * params.branch [string] 要发布的分支
 * params.message [string] 发布会自动提交当前代码的 commit 信息
 * params.uncheck [boolean] webui 使用时请设置为 true
 * params.international [boolean] 是否同时发布到国际版
 * params.prod [boolean] 是否绕过 daily 直接发布线上环境
 * params.allReviewer [boolean] 是否全选已配置的代码审阅人员
 * params.codeReviewers [string] 直接指定代码审阅人员工号，多工号以逗号分隔
 */
export default async function publish (params: IDailyParams, emitter: EventEmitter) {
  const { cwd, branch, uncheck, message, international, prod, env = {} } = params
  const { codeReviewers, allReviewer } = params

  // 先获取代码审阅人员
  const { workIds, codeReviewers: codeReviewersArr } = await getCodeReviewers({ codeReviewers, allReviewer })

  try {
    const { repoName } = await getProjectInfo(cwd)
    const version = branch.replace(/.+\//, '')

    await prepare({ cwd, branch, uncheck, message }, emitter)
    await dailyDeploy({ cwd, branch, prod }, emitter)
    await prodDeploy({ cwd, branch, prod, international, codeReviewers: codeReviewersArr, workIds }, emitter)

    // 合并开发分支到 master，并随后删除开发分支
    await execCommand('git checkout master', { cwd })
    await execCommand('git pull origin master', { cwd })
    await execCommand('git branch -D ' + branch, { cwd })
    await execCommand('git remote prune origin', { cwd })

    emitter.emit('data', greenBright(
      `✔ [MM CLI][${moment().format('HH:mm:ss')}] 线上环境发布成功，版本号 ${blueBright(version)}`
    ))

    emitter.emit('data',
    `${grey(`[${moment().format('HH:mm:ss')}] 资源已发布到 https://g.alicdn.com/${repoName}/${version}/ 目录下`)}`
    )

    emitter.emit('close', 0)
  } catch (error) {
    emitter.emit('error', error)
    emitter.emit('close', 1)
    throw error
  }
}
