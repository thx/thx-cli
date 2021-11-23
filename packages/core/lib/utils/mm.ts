import * as fs from 'fs'
import * as fse from 'fs-extra'
import * as os from 'os'
import { readJSON, safeWriteJSON, mkdirSync } from './file'
import { join } from 'path'
import { MM_CONFIG_JSON, MM_HOME, MM_KIT_FOLDER, MM_PLUGIN_FOLDER, RMX_CACHE_FOLDER, RMX_HOME } from './constant'
import { IRMXConfig } from '../../types'

const MM_CONFIG_PATH = join(RMX_HOME, 'config.json')

/**
 * 获取 `.rmx` 目录位置
 *
 * @return {String}
 * @deprecated
 */
export function getRmxHomeDir () {
  console.trace('不推荐继续使用 `getRmxHomeDir()`，请改用 `RMX_HOME`')
  return join(os.homedir(), RMX_CACHE_FOLDER) // MO 应该是一个常量量，而不是函数。函数意味着，有计算过程，并且可能有不同的返回值。
}

export function initMMHome () {
  const dirs = [MM_HOME, join(MM_HOME, MM_KIT_FOLDER), join(MM_HOME, MM_PLUGIN_FOLDER)]
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) mkdirSync(dir)
  })

  const mmConfigPath = join(MM_HOME, MM_CONFIG_JSON)
  const mmConfigDefaultContent = {
    port: 80, // http 端口号
    portssl: 443, // https 端口号
    apps: [], // 应用列表
    webui: {} // WebUI 自定义配置
    // defaultDir: RMX_HOME // rmx 默认项目目录
  }
  if (!fs.existsSync(mmConfigPath)) {
    safeWriteJSON(mmConfigPath, mmConfigDefaultContent)
  } else {
    const curConfig = readJSON(mmConfigPath) || {}
    safeWriteJSON(mmConfigPath, { ...mmConfigDefaultContent, ...curConfig })
  }
}

export function getMMConfig (): IRMXConfig {
  return getRmxConfig()
}

export function setMMConfig (config: IRMXConfig) {
  setRmxConfig(config)
}

/**
   * 获取 .rmx 全局配置
   *
   * @return {json}
   * @deprecated => getMMConfig()
   */
// MO FIXED getRmxConfig => getRmxConfig | getApplicationRmxConfig
// MO rmx config 的类型定义是什么？
export function getRmxConfig (): IRMXConfig {
  const config = readJSON(join(RMX_HOME, 'config.json'))
  // if (!config.apps && config.projects) {
  //   config.apps = config.projects
  // }

  Object.defineProperty(config, 'projects', {
    set (projects) {
      console.trace('废弃，不建议使用 `projects`，请替换为 `apps`。')
      this.apps = projects // cmd => terminal
    },
    get () {
      console.trace('废弃，不建议使用 `projects`，请替换为 `apps`。')
      return this.apps
    }
  })

  return config
}

// 获取配置
// path[string]：xx.yy.zz
/** 获取 rmx 全局配置 */
export function getConfig (path): any {
  this._initConfig()
  const config = fse.readJsonSync(MM_CONFIG_PATH)
  const pathSplit = path.split('.')
  let result = {}
  let temp = null

  for (const p of pathSplit) {
    result = (temp && (temp[p] || config[p])) || config[p]
    temp = (temp && temp[p]) || config[p]
  }

  return result
}

/** @deprecated MO TODO setRmxConfig => setMMConfig */
export function setRmxConfig (config: IRMXConfig) {
  safeWriteJSON(join(RMX_HOME, 'config.json'), config)
}

// 保存在[用户目录]/.rmx/config.json
// path[string]：xx.yy.zz
// value[any]: 要设置的值，必须为符合json格式的值
/** 设置 rmx 全局配置 */
/**
 *
 * @param path
 * @param value
 * @deprecated setConfig => setMMConfig
 * MO TODO 是否有必要限制套件&插件的可配置范围
 * 套件或插件设置配置项，请调用 setModuleConfig(pkgName, value)。
 */
export function setConfig (path, value) {
  this._initConfig()
  // console.log(MM_CONFIG_PATH, path, value)
  const config = fse.readJsonSync(MM_CONFIG_PATH)
  const pathSplit = path.split('.')
  let i = 0
  function recur (_config, key) {
    i++
    if (i === pathSplit.length) {
      _config[key] = value
    } else {
      if (Object.prototype.toString.call(_config[key]) !== '[object Object]') {
        _config[key] = {}
      }
      recur(_config[key], pathSplit[i])
    }
  }

  recur(config, pathSplit[i])

  fse.outputJsonSync(MM_CONFIG_PATH, config, { spaces: 2 })
  return config
}

/**
 * 获取套件&插件的配置项
 * MO TODO 套件&插件迁移
 */
export function setModuleConfig (pkgName: string, value: any) {
  const mmConfig = getRmxConfig()
  mmConfig[pkgName] = value
  setRmxConfig(mmConfig)
}

/**
 * 设置套件&插件的配置项
 * MO TODO 套件&插件迁移
 */
export function getModuleConfig (pkgName: string) {
  const mmConfig = getRmxConfig()
  return mmConfig[pkgName] || {}
}

/** 初始化一个空的 config.json */
export function _initConfig () {
  if (!fse.pathExistsSync(MM_CONFIG_PATH)) {
    fse.outputJSONSync(MM_CONFIG_PATH, {}, {
      spaces: 2
    })
  }
}
