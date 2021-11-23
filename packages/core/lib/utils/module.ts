import { IKitMap, IModuleList, IKitInfo, IPluginInfo, IPluginMap, IPackage, IOutdatedPackage } from '../../types'
import { ALP_API_V1, LOG_GROUP, MM_HOME, MM_REMOTE_CACHE_FOLDER, RMX_HOME } from './constant'
import * as fse from 'fs-extra'
import logger from '../logger'
import fetch from 'node-fetch'
import { getLatestVersion, getTnpmPackage } from './tnpm'
import * as fs from 'fs'
import * as os from 'os'
import { readJSON, getAllFloderName } from './file'
import { join } from 'path'
import { bgBlueBright, redBright, underline } from 'chalk'
const semver = require('semver')

function array2map (array: Array<any>, key: string) {
  return array.reduce((acc, cur) => {
    acc[cur[key]] = cur
    return acc
  }, {})
}

/**
 * 检测套件/插件更新
 * @param type 类型：kit, plugin
 * @param name 套件/插件名
 * @param pkgName 套件/插件包名
 */
export async function checkUpdateModule (type: 'kit' | 'plugin', name: string, pkgName: string) {
  try {
    // MO TODO => 常量 + join()
    const localPkg: IPackage = await fse.readJSON(`${MM_HOME}/${type}/${name}/node_modules/${pkgName}/package.json`)
    const latestPkg = await getTnpmPackage(pkgName)

    // 如果套件&插件尚未发布，还在本地开发中，则跳过检测。
    if (!latestPkg || !latestPkg.version) return false

    if (semver.lt(localPkg.version, latestPkg.version)) {
      return {
        localPkg,
        latestPkg
      }
    } else {
      return false
    }
  } catch (error) {
    console.error(error)
    return false
  }
}

// 缓存模块数据到本地文件，有效期 1 小时
const CACHE_FETCH_MODULE_LIST_ENABLE = false // 是否开启文件缓存
const CACHE_FETCH_MODULE_LIST_MAX_AGE = 1000 * 60 * 60 * 24 // 相对有效时间，默认 24 小时
const CACHE_FETCH_MODULE_LIST_FILE = 'CACHE_FETCH_MODULE_LIST.json' // 缓存文件名
const CACHE_FETCH_MODULE_LIST_PATH = join(MM_REMOTE_CACHE_FOLDER, CACHE_FETCH_MODULE_LIST_FILE) // 文件文件路径

