/**
 * 获取各平台的登录信息/token等
 */
// iconfont公开api
import { getConfig, setConfig } from '../utils/mm'
import { red, yellow, green, white } from 'chalk'
// key 目前统一约定为 iconfont
import * as crypto from 'crypto'

const open = require('open')
const ora = require('ora')
const requestPromise = require('request-promise') // MO TODO => node-fetch
const iconfontApiPrefix = 'https://www.iconfont.cn/open/'
// 加密，第三方使用，data是原始uuid，第三方自己随机生成，返回的crypted 是加密后的uuid，用来到iconfont授权
function aesEncrypt (data, key = 'iconfont') {
  // MO TODO crypto.createCipher(algorithm, password[, options]) => crypto.createCipheriv(algorithm, key, iv[, options])
  const cipher = crypto.createCipher('aes192', key)
  // const cipher = crypto.createCipheriv('aes192', key, null)
  let crypted = cipher.update(data, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

// 登录iconfont平台
export async function getIconfontToken () {
  let token = getConfig('iconfontToken') || ''
  const accountName = getConfig('user.username')
  const encryptAccountName = aesEncrypt(accountName)

  if (token.trim()) {
    try {
      // 获取用户信息来验证
      await requestPromise({
        url: `${iconfontApiPrefix}/user/myprojects.json?LG_TOKEN=${token}`,
        method: 'get',
        rejectUnauthorized: false,
        json: true
      })

      return token
    } catch (error) {
      if (error.statusCode === 401) {
        console.log(yellow('ⓘ token已过期或改变，需要重新登录iconfont'))
      } else {
        console.log(red(`✘ ${error.error.message}`))
      }

      token = ''
    }
  }

  async function getToken () {
    const resp = await requestPromise({
      url: `${iconfontApiPrefix}auth/check/${encryptAccountName}`,
      method: 'get',
      rejectUnauthorized: false,
      json: true
    })

    return resp
  }

  if (!token) {
    // 如果是已登录的直接返回token
    const _resp = await getToken()
    if (_resp.code === 200) {
      setConfig('iconfontToken', _resp.data.token)
      return _resp.data.token
    }

    /**
             * 没有找到之前保存的token则先打开浏览器访问iconfont平台登录下
             */
    open(`${iconfontApiPrefix}auth/${encryptAccountName}`)

    let spinner
    // 登录
    spinner = ora({
      text: white('请在刚刚打开的页面上完成iconfont登录，再返回这里操作...')
    }).start()

    // 轮询查询是否已经登录成功了，登录成功后获取token
    const checkToken = function (_resolve?) {
      return new Promise(async (resolve, reject) => {
        resolve = _resolve || resolve
        try {
          const resp = await getToken()
          if (resp.code === 200) {
            resolve(resp.data.token)
          } else {
            setTimeout(async () => {
              return checkToken(resolve)
            }, 1000)
          }
        } catch (error) {
          console.log(error)
        }
      })
    }

    token = await checkToken()
    spinner.succeed(green('iconfont登录成功!'))

    // 登录成功则将token存到本地，下次则不需要再输帐号密码了
    setConfig('iconfontToken', token)
    return token
  }
}

// 根据项目名直接创建iconfont项目
export async function createProject (name, iconfontToken, options) {
  try {
    //
    const spinner = ora({
      text: 'iconfont项目创建中，请稍候...'
    }).start()

    // 获取用户信息来验证
    const resp = await _createProject(name, iconfontToken, options)
    spinner.succeed(green(`iconfont项目创建成功(项目id: ${resp.id})`))
    return resp
  } catch (error) {
    console.log(error)
  }
  return {}
}

export async function _createProject (name, iconfontToken, options = {}) {
  const params = {
    name
  }

  Object.assign(params, options)

  // 获取用户信息来验证
  const resp = await requestPromise({
    url: `${iconfontApiPrefix}project/create.json?LG_TOKEN=${iconfontToken}&name=${name}`,
    method: 'post',
    body: params,
    json: true

  })

  if (resp.code === 200) {
    return resp.data
  } else {
    throw new Error('iconfont项目创建失败，请自行到iconfont上创建项目，并配置到项目中')
  }

  // return {} // MO Unreachable code.
}

// 获取iconfont项目信息
export async function getProject (id) {
  // const customLog = log || console.log
  // let spinner
  // 登录
  // spinner = ora({
  //     text: white(`数据加载中，请稍候...`)
  // }).start()

  // customLog(`! 数据加载中，请稍候...`)

  // 获取用户信息来验证
  let resp = await requestPromise({
    url: `${iconfontApiPrefix}project/detail.json?pid=${id}`,
    method: 'get'
  })
  resp = JSON.parse(resp)

  if (resp.code === 200) {
    // customLog(green(`! 数据加载成功!`))
    // spinner.succeed(green('数据加载成功!'))
    return resp.data
  } else if (resp.code === 404) {
    throw new Error('没有找到该 iconfont 项目，请确保 iconfontId 配置正确！')
    // spinner.fail(red('没有找到该iconfont项目，请确保iconfontId配置正确!'))
  } else {
    throw new Error('iconfont 平台数据加载失败')
    // spinner.fail(red('iconfont平台数据加载失败!'))
  }
}
