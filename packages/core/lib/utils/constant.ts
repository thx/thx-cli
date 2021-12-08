import * as moment from 'moment'
import * as chalk from 'chalk'
import { join } from 'path'
import * as os from 'os'
import { PROCESS_STATE, SOCKET_EVENT, METHOD_MAPS } from './constant-browser'

// 内外网的标识，根据入口命令判断，mm 开头为内网
const isOpenSource = !/\/mm$/.test(process.argv[1])

export function NOW() {
  return moment().format('HH:mm:ss.SSS') // YYYY-MM-DD
}

export const ALP_API_V1 = isOpenSource
  ? 'https://mo.m.taobao.com/common/thx-cli-module-list' // 内网套件插件列表
  : 'https://mo.m.taobao.com/v1/mm_cli_module_list' // 外网套件插件列表

/**  @deprecated */
export const choices = [
  { name: '套件', value: 'kit' },
  { name: '插件', value: 'plugin' }
]

/**
 * Log 日志
 * 时间戳，详细日志 verbose，日志分级 [info|error|verbose]，
 * 日志颜色（链接、信息、label + value）
 * 日志颜色（链接、信息、label + value）
 */

// 日志样式 https://github.com/chalk/chalk
export const LOG_STYLE = {
  GROUP: 'inverse',
  LINK: 'underline',
  EXAMPLE: 'green',
  LABEL: 'grey',
  VALUE: 'white',
  DESC: 'grey',
  FAIL: 'red'
}

// 日志分级
export const LOG_LEVEL = {
  INFO: '[info]',
  ERROR: '[error]',
  VERBOSE: '[verbose]'
}

// 日志分组
export const LOG_GROUP = {
  SPAWN: chalk[LOG_STYLE.GROUP]('[spawn]'),
  EXEC: chalk[LOG_STYLE.GROUP]('[exec]'),
  SERVER: chalk[LOG_STYLE.GROUP]('[server]'),
  SOCKET: chalk[LOG_STYLE.GROUP]('[socket]'),
  CLIENT: '[client]',
  SYSTEM: '[system]',
  KIT: chalk[LOG_STYLE.GROUP]('[kit]'),
  PLUGIN: '[plugin]',
  GIT: '[git]'
}

/**
 * Module 套件&插件
 */

export const MODULE_TYPE = {
  KIT: 'kit',
  PLUGIN: 'plugin'
}

export const MODULE_TYPE_LIST = [
  {
    name: 'kit',
    title: '套件',
    description: '特定技术栈的全链路开发解决方案。'
  },
  { name: 'plugin', title: '插件', description: '为命令行扩展单个命令。' }
]

export const MODULE_TYPE_MAP = {
  kit: '套件',
  plugin: '插件'
}

/**
 * Task Process State
 * 任务线程状态
 */

export { PROCESS_STATE }

/**
 * Socket Event
 * 套接字事件
 */

export { SOCKET_EVENT }

export { METHOD_MAPS }

/** MM CLI */

/** @deprecated => MM_HOST */
export const RMX_HOST = '127.0.0.1'
/** @deprecated => MM_PORT */
export const RMX_PORT = 6868
// =>
/** 本地工作台 IP */
export const MM_HOST = '127.0.0.1'
/** 本地工作台 域名 */
export const MM_PORT = 6868

/** @deprecated => MM_CACHE_FOLDER */
export const RMX_CACHE_FOLDER = isOpenSource ? '.thx' : '.mm'
/** @deprecated => MM_HOME */
export const RMX_HOME = join(os.homedir(), RMX_CACHE_FOLDER)
/** @deprecated => MM_RC_FILE */
export const RMX_RC_FILE = '.rmxrc'
/** @deprecated => MM_RC_JS */
export const RMX_RC_JS = '.rmxrc.js'
/** @deprecated => MM_RC_JSON */
export const RMX_RC_JSON = '.rmxrc.json'

// =>
/** MM CLI 本地缓存目录（名称） */
export const MM_CACHE_FOLDER = isOpenSource ? '.thx' : '.mm' // 外网用 .thx 目录，内网用 .mm 目录
/** MM CLI 套件缓存目录（名称） */
export const MM_KIT_FOLDER = 'kit'
/** MM CLI 插件缓存目录（名称） */
export const MM_PLUGIN_FOLDER = 'plugin'
/** MM CLI 本地缓存配置文件（名称） */
export const MM_CONFIG_JSON = 'config.json'
/** MM CLI 本地缓存路径（完整路径） */
export const MM_HOME = join(os.homedir(), MM_CACHE_FOLDER)
/** MM CLI 运行时控制文件 .rmxrc（名称） */
export const MM_RC_FILE = '.rmxrc'
/** MM CLI 运行时控制文件名 .rmxrc.js（名称） */
export const MM_RC_JS = '.rmxrc.js'
/** MM CLI 运行时控制文件名 .rmxrc.json（名称） */
export const MM_RC_JSON = '.rmxrc.json'
/** MM CLI 远程数据缓存路径（完整路径） */
export const MM_REMOTE_CACHE_FOLDER = join(MM_HOME, 'cache')
