import * as fs from 'fs'
import * as fse from 'fs-extra'
import { basename, join } from 'path'
import * as showdown from 'showdown'
import * as crypto from 'crypto'
import { redBright } from 'chalk'
import { IApp, IAppRC, IKitInfo, IPackage, IRMXConfig } from '../../types'
import { MM_RC_FILE, MM_RC_JS, MM_RC_JSON } from './constant'
import { getKitDir, getModuleList } from './module'
import { getExistFile, readJSON } from './file'
import { getRmxConfig, setRmxConfig } from './mm'
import { getGitInfo } from './git'
import { withSpinner } from './printf'
import { EventEmitter } from 'events'
import { spawn, SpawnOptions } from 'child_process'
import * as JSON5 from 'json5'

/**
 * 获取应用 RC 配置
 * @param appPath 应用目录
 */
export function getAppRC (appPath: string): IAppRC | undefined {
  const config = getAppConfig(appPath)
  if (config) return config

  const pkg = getAppPkg(appPath)
  if (pkg && pkg.rmxConfig) return pkg.rmxConfig
}

/**
 * 设置应用 RC 配置
 * @param appPath @type string 应用目录
 * @param appRC @type IAppRC 应用 RC 配置
 * MO FIXED 兼容其他 rc 文件
 */
export async function setAppRC (appPath: string, appRC: IAppRC | Partial<IAppRC>) { // eslint-disable-line no-undef
  // 优先级 MM_RC_JSON > MM_RC_FILE
  const appRCJSONPath = join(appPath, MM_RC_JSON)
  const appRCFilePath = join(appPath, MM_RC_FILE)
  const appRCPath = fs.existsSync(appRCJSONPath) ? appRCJSONPath : appRCFilePath
  // const appRCPath = join(appPath, '.rmxrc')
  fse.outputFileSync(appRCPath, JSON.stringify(appRC, null, 2), 'utf8')
}
/**
 * 设置应用 RC 配置
 * @param key
 * @param value
 * @param appPath @type string 应用目录
 * MO FIXED 兼容其他 rc 文件
 */
export async function setAppRCPart (key: string, value: any, appPath: string) {
  const appRC = getAppRC(appPath) || {}
  appRC[key] = value
  await setAppRC(appPath, appRC)
  // const appRCPath = join(appPath, MM_RC_FILE)
  // fse.outputFileSync(appRCPath, JSON.stringify(appRC, null, 2), 'utf8')
}

// 读取package.json，更改rmxConfig配置
// 同时写入.rmxrc配置
/**
 * 设置应用 RC 配置
 * @param key
 * @param value
 * @param packageFilePath
 * @deprecated
 */
export function setAppRmxConfig (key, value, packageFilePath) {
  console.trace('@deprecated setAppRmxConfig(key, value, pkgPath) => setAppRCPart(key, value, appPath)')
  const pkg = fse.readJsonSync(packageFilePath)
  const rmxrcPath = packageFilePath.replace('/package.json', '/.rmxrc')

  // package.json
  pkg.rmxConfig = pkg.rmxConfig || {}
  pkg.rmxConfig[key] = value
  fse.outputFileSync(packageFilePath, JSON.stringify(pkg, null, 4), 'utf8')

  // 兼容.rmxrc配置文件
  let rmxrc
  try {
    rmxrc = fse.readJsonSync(rmxrcPath)
  } catch (error) { }
  rmxrc = rmxrc || {}
  rmxrc[key] = value
  fse.outputFileSync(rmxrcPath, JSON.stringify(rmxrc, null, 4), 'utf8')
}

/** @deprecated */
export async function getAppRmxConfig (appPath = process.cwd()) {
  const appRmxPath = join(appPath, '.rmxrc')
  const appPkgPath = join(appPath, 'package.json')
  const appRmx = fs.existsSync(appRmxPath) ? readJSON(appRmxPath) : undefined
  const appPkg = fs.existsSync(appPkgPath) ? readJSON(appPkgPath) : undefined
  return appRmx || appPkg?.rmxConfig || {}
}

