/**
 * DEF平台相关API
 * * @ali/def-pub-client https://web.npm.alibaba-inc.com/package/@ali/def-pub-client
 */
// const config = require(`../config`)
import { getConfig } from '../utils/mm'
import * as utils from '../utils/index'

const Client = require('@ali/def-pub-client')
const co = require('co')
const chalk = require('chalk')
const BaasClients = require('@ali/b2-common-clients')
const rp = require('request-promise')
const CLIENT_TOKEN = '8a172716c2de91e37fbe54d111ce5c0e375ee7c8409bb3ae4fc39160c693607c'
const apiPrefix = 'https://api.def.alibaba-inc.com/api/work'

// 将项目仓库接入DEF发布系统
export async function joinDef (name, group, options) {
  try {
    const data = await _joinDef(name, group, options)
    console.log(chalk.green(`✔ 仓库接入 DEF 平台成功（项目 ID: ${data.id}）`))
    return data
  } catch (error) {
    console.log(chalk.yellow(`✘ 仓库接入 DEF 平台失败，失败原因：${error}`))
  }
}

export async function _joinDef (name: string, group: string, options = {}) {
  const empId = getConfig('user.extern_uid')
  const params = {
    emp_id: empId,
    client_token: CLIENT_TOKEN,
    group: group,
    project: name,
    description: name,
    reason: '前端发布接入',
    duration: 360,
    pubtype: 1,
    user: [empId]
  }

  Object.assign(params, options)

  const result = await rp({
    uri: `${apiPrefix}/repo/apply`,
    method: 'POST',
    form: params,
    json: true
  })

  if (result.error) {
    throw result.error
  } else {
    result.data.id = result.data.app_id || result.data.project_id
    return result.data
  }
}

/**
     * 获取分支最新commit
     * branch: daily/0.0.5
     */
export async function getSHAByBranch (branch, cwd = process.cwd()) {
  const sha = await utils.execCommandReturn(`git rev-parse ${branch}`, { cwd })
  return sha.trim()
}

/**
       * 获取项目git地址
       */
export async function getProjectInfo (cwd = process.cwd()): Promise<any> {
  const remote = await utils.execCommandReturn('git remote -v', { cwd }) // remote git@mm/damoing.git
  const projectPath = /(\S+gitlab\.alibaba-inc\.com[:/].+\.git)/.exec(remote) // mm/damojing
  const repo = /\S+gitlab\.alibaba-inc\.com[:/](.+)\.git/.exec(remote)

  return {
    repo: projectPath && projectPath[1],
    repoName: repo && repo[1]
  }
}

// 云构建并发布
// checkMenshen 标识是否先检测门神校验是否通过中
export function release ({ publishBranch, publishType, internationalCdn, isCheck, log, cwd, checkMenshen = false }): Promise<any> {
  cwd = cwd || process.cwd()
  const customLog = log || console.log
  return new Promise(async (resolve, reject) => {
    if (checkMenshen) {
      // mm p -p 时先校验门神是否通过
      await utils.withSpinner('轮询等待门神任务运行结果，请耐心等待', async () => {
        return await pollingChecked()
      }, (err) => {
        reject(err)
      })()
    }

    //
    function * run () {
      const ticket = yield Client.login() // 第一步：获取用户身份信息
      yield new Promise(async (resolve, reject) => {
        const client = new Client.Client() // 第二步：调用client，监听相应事件
        const { repo } = await getProjectInfo(cwd)
        const commit = await getSHAByBranch(publishBranch, cwd)

        client.on('start', (options) => {
          let message = ''
          if (publishType === 'daily') {
            message = 'ⓘ 开始进行日常环境代码发布'
          } else {
            message = 'ⓘ 开始进行线上环境代码发布'
          }

          customLog(chalk.cyan(message))
        })
        client.on('message', (msg) => {
          msg = msg.replace(/\n/, '').trim()
          if (msg) {
            // 发布过程的日志事件，会触发多次
            customLog(msg)
          }
        })
        client.on('error', (error) => {
          // 发布失败，从 error.message 中读取错误信息
          // customLog(chalk.red(`✘ ${error.message}`))
          reject(error)
          // process.exit(0)
        })
        client.on('success', () => {
          // 发布成功
          resolve(null)
        })

        // run 方法中传入发布仓库信息
        client.run({
          ticket,
          repo, // 仓库地址
          branch: publishBranch, // 待发布分支
          commit_id: commit, // 待发布 commitid
          target: publishType // 发布环境: daily 日常，prod 线上
        })
      })
    };

    // 轮询检查门神检查是否完成
    async function pollingChecked (): Promise<any> {
      const { repo } = await getProjectInfo(cwd)
      const commit = await getSHAByBranch(publishBranch, cwd)

      return new Promise((resolve, reject) => {
        function polling () {
          setTimeout(async () => {
            try {
              const result = await rp({
                uri: `${apiPrefix}/repo_gog_status`,
                method: 'GET',
                qs: {
                  repo: repo,
                  branch: publishBranch,
                  commit_id: commit,
                  client_token: CLIENT_TOKEN
                },
                json: true,
                timeout: 120 * 1000 // 120秒的请求过时
              })

              switch (result.data.status) {
                case 2: // 运行中
                  polling()
                  break
                case 3: // 成功
                  resolve(null)
                  break
                case 4: // 失败
                  reject(result.error)

                  break

                default:
                  reject(result.error)
              }
            } catch (error) {
              reject(error)
            }
          }, 2000)
        }

        polling()
      })
    }

    co(run).then(async () => {
      // 如果是日常发布，则轮询判断下门神检查是否完成
      // 门神检查通过了才能正式发布
      // isCheck，只有在mm publish时才设isCheck:true
      if (publishType === 'daily' && isCheck) {
        await utils.withSpinner('轮询等待门神任务运行结果，请耐心等待', async () => {
          return await pollingChecked()
        }, (err) => {
          reject(err)
        })()
      }

      // 如果magixCliConfig配置了internationalCdn: true，则同步将文件发布到国际化cdn上，
      // 域名为https://g.alicdn.com/... -> https://b.alicdn.com/g/...
      if (publishType === 'prod' && internationalCdn) {
        const baas = new BaasClients({
          env: 'prod',
          appId: '85',
          appSecret: 'd1962f09a532a053ed4265e9bfb00993675ee63ef287a3e7'
        })
        const { repo } = await getProjectInfo(cwd)
        const gitInfo = /\S+gitlab\.alibaba-inc\.com[:/]([^/]+)\/([^/]+)\.git/.exec(repo)
        const group = gitInfo && gitInfo[1]
        const project = gitInfo && gitInfo[2]

        co(function * () {
          return yield baas.bAssetsPublisher.publishToG({
            dir: 'build', // your build/dist dir
            group, // your git group
            project, // your git project
            version: publishBranch.replace('daily/', '') // your assets version
          })
        }).then(val => {
          if (val.success) {
            customLog(chalk.green('✔ [国际化cdn发布成功] 域名前缀为 https://b.alicdn.com/g/'))
          } else {
            customLog(chalk.red(`✘ [国际化cdn发布失败] ${JSON.stringify(val)}`))
          }
        }).catch(e => {
          customLog(chalk.red(`✘ [国际化cdn发布失败] ${JSON.stringify(e)}`))
        })
      }

      resolve(null)
    }).catch(e => {
      reject(e)
    })
  })
}
