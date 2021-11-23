/**
 * clue平台开放api
 */
import * as chalk from 'chalk'
const ora = require('ora')
const requestPromise = require('request-promise') // MO TODO => node-fetch
const clueOpenApi = require('@ali/clue-open-api')
const signQuery = clueOpenApi.signQuery
// 固定生成到崇志，浩添账号下
const userId = '50763,71147' // owner 工号
const userName = '崇志,浩添'

export function getSignQueryPost () {
  const signQueryPost = signQuery({
    method: 'post',
    key: 'scaffold', // 先在 Clue 上申请一个母项目，这个项目只为了拿到 secret 调用 Open API，这里填母项目的 pid
    secret: '2967d505-c7fe-5572f697', // 密钥，在开放平台中申请
    queryType: 'object'
  })
  return signQueryPost
}

// 获取 clue 项目
export async function createProject (name) {
  /**
       * 创建clue项目
       */
  // 生成加密工厂方法
  const spinner3 = ora({
    text: '开始创建clue项目，请稍候...'
  }).start()

  // 发送请求
  try {
    const data = await _createProject(name)
    // 创建成功
    spinner3.succeed(chalk.green(`clue项目创建成功，pid为${name}`))
    return data
  } catch (error) {
    spinner3.fail(chalk.white('clue项目创建失败，原因是：' + error))
  }
}

export async function _createProject (name) {
  /**
       * 创建clue项目
       */
  // 生成加密工厂方法

  const signQueryPost = getSignQueryPost()

  // 对参数进行加密，新建项目时这4个参数必传
  const finalParams = signQueryPost({
    pid: name, // 项目id（校验规则与手动创建项目一致）
    name: name + '的clue项目(by rmx-cli)', // 项目名
    userId, // owner 工号
    userName // owner 花名，若没有花名则传真名
  })

  // 发送请求
  try {
    // MO TODO => node-fetch
    let result = await requestPromise('https://clue.alibaba-inc.com/open/projects/add.json?ref=basement', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: Object.keys(finalParams).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(finalParams[key])
      }).join('&')
    })

    result = JSON.parse(result)

    if (result.code === 0) {
      // 创建成功
      // spinner3.succeed(chalk.green(`clue项目创建成功，pid为${name}`))
    } else {
      throw new Error(result.message)
      // console.log('创建失败，原因是：' + result.message);
      // spinner3.fail(chalk.white(`clue项目创建失败，原因是：${chalk.yellow(result.message)}`))
    }

    return result.data
  } catch (error) {
    throw new Error(error)
    // spinner3.fail(chalk.white('clue项目创建失败，原因是：' + error))
  }
}

// 添加一个自定义监控
export async function addCustomMonitor (name) {
  /**
       * 创建clue项目
       */
  // 生成加密工厂方法
  const spinner3 = ora({
    text: '开始创建clue的自定义监控，请稍候...'
  }).start()

  // 发送请求
  try {
    const result = await _addCustomMonitor(name)
    // 创建成功
    spinner3.succeed(chalk.green(`clue自定义监控创建成功，名称：${name}的自定义监控(by rmx-cli)`))
    return result
  } catch (error) {
    spinner3.fail(chalk.white('clue自定义监控创建失败，原因是：' + error))
  }
}

export async function _addCustomMonitor (name) {
  /**
       * 创建clue项目
       */
  // 生成加密工厂方法

  const signQueryPost = getSignQueryPost()

  // 对参数进行加密，新建项目时这4个参数必传
  const finalParams = signQueryPost({
    pid: name, // 项目id（校验规则与手动创建项目一致）
    name: name + '的自定义监控(by rmx-cli)', // 项目名
    code: 11,
    sampleRate: 1,
    has_stack: 1,
    userId, // owner 工号
    userName,
    c1: '堆栈1',
    c2: '堆栈2',
    c3: '堆栈3',
    c4: '',
    c5: ''
  })

  // 发送请求
  try {
    // MO TODO => node-fetch
    let result = await requestPromise('https://clue.alibaba-inc.com/open/projects/addCustomMonitor.json?ref=basement', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: Object.keys(finalParams).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(finalParams[key])
      }).join('&')
    })

    result = JSON.parse(result)

    if (result.code === 0) {
      // 创建成功
      // spinner3.succeed(chalk.green(`clue自定义监控创建成功，名称：${name}的自定义监控(by rmx-cli)`))
    } else {
      throw new Error(result.message)
      // console.log('创建失败，原因是：' + result.message);
      // spinner3.fail(chalk.white(`clue自定义监控创建失败，原因是：${chalk.yellow(result.message)}`))
    }

    return result.data
  } catch (error) {
    throw new Error(error)
    // spinner3.fail(chalk.white('clue自定义监控创建失败，原因是：' + error))
  }
}
