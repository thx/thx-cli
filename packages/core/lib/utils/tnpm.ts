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
    ? `http://registry.npm.alibaba-inc.com/${pkgName}/latest`
    : `http://registry.npm.taobao.org/${pkgName}/latest`
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
