import { CommanderStatic } from 'commander'
import { utils } from 'thx-cli-core'
import {
  greenBright,
  grey,
  blueBright,
  yellowBright,
  redBright,
  whiteBright
} from 'chalk'
import * as URI from 'urijs'
import { IRMXConfig } from 'thx-cli-core/types'
import * as fse from 'fs-extra'
import { join } from 'path'
import * as inquirer from 'inquirer'
import logger from './logger'

const { spawnCommand, execCommand, getRmxConfig, setRmxConfig } = utils
const pkg = require('../package.json')

interface IClearConfig {
  hosts: Array<string>
}

function printHostList(hosts: Array<string>) {
  console.log(greenBright('ⓘ Clear 已配置域名：'))
  hosts.forEach((host, index) => {
    const prefix = index < hosts.length - 1 ? '├─' : '└─'
    console.log(whiteBright(`  ${grey(prefix)} ${host}`))
  })
}

// 将https://dmp.taobao.com/ 这种转换成纯host ： dmp.taobao.com
function adjustHost(uri: string) {
  const host = URI(uri).hostname()
  return host || uri
  // return host.replace(/(?:(?:https?:)?\/\/)?([^/]+).*/, '$1')
}

function fillPluginConfig(): IClearConfig {
  const cliConfig: IRMXConfig = getRmxConfig()
  if (cliConfig[pkg.name]) return cliConfig[pkg.name]

  cliConfig[pkg.name] = { hosts: [] }
  setRmxConfig(cliConfig)

  return cliConfig[pkg.name]
}

function updatePluginConfig(pluginConfig) {
  const cliConfig = getRmxConfig()
  cliConfig[pkg.name] = pluginConfig
  setRmxConfig(cliConfig)
}
function parseHosts(hosts: string) {
  return hosts
    .split(',')
    .map((host: string) => adjustHost(host.trim()))
    .filter((host: string) => host !== '' && host !== undefined)
}

function listHosts(pluginConfig: IClearConfig) {
  const { hosts } = pluginConfig
  if (!hosts || !hosts.length) {
    const cmd = 'mm clear --add <host>'
    console.log(
      yellowBright(
        `ⓘ Clear 尚未配置域名，请先执行 ${blueBright(cmd)} 添加域名。`
      )
    )
    return
  }
  printHostList(hosts)
}

function addHosts(pluginConfig, additionalHosts: string) {
  const nextHosts = new Set(pluginConfig.hosts)
  parseHosts(additionalHosts).forEach((host: string) => {
    nextHosts.add(host)
  })

  pluginConfig.hosts = [...nextHosts]
  updatePluginConfig(pluginConfig)
}

function clearHosts(pluginConfig) {
  pluginConfig.hosts = []
  updatePluginConfig(pluginConfig)
}

async function main(hosts: Array<string>) {
  // 1. 先清除 chrome 缓存
  await fse.remove(
    `${process.env.HOME}/Library/Caches/Google/Chrome/Default/Cache`
  )

  // 2. 执行 applescript
  const scriptPath = join(
    __dirname,
    '../applescript/clear-dns-hsts.applescript'
  )
  await spawnCommand('chmod', ['755', scriptPath]) // 开启脚本运行权限
  try {
    await execCommand(`${scriptPath} ${hosts.join(',')}`) // 执行
    console.log(greenBright('✔ Chrome 的 DNS 和 HSTS 清除成功！'))
  } catch (error) {
    logger.error(error)
    console.log(
      redBright(
        '✘ Clear 清除失败，请确保 Chrome 浏览器菜单的【视图】=>【开发者】=>【允许Apple事件中的Javascript】已勾选。'
      )
    )
  }
}

const CLEAR_HOST_QUESTION_LIST = [
  {
    type: 'input',
    name: 'hosts',
    message: yellowBright(
      `Clear 尚未配置域名，请输入要清除缓存的域名${grey(
        '（例如 foo.com，多个域名之间以逗号分隔)'
      )}：`
    ),
    validate(msg: string) {
      if (!msg.trim()) return '必填'
      return true
    }
  }
]

/**
 * 快速测试
 * $ nodemon --ext js,ts,tsx,json --watch src --watch dist --exec "mm clear --help; mm clear --list; mm clear --clear; mm clear --add foo.com; mm clear --add foo.com,bar.com; mm clear --add http://foo.com,http://bar.com; mm clear"
 *
 * @param command
 */
export default async function (
  additionalHosts: string,
  command?: CommanderStatic
) {
  const pluginConfig = fillPluginConfig()

  // 列出所有已经配置过的域名
  if (command?.list === true) {
    listHosts(pluginConfig)
    return
  }
  // 清除所有域名配置
  if (command?.clear === true) {
    clearHosts(pluginConfig)
    console.log(greenBright('✔ Clear 已清除本地域名配置'))
    return
  }
  // 添加域名配置
  if (command?.add) {
    addHosts(pluginConfig, command.add)
    console.log(greenBright('✔ Clear 添加域名成功'))
    printHostList(pluginConfig.hosts)
    return
  }

  // 添加域名配置
  if (additionalHosts) {
    addHosts(pluginConfig, additionalHosts)
  }

  if (!pluginConfig.hosts || !pluginConfig.hosts.length) {
    const { hosts: additionalHosts } = await inquirer.prompt(
      CLEAR_HOST_QUESTION_LIST
    )
    pluginConfig.hosts = parseHosts(additionalHosts)
    updatePluginConfig(pluginConfig)
    console.log(greenBright('✔ Clear 添加域名成功'))
  }

  // 命令主功能，清除 hsts 缓存
  const { hosts } = pluginConfig
  printHostList(hosts)
  await main(hosts)
}