let CACHE_FETCH_MODULE_LIST
export async function fetchModuleList (): Promise<IModuleList> {
  // console.trace(redBright('@fetchModuleList'))
  if (CACHE_FETCH_MODULE_LIST) return CACHE_FETCH_MODULE_LIST

  // 如果在有效期内，则读取本地缓存文件
  if (CACHE_FETCH_MODULE_LIST_ENABLE && fse.existsSync(CACHE_FETCH_MODULE_LIST_PATH)) {
    const stat = fse.statSync(CACHE_FETCH_MODULE_LIST_PATH)
    if (Date.now() - stat.ctime.getTime() < CACHE_FETCH_MODULE_LIST_MAX_AGE) {
      return fse.readJSONSync(CACHE_FETCH_MODULE_LIST_PATH)
    }
  }

  const now = Date.now()
  try {
    return await fetch(ALP_API_V1, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(resp => resp.json())
      .then(json => json.data)
      .then(data => {
        const { kits, plugins } = data
        kits.forEach((kit: IKitInfo) => {
          if (!kit.type) kit.type = 'kit'
        })
        plugins.forEach((plugin: IPluginInfo) => {
          if (!plugin.type) plugin.type = 'plugin'
        })
        CACHE_FETCH_MODULE_LIST = data

        // 总是更新本地缓存文件
        if (!fse.existsSync(MM_REMOTE_CACHE_FOLDER)) fse.mkdirSync(MM_REMOTE_CACHE_FOLDER)
        fse.writeJSONSync(CACHE_FETCH_MODULE_LIST_PATH, CACHE_FETCH_MODULE_LIST, { spaces: 2 })

        return data
      })
  } catch (error) {
    console.log(redBright(`✘ 请求 ALP 套件&插件列表失败：${error}`))
  } finally {
    logger.debug('🚐', bgBlueBright.whiteBright.underline(ALP_API_V1), `${Date.now() - now}ms`)
  }
  return { kits: [], plugins: [] }
}

/**
 * 获取套件列表
 */
export async function getKitList () {
  const { kits } = await fetchModuleList()
  return kits
}

/**
 * 获取插件列表
 */
export async function getPluginList () {
  const { plugins } = await fetchModuleList()
  return plugins
}

// 获取配置在alp上的所有的套件、插件，同时获取本地套件、插件，标识上版本
// kits, plugins 可不传，不传则重新获取 alp 上配置
// getAllModules => getModuleList
/**
 * 获取配置在 ALP 上的所有的套件、插件，同时获取本地套件、插件，标识上版本。
 */
export async function getModuleList (): Promise<IModuleList> {
  const { kits, plugins } = await fetchModuleList()

  const installedKitMap: IKitMap = array2map(await getInstalledModuleList('kit'), 'name')
  kits.forEach(kit => {
    const installedKit = installedKitMap[kit.name]
    if (installedKit) {
      Object.assign(kit, {
        version: installedKit.version,
        latest: installedKit.latest
      })
    }
  })

  const installedPluginMap: IPluginMap = array2map(await getInstalledModuleList('plugin'), 'name')
  plugins.forEach(plugin => {
    const installedPlugin = installedPluginMap[plugin.name]
    if (installedPlugin) {
      Object.assign(plugin, {
        version: installedPlugin.version,
        latest: installedPlugin.latest
      })
    }
  })

  for (const module of [...kits, ...plugins]) {
    if (!module.latest) module.latest = await getLatestVersion(module.package)
  }

  return { kits, plugins }

  // return [
  //   { type: 'kit', list: Object.values(kitMap) },
  //   { type: 'plugin', list: Object.values(pluginMap) }
  // ]
  // for (const _module of modules) {
  //   let type = _module.type
  //   let allModules = type === 'kit' ? kits : plugins // 线上所有的可用的套件/插件

  //   _module.list = allModules.origin
  //   let localModules = await getInstalledModuleList(type) // 本地安装过的，包括开发中的套件/插件

  //   // //补上本地没安装的可用的套件/插件
  //   for (const lmod of localModules) {
  //     for (const mod of _module.list) {
  //       if (lmod.name === mod.name) {
  //         mod.localVersion = lmod.localVersion
  //         mod.latestVersion = lmod.latestVersion
  //         break
  //       }
  //     }
  //   }
  // }

  // return modules
}

// 获取本地已安装的套件/插件
// type: kit套件，plugin插件
// getLocalModules => getInstalledModuleList
const INSTALLED_MODULE_LIST_CACHE = {}

/**
 * 获取本地已安装的套件/插件
 * @param type
 */
export async function getInstalledModuleList<T = IKitInfo | IPluginInfo> (type: 'kit' | 'plugin'): Promise<Array<T>> {
  // if (INSTALLED_MODULE_LIST_CACHE[type]) return INSTALLED_MODULE_LIST_CACHE[type]

  const now = Date.now()
  logger.debug('⌚️ getInstalledModuleList', type)

  const typeDir = `${RMX_HOME}/${type}`
  const moduleDirs = await fse.readdir(typeDir)
  // try {
  //   // MO 读取目录下的文件（夹）
  //   moduleDirs = await fse.readdir(typeDir)
  // } catch (error) { }

  const installed = []
  for (const moduleDir of moduleDirs) {
    try {
      // MO react/info.json
      const moduleInfoPath = `${typeDir}/${moduleDir}/info.json`
      if (!fse.existsSync(moduleInfoPath)) continue
      const info: IKitInfo | IPluginInfo = await fse.readJSON(moduleInfoPath)
      // 本地安装版本 kit/react/node_modules/@ali/mm-kit-react
      const pkg = await fse.readJSON(`${typeDir}/${moduleDir}/node_modules/${info.package}/package.json`)
      info.version = pkg.version
      // 线上最新版本
      info.latest = await getLatestVersion(info.package)
      // 有更新版本，给个标识 updatable
      if (info.version && info.latest && semver.lt(info.version, info.latest)) {
        info.updatable = true
      }
      // TODO 1.x 兼容 0.x 格式
      if (!info.package && info.value) {
        console.warn(`模块 ${info.name} ${info.value} 缺少 package 配置，请尽快升级到最新版本！`, info)
        info.package = info.value
        // TODO 1.x 修复 0.x 格式
        await fse.writeJSON(moduleInfoPath, info, { spaces: 2 })
      }
      if (info.type === 'plugin' && !info.command) {
        console.warn(`插件 ${info.name} 缺少 command 配置，请尽快升级到最新版本！`, info.package)
        info.command = {
          name: info.name,
          alias: info.alias || ''
        }
        // TODO 1.x 修复 0.x 格式
        await fse.writeJSON(moduleInfoPath, info, { spaces: 2 })
      }
      installed.push(info)
    } catch (error) {
      logger.error(moduleDir, error)
    }
  }

  logger.debug('⌚️ getInstalledModuleList', type, `${Date.now() - now}ms`)

  INSTALLED_MODULE_LIST_CACHE[type] = installed
  return installed
}
/**
 * 获取本地已安装的套件
 */
export async function getInstalledKitList (): Promise<Array<IKitInfo>> {
  const kitList = await getInstalledModuleList<IKitInfo>('kit')
  return kitList
}

/**
 * 获取本地已安装的插件
 */
export async function getInstalledPluginList (): Promise<Array<IPluginInfo>> {
  const pluginList = await getInstalledModuleList<IPluginInfo>('plugin')
  return pluginList
}

/**
 * 获取所有插件的资源
 */
// export function getPluginAssets () {
//   const assets = []
//   const plugins = getAllFloderName(join(os.homedir(), '.rmx/plugin'))
//   plugins.forEach(plugin => {
//     const extraPluginPath = join(os.homedir(), `.rmx/plugin/${plugin}/node_modules/@ali/rmx-plugin-${plugin}/web/dist/index.js`)
//     if (fs.existsSync(extraPluginPath)) {
//       assets.push(`/assets/plugin/${plugin}/web/dist`)
//     }
//   })
//   return plugins
// }
/**
 * 获取套件和插件的资源
 * @deprecated
 */
export function getKitPluginAssets (config) {
  const assets = []
  if (config && config.kit) {
    const extraKitPath = join(os.homedir(), `.rmx/kit/${config.kit}/node_modules/@ali/rmx-kit-${config.kit}/web/dist/index.js`)
    if (fs.existsSync(extraKitPath)) {
      assets.push(`/assets/kit/${config.kit}/web/dist`)
    }
  }
  if (config && config.plugin) {
    config.plugin.forEach(plugin => {
      const extraPluginPath = join(os.homedir(), `.rmx/plugin/${plugin}/node_modules/@ali/rmx-plugin-${plugin}/web/dist/index.js`)
      if (fs.existsSync(extraPluginPath)) {
        assets.push(`/assets/plugin/${plugin}/web/dist`)
      }
    })
  }
  return assets
}
/**
 * 获取所有插件的路由
 * @deprecated
 */
export function getPluginRoutes () {
  const routes = []
  const plugins = getAllFloderName(join(os.homedir(), '.rmx/plugins'))
  plugins.forEach(plugin => {
    const configPath = join(os.homedir(), `.rmx/plugin/${plugin}/node_modules/@ali/rmx-plugin-${plugin}/config.json`)
    if (fs.existsSync(configPath)) {
      const config = readJSON(configPath)
      if (config && config.routes) {
        routes.push({
          dir: join(os.homedir(), `.rmx/plugin/${plugin}/node_modules/@ali/rmx-plugin-${plugin}`),
          routes: config.routes
        })
      }
    }
  })
  return routes
}
/**
     * 获取套件和插件的路由
     */
export function getKitPluginRoutes (config) {
  const routes = []
  if (config && config.kit) {
    const configKitPath = join(os.homedir(), `.rmx/kit/${config.kit}/node_modules/@ali/rmx-kit-${config.kit}/config.json`)
    if (fs.existsSync(configKitPath)) {
      const kitConfig = readJSON(configKitPath)
      if (kitConfig && kitConfig.routes) {
        routes.push({
          dir: join(os.homedir(), `.rmx/kit/${config.kit}/node_modules/@ali/rmx-kit-${config.kit}`),
          routes: kitConfig.routes
        })
      }
    }
  }
  if (config && config.plugin) {
    config.plugin.forEach(plugin => {
      const configPluginPath = join(os.homedir(), `.rmx/plugin/${plugin}/node_modules/@ali/rmx-plugin-${plugin}/config.json`)
      if (fs.existsSync(configPluginPath)) {
        const pluginConfig = readJSON(configPluginPath)
        if (pluginConfig && pluginConfig.routes) {
          routes.push({
            dir: join(os.homedir(), `.rmx/plugin/${plugin}/node_modules/@ali/rmx-plugin-${plugin}`),
            routes: pluginConfig.routes
          })
        }
      }
    })
  }
  return routes
}

/**
  * 读取获取kit安装路径
  *
  * @param {String} file
  */
// MO kit => kitCode
export function getKitDir (kitName) {
  console.trace('不推荐继续使用 `getKitDir(kit)`')
  // MO name => pkgName
  const name = `@ali/mm-kit-${kitName}`
  const kitDir = join(RMX_HOME, `kit/${kitName}`)
  const dir = join(kitDir, 'node_modules', name)

  // MO eg .rmx/kit/react/node_modules/@ali/rmx-kit-react
  console.log(LOG_GROUP.KIT, 'dir', dir)
  return dir
}

/**
 * 获取套件信息
 * @param kitName @type string
 * @returns @type IKitInfo
 */
export async function getKit (kitName: string): Promise<IKitInfo> {
  if (!kitName) return

  let result: IKitInfo = null

  // 先从本地找
  const installed = await getInstalledModuleList<IKitInfo>('kit')
  result = installed.find(item => item.name === kitName)
  if (result) return result

  // 再从线上找
  const remote = await getKitList()
  result = remote.find(item => item.name === kitName)
  if (result) return result

  return result
}

/**
 * 获取插件信息
 * @param kitName @type string
 * @returns @type IKitInfo
 */
export async function getPlugin (pluginName: string): Promise<IPluginInfo> {
  if (!pluginName) return

  let result: IPluginInfo = null

  // 先从本地找
  const installed = await getInstalledModuleList<IPluginInfo>('plugin')
  result = installed.find(item => item.name === pluginName)
  if (result) return result

  // 再从线上找
  const remote = await getPluginList()
  result = remote.find(item => item.name === pluginName)
  if (result) return result

  return result
}

/**
 * 从所有套件列表里获取当前套件
 * @param kitName
 * @deprecated MO FIXED => utils/module, getCurrentKit => getKit
 */
export async function getCurrentKit (kitName: string): Promise<IKitInfo> {
  console.trace('@deprecated', 'getCurrentKit(kitName) => getKit(kitName)')

  if (!kitName) {
    return
  }

  const localKits = await getInstalledModuleList('kit')
  let kitObj // MO info.json

  // 先从本地找
  for (const localKit of localKits) {
    if (kitName === localKit.name) {
      kitObj = localKit
      break
    }
  }

  // 从线上找
  if (!kitObj) {
    const { kits } = await getModuleList()
    for (const kit of kits) {
      if (kit.name === kitName) {
        kitObj = kit
        break
      }
    }
  }

  if (!kitObj) return

  if (!kitObj.porotocal && !kitObj.title && !kitObj.package) {
    const { type = 'kit', name, value } = kitObj
    return {
      ...kitObj,
      porotocal: '1.x',
      type,
      name,
      title: name,
      package: value
    }
  }

  return kitObj
}

/**
 * 获取本地版本
 * @param cwd
 * @param pkgName
 */
export function getLocalVersion (cwd, pkgName) {
  const now = Date.now()
  const pkgPath = join(cwd, 'node_modules', pkgName, 'package.json')
  let pkg: IPackage
  try {
    pkg = require(pkgPath)
    return pkg.version
  } catch (error) {
    console.error(error)
  } finally {
    logger.debug('📄', 'getLocalVersion', underline(pkgPath), pkg?.version, `${Date.now() - now}ms`)
  }
}

/**
 * 需要更新的包
 * @param cwd
 * @param pkgNames
 */
export async function getOutdatedPkgs (cwd: string, pkgNames: Array<string>): Promise<Array<IOutdatedPackage>> {
  const latestPkgs: Array<IPackage> = await Promise.all(
    pkgNames.map(pkgName => getTnpmPackage(pkgName))
  )
  return latestPkgs
    .map(latestPkg => {
      const { version: latestVersion } = latestPkg || {}
      const localVersion = getLocalVersion(cwd, latestPkg?.name)

      if (!localVersion || !latestVersion) return
      if (semver.gte(localVersion, latestVersion)) return

      return {
        name: latestPkg?.name,
        localVersion,
        latestVersion
      }
    })
    .filter(item => !!item)
}
