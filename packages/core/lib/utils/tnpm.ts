import logger from '../logger'
import { IPackage } from '../../types'
import fetch from 'node-fetch'
import { underline, grey, greenBright, cyanBright } from 'chalk'
import * as utils from './index'
import * as semver from 'semver'
import * as inquirer from 'inquirer'
import * as path from 'path'
import * as fse from 'fs-extra'
import simpleGit from 'simple-git'

/**
 * 根据 `name@version` 获取包名称和版本
 * "@ali/zs-gallery@1.0.0" -> {
 *    name: "@ali/zs-gallery",
 *    version: '1.0.0'
 * }
 */
export function getPkgInfo(name: string) {
  const exec = /^(@?[^@]+)(?:@([^@]+))?$/.exec(name)
  return exec ? { name: exec[1], version: exec[2] } : {}
}

/**
 * tnpm开放接口，查询项目的package包
 */
export async function getTnpmPackage(
  pkgName: string
): Promise<IPackage | undefined> {
  
  const now = Date.now()
  const api = /^@ali\//.test(pkgName) // 区分内外网的npm包，用不同的api查询
    ? `https://registry.anpm.alibaba-inc.com/${pkgName}/latest`
    : `https://registry.npmmirror.com/${pkgName}/latest`
  let pkg: IPackage
  try {
    pkg = await fetch(api, {}).then(resp => resp.json())
    return pkg
  } catch (error) {
    console.error(error)
    logger.error(error.message)
  } finally {
    logger.debug('🚐', underline(api), pkg?.version, `${Date.now() - now}ms`)
  }
}

/**
 * 获取指定包的最新版本号
 * @param pkgName 包名
 */
const __VERSION_CACHE__ = {} // 版本缓存，一次命令运行期间，同一个包只查询一次。
export async function getLatestVersion(pkgName: string) {
  if (__VERSION_CACHE__[pkgName]) return __VERSION_CACHE__[pkgName]

  const pkg: any = await getTnpmPackage(pkgName)
  if (!pkg) return

  __VERSION_CACHE__[pkgName] = pkg.version
  return pkg.version
}

/**
 * 发布 npm(tnpm) 包
 */
export async function npmPublish(branch, npmClient) {
  const appPath = (await utils.getAppPath()) ?? ''
  const appPkg = await utils.getAppPkg(appPath)
  const { version } = appPkg

  const majorIncVersion = semver.inc(version, 'major')
  const minorIncVersion = semver.inc(version, 'minor')
  const patchIncVersion = semver.inc(version, 'patch')

  const incrementTypes = [
    {
      name: `patch ${grey(`[小版本升级: ${cyanBright(patchIncVersion)}]`)}`,
      value: 'patch'
    },
    {
      name: `minor ${grey(`[中间版本升级: ${cyanBright(minorIncVersion)}]`)}`,
      value: 'minor'
    },
    {
      name: `major ${grey(`[大版本升级: ${cyanBright(majorIncVersion)}]`)}`,
      value: 'major'
    }
  ]
  const questions = [
    {
      type: 'list',
      name: 'version',
      message: `【请选择版本升级方式, 当前版本: ${greenBright(version)}】:`,
      choices: incrementTypes
    }
  ]

  // 让用户选择升级方式
  const answers = await inquirer.prompt(questions)
  appPkg.version = semver.inc(version, answers.version) ?? ''

  // 将新版本写入package.json
  const pkgFile = path.resolve(appPath, './package.json')
  await fse.writeJson(pkgFile, appPkg, {
    spaces: 2
  })

  try {
    // 发布到 npm/tnpm
    await spawnNpmPublishPromise(npmClient)
  } catch (error) {
    // npm 发布失败将 version 还原成老的版本
    appPkg.version = version
    await fse.writeJson(pkgFile, appPkg, {
      spaces: 2
    })
    throw error
  }

  // 提交下代码
  const git = simpleGit()
  await git.add('-A')
  await git.commit('version update, auto commit by @ali/mm-cli', {
    '--no-verify': null
  })
  await git.push('origin', branch)
}

export function spawnNpmPublishPromise(npmClient) {
  return new Promise((resolve, reject) => {
    const emitter = utils.spawn(npmClient, ['publish'], {})

    emitter.on('data', msg => {
      // 输出如果包含 "npm ERR! 403" 代表 npm 发包失败
      if (/npm\s*ERR!\s*403/.test(msg)) {
        reject(new Error(msg))
      } else {
        return console.log(msg)
      }
    })

    emitter.on('error', error => {
      return reject(new Error(error))
    })

    emitter.on('close', errorOrCode => {
      if (typeof errorOrCode === 'number') {
        return resolve(null)
      } else {
        return reject(new Error(errorOrCode))
      }
    })
  })
}