/** 获取应用的 package.json */
export function getAppPkg (appPath: string = process.cwd()): IPackage {
  let appPkg: any = {}

  // 递归往上查找所有目录，直到找到有package.json的目录
  // MO TODO => getAppPath()
  // let path = await getExistFile('package.json')
  // if (path) {
  //   appPath = path.join('/')
  // }

  const appPkgPath = join(appPath, 'package.json')
  if (fse.pathExistsSync(appPkgPath)) {
    appPkg = readJSON(appPkgPath)
    // 不再兼容 pkg.rmxrc
    // const appRCPath = join(appPath, '.rmxrc')
    // if (appPkg && fs.existsSync(appRCPath)) {
    //   appPkg.rmxrc = appPkg.rmxConfig = readJSON(appRCPath)
    // }
  }
  return appPkg
}

export function setAppPkg (appPath: string, pkg: IPackage) {
  const appPkgPath = join(appPath, 'package.json')
  fse.outputFileSync(appPkgPath, JSON.stringify(pkg, null, 2), 'utf8')
}

/**
 * 获取应用套件信息
 * @param appPah 应用目录
 */
export async function getAppKit (appPah = process.cwd()): Promise<IKitInfo> {
  const appRC: IAppRC = await getAppRC(appPah)
  const { kit: kitName } = appRC
  const { kits } = await getModuleList()
  const kitInfo = kits.find(kit => kit.name === kitName)
  return kitInfo
}

// 获取项目的 .rmxrc，兼容 JSON、Module 格式。
/** @deprecated */
export function getAppConfig (appPath = process.cwd()): IAppRC | undefined {
  // 读取 RC 配置时，优先读取 .rmxrc.js，因为可能同时存在 .rmxrc 和 .rmxrc.js
  // .rmxrc.js JS Module
  try {
    if (fse.existsSync(join(appPath, MM_RC_JS))) {
      const rc = require(join(appPath, MM_RC_JS))
      return rc.__esModule ? rc.default : rc
    }
  } catch (error) {
    // 输出错误日志，用于辅助判断 MM_RC_JS 是否正常。
    console.error(error)
  }

  // .rmxrc JSON
  try {
    return fse.readJSONSync(join(appPath, MM_RC_FILE))
  } catch (error) { }

  // .rmxrc JSON for Humans
  try {
    return JSON5.parse(fse.readFileSync(join(appPath, MM_RC_FILE), 'utf8'))
  } catch (error) { }

  // .rmxrc JS Module
  try {
    const rc = require(join(appPath, MM_RC_FILE))
    return rc.__esModule ? rc.default : rc
  } catch (error) { }

  // .rmxrc.json JSON
  try {
    return fse.readJSONSync(join(appPath, MM_RC_JSON))
  } catch (error) { }

  // .rmxrc.json JSON for Humans
  try {
    return JSON5.parse(fse.readFileSync(join(appPath, MM_RC_JSON), 'utf8'))
  } catch (error) { }
}

/** 获取应用路径 */
export function getAppPath (cwd: string = process.cwd()): string | undefined {
  const parts = cwd.split('/')
  while (parts.length) {
    const path = [...parts, 'package.json'].join('/')
    if (fse.pathExistsSync(path)) {
      return parts.join('/')
    }
    parts.pop()
  }
}

/**
 * 检测是否位于应用的根目录下，通过检测是否有 package.json 文件来判断
 * @deprecated => isAppPath
 */
export async function isInAppRoot (appPath = process.cwd()) {
  const result = await fse.pathExists(`${appPath}/package.json`)
  return result
}

/**
 * @deprecated => setAppPkg(appPath, pkg)
 */
export function setAppPackage (key: string, value: any, appPkgPath: string) {
  const pkg = fse.readJsonSync(appPkgPath)
  pkg[key] = value
  fse.outputFileSync(appPkgPath, JSON.stringify(pkg, null, 4), 'utf8')
}

/**
 * 获取项目根目录path，根据根目录下的package.json文件来判断
 * @return {[type]} [description]
 */
