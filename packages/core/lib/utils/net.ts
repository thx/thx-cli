import { resolve } from 'path'
import { execSync } from 'child_process'
import * as net from 'net'
import * as fse from 'fs-extra'
import * as kill from 'kill-port'
import { blueBright, redBright, yellowBright } from 'chalk'
import * as open from 'open'
const portfinder = require('portfinder')

/**
 * 检测端口是否被占用
 */
export function portIsOccupied(port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // 创建服务并监听该端口
    const server = net.createServer().listen(port)

    server.on('listening', function () {
      // 执行这块代码说明端口未被占用
      server.close() // 关闭服务
      resolve(false)
    })

    server.on('error', function (err: any) {
      if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
        // 端口已经被使用或没权限
        // reject(err)
        server.close() // 关闭服务
        resolve(true)
      }
    })
  })
}

// 统一清除设置为127.0.0.1的host对应的配置
export function clearHostsByName(host) {
  let hostsContent = fse.readFileSync('/etc/hosts', 'utf-8')

  const regexp = new RegExp(
    `\\s*#mm-cli-\.\+-start\\s\*127.0.0.1\\s${host}\\s\*#mm-cli-\.\+-end\\s*`,
    'g'
  )

  hostsContent = hostsContent.replace(regexp, '\n')

  // 写入hosts
  writeHosts(hostsContent)
}

// 设置本地hosts文件
export function setHosts(host, randomKey) {
  let hostsContent = fse.readFileSync('/etc/hosts', 'utf-8')

  // 先执行清除同名host的配置（有可能用户之前没有正常关闭进程导致残留host配置）

  hostsContent =
    `\n#mm-cli-${randomKey}-start\n127.0.0.1 ${host}\n#mm-cli-${randomKey}-end\n` +
    hostsContent

  // 写入hosts
  writeHosts(hostsContent)
}

// 退出进程时清除掉之前设置的host
export function clearHosts(randomKey) {
  let hostsContent = fse.readFileSync('/etc/hosts', 'utf-8')
  const regexp = new RegExp(
    `\\s#mm-cli-${randomKey}-start\[\^\]\*#mm-cli-${randomKey}-end\\s`
  )
  hostsContent = hostsContent.replace(regexp, '')

  // 写入hosts
  writeHosts(hostsContent)
}

export function writeHosts(hostsContent) {
  try {
    // 设置本地hosts
    fse.outputFileSync('/etc/hosts', hostsContent, 'utf-8')
  } catch (error) {
    if (error.code === 'EACCES') {
      throw new Error('修改 hosts 文件需要系统 SUDO 权限')
    } else {
      throw error
    }
  }
}

export async function killPort(port: number) {
  return (
    kill(port, 'tcp')
      // .then(console.log)
      .then(({ error, stdout, stderr, cmd, code }) => {
        console.log(redBright(`try to kill port ${yellowBright.bold(port)}`))
        console.log(`${blueBright(cmd)}`)
        if (error) console.error(error)
      })
      .catch(console.error)
  )
}

export async function getAvailablePort() {
  portfinder.basePort = 8888
  portfinder.highestPort = 9999

  return portfinder.getPortPromise()
}

/** 尝试在浏览器中打开目标地址。如果是重复打开，则自动刷新已开页签。 */
export function onetab(
  target: string,
  options: any = { app: 'google chrome' }
) {
  try {
    execSync(`osascript openChrome.applescript ${target}`, {
      cwd: resolve(__dirname, '../../scripts'),
      stdio: 'ignore'
    })
  } catch (error) {
    open(target, options)
  }
}
