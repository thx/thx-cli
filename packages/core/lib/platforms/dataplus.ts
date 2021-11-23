/**
 * 数据小站相关的接口
 */
// const config = require(`../config`)
import { getConfig } from '../utils/mm'
const rp = require('request-promise')
const chalk = require('chalk')
const ora = require('ora')

export async function createSpma (options) {
  const spinner = ora({
    text: 'chartpark项目创建中，请稍候...'
  }).start()

  try {
    const result = await _createSpma(options)
    spinner.succeed(chalk.green(`自动创建spma成功(${result.spma})`))
    return result
  } catch (error) {
    spinner.fail(`${chalk.yellow('✘ 自动创建spma失败')}: ${error}`)
  }
}

export async function _createSpma (options = {}) {
  try {
    const empId = getConfig('user.extern_uid')
    const _params = {
      userId: empId
    }
    Object.assign(_params, options)

    const params = encodeURIComponent(JSON.stringify(_params))
    const resp = await rp({
      url: `https://fether.m.alibaba-inc.com/analytics/getSpma?params=${params}`,
      method: 'GET',
      json: true
    })
    if (resp.code === 200) {
      return resp.result
    } else {
      throw new Error(`自动创建spma失败 ${chalk.grey(`(失败原因：${resp.message})`)}`)
    }
  } catch (error) {
    throw new Error(`${chalk.yellow('✘ 自动创建spma失败')}: ${error}`)
  }
}

// 接入数据小站dataplus
export async function joinDataplus (name, spma) {
  const _params = {
    name,
    spma
  }

  const params = encodeURIComponent(JSON.stringify(_params))
  const resp = await rp({
    url: `https://fether.m.alibaba-inc.com/analytics/api_site_add?params=${params}`,
    method: 'GET',
    json: true
  })
  if (resp.code === 200) {
    if (resp.result.info.ok) {
      return resp.result.data
    } else {
      throw resp.result.info.message
    }
  } else {
    throw resp.message
  }
}