export async function getRootPath (name?, cwd?) {
  console.trace('@deprecated getRootPath (name?, cwd?) => getAppPath(cwd?)')
  // init 的时候还没进到项目目录中，需要传项目目录名进来
  const gitDir = name === undefined ? 'package.json' : name + '/' + 'package.json'
  const path = await getExistFile(gitDir, cwd)
  if (path) {
    return path
  } else {
    console.log(redBright('\n  ✘ 请在项目的根目录下执行本命令\n'))
    process.exit(0)
  }
}

/**
 * 根据应用 ID 获取应用信息
 * @param appId 应用 ID
 */
export function getAppInfoById (appId: string) {
  const config = getRmxConfig()
  return config.apps.find(({ id }) => {
    return id === appId
  })
}

/**
   * 获取套件
   */
// MO TODO 循环依赖
// MO getKit => getAppKit, dir => appDir
export function __getAppKitBackup (appPath: string) {
  // MO 变量的名称与值不匹配 typeInfo => appRmxConfig
  let curKit, typeInfo
  // MO curRmxPath => appRmxPath, curPkgPath => appPkgPath
  const curRmxPath = join(appPath, '.rmxrc')
  const curPkgPath = join(appPath, 'package.json')
  // MO 先尝试从 .rmxrc 中读取套件配置信息
  if (fs.existsSync(curRmxPath)) {
    // MO 为什么要有 this？
    typeInfo = readJSON(curRmxPath)
  }
  // MO 再尝试从 package.json 中读取套件配置信息
  // MO !typeInfo 的含义是不存在 curRmxPath
  if (!typeInfo && fs.existsSync(curPkgPath)) {
    const curPkg = readJSON(curPkgPath)
    // MO .rmxConfig => .rmx
    typeInfo = curPkg.rmxConfig
  }
  if (typeInfo && typeInfo.kit) {
    // MO 通过套件 code 获取套件安装目录
    // MO path 和 dir 混用，如果是目录，统一用 dir，如果是文件，统一用 path。
    const extraKitsPath = getKitDir(typeInfo.kit)
    try {
      if (fs.existsSync(extraKitsPath)) {
        curKit = {
          name: typeInfo.kit,
          dir: extraKitsPath
          // fns: require(join(extraKitsPath, 'index.js'))
        }
        // MO 路径的拼接不应该这么分散
        // MO 尝试获取套件的配置信息
        const kitConfigPath = join(extraKitsPath, 'config.json')
        if (fs.existsSync(kitConfigPath)) {
          curKit.config = readJSON(kitConfigPath)
        }
      }
    } catch (err) {
      // ignore
    }
  }
  // MO 应该明确返回 undefined
  return curKit
}
// export function getKit (dir) {
//   console.trace('不推荐继续使用 `getKit(dir)`，请改用 `__getAppKit(appPath)`')
//   return getAppKit(dir)
// }

/**
   * 获取项目名称
   */
// MO FIXED getProjectsName => generateProjectId
export function generateAppId (appPath, apps: Array<IApp> = []) {
  // 增加 ID 以免项目重名
  const appIdList = apps.map(app => app.id)
  const appName = basename(appPath)
  const appNameIndex = appIdList.indexOf(appName)
  // 如无重名，则使用应用名，观感更好。
  if (appNameIndex === -1) return appName
  // 如有重名，则添加 hash 以区分。
  const hash = crypto.createHash('md5').update(appPath).digest('hex')
  return appName + '-' + hash.slice(0, 7)
}

/**
 * 获取应用列表
 */
