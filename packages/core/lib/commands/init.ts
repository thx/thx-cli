/**
 * 项目初始化命令
 */
import { tmpdir } from 'os'
import { join } from 'path'

import {
  MM_HOME,
  setAppPackage,
  spawnCommand,
  spawn,
  withSpinner,
  setAppRCPart,
  getKit
} from '../utils'

import * as fse from 'fs-extra'
import { EventEmitter } from 'events'
import { greenBright } from 'chalk'
import { IGitLabGroup, ICreateAppInfo } from '../../types/index.d'
import simpleGit from 'simple-git'
import logger from '../logger'

/**
 * clone 已创建好的 gitlab 项目到项目目录
 */
async function cloneTemplate(emitter: EventEmitter, appInfo: ICreateAppInfo) {
  await withSpinner(
    '克隆脚手架',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      const git = simpleGit(appInfo.cwd)
      const appPath = `${appInfo.cwd}/${appInfo.app}`
      logger.info(`${appInfo.scaffold} => ${appInfo.cwd}/${appInfo.app}`)
      if (appInfo.directory) {
        const tmpAppPath = join(tmpdir(), appInfo.app) // 临时目录/应用名称
        const tmpAppDirectory = join(tmpAppPath, appInfo.directory) // 临时目录/应用名称/子目录

        logger.info(`${appInfo.scaffold} => ${tmpAppPath}`)
        await git.clone(appInfo.scaffold, tmpAppPath)
        if (appInfo.branch) {
          logger.info(`git checkout ${appInfo.branch}`)
          await git.cwd(tmpAppPath)
          await git.checkout(appInfo.branch)
        }

        logger.info(`${tmpAppDirectory} => ${appPath}`)
        await fse.move(tmpAppDirectory, appPath, { overwrite: true })

        logger.info(`remove ${tmpAppPath}`)
        await fse.remove(tmpAppPath)
      } else {
        await git.clone(appInfo.scaffold, appPath)
        if (appInfo.branch) {
          logger.info(`git checkout ${appInfo.branch}`)
          await git.cwd(appPath)
          await git.checkout(appInfo.branch)
        }
      }
    },
    error => {
      logger.error(error)
      console.error(
        `您没有该脚手架仓库访问权限或该仓库地址不存在，仓库地址：${appInfo.scaffold}`
      )
    }
  )(emitter, appInfo)
}

async function createLocalApp(
  emitter: EventEmitter,
  appInfo: ICreateAppInfo
  // { rapProject, iconfontProject, defInfo, gitProject, spma, chartparkProject }
) {
  const git = simpleGit(appInfo.cwd)
  const appPath = `${appInfo.cwd}/${appInfo.app}`

  // 1
  // const spinner = ora('创建本地项目...').start()
  emitter.emit('data', greenBright('ⓘ 创建本地项目'))
  emitter.emit('data', appPath)
  await fse.ensureDir(appPath) // 创建项目目录
  await cloneTemplate(emitter, appInfo)

  // 2
  await spawnCommand('rm', ['-rf', '.git'], { cwd: appPath })
  // await withSpinner(
  //   '设置远程仓库',
  //   async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
  //     await spawnCommand('rm', ['-rf', '.git'], { cwd: appPath })
  //     await git.cwd(appPath)
  //     await git.init()
  //     // await git.addRemote('origin', gitProject?.ssh_url_to_repo) // eslint-disable-line camelcase
  //   }
  // )(emitter, appInfo)

  // 3 设置项目相关配置信息
  await withSpinner(
    '更新应用 .rmxrc 配置',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      // emitter.emit('data', greenBright('ⓘ 将各平台id写入本地rmxConfig中'))
      const pkgPath = `${appPath}/package.json`
      // 往package.json里写入项目gitlab仓库地址
      setAppPackage(
        'repository',
        {
          type: 'git'
          // url: gitProject?.ssh_url_to_repo // eslint-disable-line camelcase
        },
        pkgPath
      )
      setAppPackage('name', appInfo.app, pkgPath)

      // 写入套件名称
      setAppRCPart('kit', appInfo.kit, appPath)
    }
  )(emitter, appInfo)
}

// async function gitCommit(emitter: EventEmitter, appInfo: ICreateAppInfo) {
//   if (appInfo.gitlab === false) return

//   await withSpinner(
//     '提交本地代码',
//     async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
//       const git = simpleGit(`${appInfo.cwd}/${appInfo.app}`)
//       await git.add('-A')
//       await git.commit('first commit by @ali/mm-cli', { '--no-verify': null })
//       // await git.push('origin', 'master')
//     }
//   )(emitter, appInfo)
// }

async function installDependencies(
  emitter: EventEmitter,
  appInfo: ICreateAppInfo
) {
  if (appInfo.install === false) return
  await withSpinner(
    '安装应用依赖',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
      const args = ['install', '--color']
      const options = { cwd: `${appInfo.cwd}/${appInfo.app}` }
      return new Promise((resolve, reject) => {
        spawn(command, args, options)
          .on('data', message => {
            emitter.emit('data', message)
          })
          .on('error', error => {
            emitter.emit('error', error)
            reject(error)
          })
          .on('close', async code => {
            // MO TODO 待测试 resp => code
            // if (typeof resp === 'object') {
            //   logger.debug(__filename)
            //   logger.warn(redBright('@deprecated 请不要在 close 事件中返回一个对象'), resp)
            // }
            if (code === 0) resolve(code)
            else reject(code)
          })
      })
    }
  )(emitter, appInfo)
}

export default async function init(
  appInfo: ICreateAppInfo,
  emitter: EventEmitter
) {
  const { kit: kitName } = appInfo
  const kitInfo = await getKit(kitName)
  const { package: kitPackage } = kitInfo
  let kitCommandListModule = require(`${MM_HOME}/kit/${appInfo.kit}/node_modules/${kitPackage}/dist/commands`)
  kitCommandListModule = kitCommandListModule.__esModule
    ? kitCommandListModule.default
    : kitCommandListModule
  const kitCommandList = await kitCommandListModule()
  const kitInitCommand = kitCommandList.find(
    commandConfig =>
      commandConfig.name === 'init' || commandConfig.command === 'init'
  )

  // init 命令的 __before__ 方法先执行
  try {
    if (kitInitCommand.__before__) {
      await kitInitCommand.__before__(appInfo, msg => {
        emitter.emit('data', msg)
      })
    }
  } catch (error) {
    emitter.emit('error', error)
  }

  // 获取 gitlab token
  const projectPath = `${appInfo.cwd}/${appInfo.app}`
  if (await fse.pathExists(projectPath)) {
    return emitter.emit(
      'error',
      `初始化失败，当前目录下已存在同名文件夹 ${projectPath}`
    )
  }

  // 关联项目的信息存入 appInfo
  appInfo.snapshoot = {
    ...(appInfo.snapshoot || {})
  }

  await createLocalApp(emitter, appInfo)
  // await gitCommit(emitter, appInfo)
  await installDependencies(emitter, appInfo)

  // init 命令的 __after__ 后执行
  try {
    if (kitInitCommand.__after__) {
      await kitInitCommand.__after__(appInfo, emitter)
    }
  } catch (error) {
    return emitter.emit('error', error)
  }
}
