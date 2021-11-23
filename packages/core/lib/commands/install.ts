import { RMX_HOME, spawn, withSpinner, MODULE_TYPE_MAP, spawnCommand } from '../utils'
import { SpawnOptions } from 'child_process'
import * as fse from 'fs-extra'
import { redBright, greenBright } from 'chalk'
import { EventEmitter } from 'events'
import logger from '../logger'

export default async function install (emitter: EventEmitter, params) {
  const { type, module, link } = params
  const moduleDir = `${RMX_HOME}/${type}/${module.name}`

  // 子进程执行的 options 配置
  const options: SpawnOptions = {
    cwd: moduleDir,
    stdio: 'pipe'
  }

  // 如果是 sudo 则降权执行安装
  if (process.env.SUDO_GID) {
    options.gid = parseInt(process.env.SUDO_GID, 10)
  }
  if (process.env.SUDO_UID) {
    options.uid = parseInt(process.env.SUDO_UID, 10)
  }

  // 执行安装或链接命令
  function doit (): Promise<any> {
    return new Promise((resolve, reject) => {
      const command = process.platform === 'win32' ? 'tnpm.cmd' : 'tnpm' // npm update | yarn add
      const args = [link ? 'link' : 'update', module.package, '--color']

      // tnpm install 禁止 SUDO 执行 （根据判断env.USER是否为 root），所以需要将 USER 设为其他值
      const rootUser = process.env.USER
      process.env.USER = ''

      spawn(command, args, options)
        .on('data', message => emitter.emit('data', message))
        .on('error', error => {
          console.error(error)
          emitter.emit('error', redBright(`✘ ${MODULE_TYPE_MAP[type]} ${module.name} 安装失败！`))
          reject(error)
        })
        .on('close', async code => {
          // 还原 root
          process.env.USER = rootUser

          if (code !== 0) {
            console.error(code)
            emitter.emit('error', redBright(`✘ ${MODULE_TYPE_MAP[type]} ${module.name} 安装失败！`))
            reject(code)
            return
          }
          if (code === 0) {
            logger.info('install', module.name, module.package)

            // 插件/套件目录下放一个 info.json，描述基础信息
            await fse.writeJSON(`${moduleDir}/info.json`, { type, ...module }, { spaces: 2 })
            emitter.emit('data', greenBright(`✔ ${MODULE_TYPE_MAP[type]} ${module.name} 安装成功！`))
            resolve(undefined)
          }
        })
    })
  }

  // 插件/套件目录下放一个 info.json，描述基础信息
  const _options = { ...options, cwd: '' }
  await spawnCommand('mkdir', ['-p', moduleDir], _options)

  await withSpinner(
    `安装${MODULE_TYPE_MAP[type]} ${module.name} ${module.package}`,
    async (emitter: EventEmitter, params: any) => {
      await doit()
    }

  )(emitter, params)
}
