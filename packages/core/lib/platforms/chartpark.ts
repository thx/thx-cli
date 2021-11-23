import * as chalk from 'chalk'
import * as rp from 'request-promise'
import { getConfig } from '../utils/mm'
const ora = require('ora')

/**
 * 创建 chartpark 项目
 * @param {*} name 名称
 * @param {*} options 自定义参数
 */
export async function createProject (name, options) {
  //
  const spinner = ora({
    text: 'chartpark项目创建中，请稍候...'
  }).start()

  try {
    const data = await _createProject(name, options)

    spinner.succeed(`${chalk.green('✔ 创建chartpark项目成功')}: (id: ${data.projectId})`)
    return data
  } catch (error) {
    spinner.fail(`${chalk.yellow('✘ 自动创建chartpark项目失败')}: ${error}`)
  }
}

export async function _createProject (name, options = {}) {
  const account = getConfig('user.username')
  const email = account + '@alibaba-inc.com'

  const params = {
    openid: email,
    name,
    description: '由rmx-cli自动创建的chartpark项目',
    status: 'cdn',
    type: 'es'
  }

  Object.assign(params, options)

  const resp = await rp({
    url: 'https://fether.m.alibaba-inc.com/chartpark-egg/api_open_project_add',
    method: 'POST',
    json: true,
    body: params
  })

  if (resp.code === 200) {
    return resp.result.data
  } else {
    throw new Error('自动创建chartpark项目失败,请自行登录chartpark平台创建项目然后将id填到项目的package.json里')
  }
}

// 根据chartparId返回配置的url
export async function getOptions (chartParkId, log) {
  const customLog = log || console.log
  if (!chartParkId) {
    customLog(chalk.red('\n✘ chartParkId参数丢失\n'))
    return
  }

  const api = `https://chartpark.alibaba-inc.com/api/getOptions.json?projectId=${chartParkId}`
  const resp = await rp({
    url: api,
    rejectUnauthorized: false
  })

  // 生成chartpark主文件
  let parseResp

  try {
    parseResp = JSON.parse(resp)
  } catch (err) {
    return customLog(chalk.red('✘ chartpark项目请求失败，请确保chartparkId配置正确'))
  }
  const chartUrl = parseResp.data.url

  if (!chartUrl) {
    customLog(chalk.red('✘ 请先在chartpark平台上添加图表，并选择CDN打包'))
    return
  }

  return chartUrl
}
