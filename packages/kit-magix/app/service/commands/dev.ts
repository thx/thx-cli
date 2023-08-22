'use strict'
/**
 * 项目开发命令，包含启动本地mat服务器
 * mm dev: 启动对接rap接口模拟的本地开发服务器
 * mm dev -d <ip>: 启动对接真实接口ip地址的本地开发服务器
 * mm dev -p <port>: 指定服务器的端口号
 */
import { util, dev as devApi } from 'thx-magix-scripts'
import * as chalk from 'chalk'
import * as inquirer from 'inquirer' // A collection of common interactive command line userinterfaces.

export default async options => {
  const {
    daily, // mm dev -d
    online, // mm dev -o
    ipconfigIndex, // mm dev -i <i> 直接选择ipconfig第i个配置
    ipconfigName, // mm dev -n <name> 直接选择ipconfig的name对应的配置
    port, // 端口号
    closeHmr, // 关闭热更新
    closeDocs, // 关闭帮助文档小精灵
    // closeDesiger, // 关闭 magix-desiger
    // closeInspector, // 关闭 Inspector
    https // 是否启动 https 服务器
    // debug // debug 模式会校验 rap 接口
  } = options
  const params: any = {}
  const magixCliConfig = await util.getMagixCliConfig()

  /**
   * mm dev -d(-o) 未输入ip地址，且本地存在ip.config，则从本地配置中读取ip地址
   */
  const proxyPass = daily || online

  // rmx dev -d 对接真实接口，未填ip地址，则从ipConfigs里读取供用户选择
  if (proxyPass === true) {
    // 优先读取magixCliConfig.ipConfig
    const { ipConfig = {} } = magixCliConfig
    const choices: any = []

    for (const name in ipConfig) {
      const ip = ipConfig[name]
      choices.push({
        name: `${ip}: ${chalk.grey(name)}`,
        value: ip
      })
    }

    const questions = [
      {
        type: 'list',
        name: 'ip',
        message: chalk.green('【请选择开发环境ip】:'),
        choices
      }
    ]

    if (choices.length > 1) {
      // 指定第 i 个配置
      if (ipconfigIndex !== undefined) {
        params.ip = choices[ipconfigIndex - 1]?.value
      }

      // 指定 name 对应的配置
      else if (ipconfigName !== undefined) {
        params.ip = ipConfig[ipconfigName]
      }

      // 让用户选择配置
      else {
        const answers = await inquirer.prompt(questions)
        params.ip = answers.ip
      }

      if (!params.ip) {
        return console.log(chalk.red('✘ ipConfigs 配置里没有找到该条配置'))
      }
    } else if (choices.length === 1) {
      // 只有一个环境ip时，默认直接取第一个
      params.ip = choices[0].value
    } else {
      return console.log(
        chalk.red(
          '✘ 检测到 package.json 的 magixCliConfig 中未配置 ipConfig，请配置好再执行本命令'
        )
      )
    }
  } else if (proxyPass) {
    // rmx dev -d x.x.x.x 对接真实接口，显式的传了ip
    params.ip = proxyPass
  }

  // 开源版移除部分功能
  magixCliConfig.cloudBuild = false
  magixCliConfig.preloadModuleList = false
  params.isCloseDesiger = true
  params.isCloseInspector = true
  params.isCloseSetHost = true

  params.port = port
  params.isCloseHmr = closeHmr
  params.isCloseDocs = closeDocs
  params.isHttps = https
  // params.isDebug = debug
  params.magixCliConfig = magixCliConfig

  //
  const emitter = devApi.exec(params)
  function closeCallback(resp) {
    if (resp.error) {
      console.log(chalk.red(`✘ ${resp.error}`))
    }

    // 移除监听器
    emitter.removeAllListeners()
  }

  emitter.on('data', msg => {
    console.log(msg)
  })
  emitter.on('close', closeCallback)
}
