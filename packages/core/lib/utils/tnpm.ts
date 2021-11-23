import * as requestPromise from 'request-promise' // MO TODO => node-fetch
import logger from '../logger'
import { IPackage } from '../../types'
import fetch from 'node-fetch'
import { underline, red } from 'chalk'

/**
 * 根据 `name@version` 获取包名称和版本
 * "@ali/zs-gallery@1.0.0" -> {
 *    name: "@ali/zs-gallery",
 *    version: '1.0.0'
 * }
 */
export function getPkgInfo (name: string) {
  const exec = /^(@?[^@]+)(?:@([^@]+))?$/.exec(name)
  return exec ? { name: exec[1], version: exec[2] } : {}
}

/**
 * tnpm开放接口，查询项目的package包
 */
export async function getTnpmPackage (pkgName: string): Promise<IPackage | undefined> {
  // console.trace(red(`@getTnpmPackage - ${pkgName}`))
  const now = Date.now()
  const api = `http://registry.npm.alibaba-inc.com/${pkgName}/latest`
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
/** @deprecated */
export async function getTnpmPackageBackup (pkgName: string): Promise<IPackage> {
  const api = `http://registry.npm.alibaba-inc.com/${pkgName}/latest`
  return new Promise<IPackage>(async (resolve) => {
    try {
      const body = await requestPromise({
        url: api,
        rejectUnauthorized: false
      })
      const latestPkg = JSON.parse(body)
      // logger.info('getTnpmPackage', api)
      // logger.info(latestPkg)
      resolve(latestPkg)
    } catch (error) {
      logger.error(error.message)
      resolve({
        name: pkgName,
        version: undefined,
        description: undefined
      })
    }
  })
}

/**
 * 获取指定包的最新版本号
 * @param pkgName 包名
 */
const __VERSION_CACHE__ = {} // 版本缓存，一次命令运行期间，同一个包只查询一次。
export async function getLatestVersion (pkgName: string) {
  if (__VERSION_CACHE__[pkgName]) return __VERSION_CACHE__[pkgName]

  const pkg: any = await getTnpmPackage(pkgName)
  if (!pkg) return

  __VERSION_CACHE__[pkgName] = pkg.version
  return pkg.version
}
