'use strict'
/**
 * 项目开发命令，包含启动本地mat服务器
 * mm dev: 启动对接rap接口模拟的本地开发服务器
 * mm dev -d <ip>: 启动对接真实接口ip地址的本地开发服务器
 * mm dev -p <port>: 指定服务器的端口号
 */
import util from '../../util/util'
import * as chalk from 'chalk'
import * as inquirer from 'inquirer' // A collection of common interactive command line userinterfaces.
import devApis from '../apis/dev'
// import { utils } from '@ali/mm-cli-core'

export default async (options) => {
  const params: any = {}
  const magixCliConfig = await util.getMagixCliConfig()

  /**
     * mm dev -d(-o) 未输入ip地址，且本地存在ip.config，则从本地配置中读取ip地址
     */
  const proxyPass = options.daily || options.online

  // rmx dev -d 对接真实接口，未填ip地址，则从ipConfigs里读取供用户选择
  if (proxyPass === true) {
    // 优先读取magixCliConfig.ipConfig
    const { ipConfig = {} } = magixCliConfig
    const choices = []

    for (const desc in ipConfig) {
      const ip = ipConfig[desc]
      choices.push({
        name: `${ip}: ${chalk.grey(desc)}`,
        value: ip
      })
    }

    const questions = [{
      type: 'list',
      name: 'ip',
      message: chalk.green('【请选择开发环境ip】:'),
      choices
    }]

    if (choices.length > 1) {
      if (options.ipconfigIndex !== undefined) {
        // 指定某个配置
        params.ip = choices[options.ipconfigIndex - 1]?.value

        if (!params.ip) {
          return console.log(chalk.red('✘ ipConfigs 配置里没有找到该条配置'))
        }
      } else {
        // 让用户选择配置
        const answers = await inquirer.prompt(questions)
        params.ip = answers.ip
      }
    } else if (choices.length === 1) { // 只有一个环境ip时，默认直接取第一个
      params.ip = choices[0].value
    } else {
      return console.log(chalk.red('✘ 检测到 package.json 的 magixCliConfig 中未配置 ipConfig，请配置好再执行本命令'))
    }
  } else if (proxyPass) {
    // rmx dev -d x.x.x.x 对接真实接口，显式的传了ip
    params.ip = proxyPass
  }

  params.port = options.port
  params.isCloseHmr = options.closeHmr
  params.isCloseDocs = options.closeDocs
  params.isCloseDesiger = options.closeDesiger
  params.isCloseInspector = options.closeInspector
  params.isHttps = options.https
  params.isDebug = options.debug

  const emitter = devApis.exec(params)

  emitter.on('data', msg => {
    console.log(msg)
  })
  emitter.on('close', resp => {
    if (resp.error) {
      console.log(chalk.red(`✘ ${resp.error}`))
    }
  })
}