export async function getApps (): Promise<Array<IApp>> {
  // MO 诡异的 me？
  // MO 应该直接调用 getRmxConfig()
  const config: IRMXConfig = getRmxConfig()
  const apps: Array<IApp> = []
  for (const item of config.apps) {
    const appPkg = await getAppPkg(item.path)
    const appRC = getAppRC(item.path)
    const repository = getGitInfo(item.path) || {}
    // console.log(item.path, appPkg)
    if (appPkg) {
      apps.push({
        // index, // MO 怎么消费 index？
        id: item.id,
        name: appPkg.name,
        path: item.path,
        description: appPkg.description,
        rmxrc: appRC,
        package: appPkg,
        repository
      })
    }
  }
  // apps.filter(item => !!item)

  // MO 如果找不到对应的 package.json，则剔除无效的 project
  if (apps.length !== config.apps.length) {
    config.apps = apps.map(item => {
      return {
        path: item.path,
        id: item.id
      }
    })
    setRmxConfig(config)
  }

  return apps
}
export async function getApp (appId) {
  const apps = await getApps()
  return apps.find(app => app.id === appId)
}

// export function getProjects (): Array<IProject> {
//   console.trace('不推荐继续使用 `getProjects()`，请改用 `getApps()`')
//   return getApps()
// }

/**
 * 增加应用
 */
// MO 工程 => 应用 Application
// MO 添加 `应用地址 projectPath` 到 `.mm/config.json`
// MO FIXED addProject => addAppToRMXConfig
// MO FIXED inProject => existed | index
// MO FIXED find => findIndex，因为并没有消费项目信息
// MO FIXED getProjectsName => generateProjectId
export function addAppToRMXConfig (appPath: string) {
  // MO FIXED 工具函数不应该有 this。
  const config = getRmxConfig()
  const { apps } = config
  let nextApp = apps.find(app => app.path === appPath)
  if (!nextApp) {
    nextApp = {
      id: generateAppId(appPath, apps),
      path: appPath
    }
    apps.push(nextApp)
    setRmxConfig(config)
  }
  return nextApp
}
/**
 * 移除工程
 */
// MO FIXED removeProject => removeAppFromRMXConfig
export function removeAppFromRMXConfig (appPath: string) {
  const config = getRmxConfig()
  const prevLength = config.apps.length
  config.apps = config.apps.filter(app => app.path !== appPath)
  setRmxConfig(config)
  return prevLength !== config.apps.length
}
export function removeAppFromRMXConfigById (appId: string) {
  const config = getRmxConfig()
  const prevLength = config.apps.length
  config.apps = config.apps.filter(app => app.id !== appId)
  setRmxConfig(config)
  return prevLength !== config.apps.length
}

/**
   * 读取 README.md，并转换为 HTML
   * @param {String} file
   */
export function getReadmeHtml (file) {
  const converter = new showdown.Converter()
  let html = ''
  try {
    const text = fs.readFileSync(file, 'utf8')
    if (text) {
      html = converter.makeHtml(text)
    }
  } catch (error) {
    console.error(error)
    console.error(`读取 ${file} 失败`)
    return ''
  }
  return html
}

/**
 * 判断目录下有没有node_modules，如果没有则先执行npm install安装包
 */
export async function checkDependencies (command = 'yarn', args = ['install', '--color'], options = {}) {
  const appPath = await getAppPath()
  const nodeModulesPath = join(appPath, 'node_modules')
  if (fs.existsSync(nodeModulesPath)) return

  const emitter = new EventEmitter()
  await withSpinner(
    '安装应用依赖',
    async (emitter: EventEmitter, appPath: string) => {
      // const command = process.platform === 'win32' ? 'tnpm.cmd' : 'tnpm'
      // const command = 'yarn'
      // const args = ['install', '--color']
      const nextOptions: SpawnOptions = {
        cwd: appPath,
        ...options
      }
      if (process.env.SUDO_GID) {
        nextOptions.gid = parseInt(process.env.SUDO_GID, 10)
      }
      if (process.env.SUDO_UID) {
        nextOptions.uid = parseInt(process.env.SUDO_UID, 10)
      }
      return new Promise((resolve, reject) => {
        spawn(command, args, nextOptions)
          .on('data', message => {
            emitter.emit('data', message)
          })
          .on('error', error => {
            emitter.emit('error', error)
            reject(error)
          })
          .on('close', async code => {
            if (code === 0) resolve(code)
            else reject(code)
          })
      })
    }
  )(emitter, appPath)
}
