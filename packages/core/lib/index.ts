// 工具方法 core utils
import * as utils from './utils'

// 效率工具 platform utils
export * from './platforms/index'

// 系统命令 actions
export * from './commands/index'

// const dataplusUtil = require('./platform/dataplus')
// const clueUtil = require('./platform/clue')

export {
  // 工具方法
  utils
}


/**
 * MO TODO 为什么要包装成构造函数呢？
 * export default new EventEmitter()
 */
/** @deprecated 推荐直接使用工具方法。 */
const EventEmitter = require('events')
export default class RmxCoreBackup extends EventEmitter {
  // MO params: { type: 'kit' | 'plugin', name: '' }
  /** @deprecated */
  constructor(params = {}) {
    console.trace('@deprecated', __filename)
    super()

    // params.type: 标识类型，kit or plugin
    // params.name: 套件或插件的名称
    this.params = params
    this.util = utils

    /**
     * 提供对接各平台接口创建项目的，获取信息等能力
     * 由rmx.xxx对外提供接口（如rmx.gitlab.getToken()）
     * 建议一般先执行rmx.gitlab.login()登录完，再执行其他平台的接口创建项目
     */

    // MO 为什么这么写？
    // gitlab平台
    // this.gitlab = {
    //   // 先登录gitlab，登录成功会在本地保存gitlabToken, 域账号，工号等信息
    //   login: async (force) => {
    //     await gitlab.login(force)
    //   },
    //   // rmx提供登录gitlab获取用户信息的能力
    //   getToken: async () => {
    //     await gitlab.login()
    //     let privateToken = await gitlab.getGitlabToken()
    //     return privateToken
    //   },
    //   // 获取当前用户gitlab上面的分组信息
    //   getGroups: async () => {
    //     await gitlab.login()
    //     let privateToken = await gitlab.getGitlabToken()
    //     let groups = await gitlab.getGroups(privateToken)
    //     return groups
    //   },
    //   // 创建gitlab项目，返回项目id
    //   // name: gitlab项目名
    //   // group: 项目建在哪个分组下，取的是value值
    //   createProject: async (name, groupId, options) => {
    //     await gitlab.login()
    //     const DEBUG = true // MO TODO
    //     if (!DEBUG) {
    //       let privateToken = await gitlab.getGitlabToken()
    //       const result = await gitlab.createProject(privateToken, name, groupId, options)
    //       return result
    //     }
    //   }
    // }

    // iconfont平台
    // MO TODO 没有地方引用，先注释掉
    // this.iconfont = {
    //   // 获取token，会先登录iconfont
    //   getToken: async () => {
    //     await gitlab.login()
    //     let token = await iconfont.getIconfontToken()
    //     return token
    //   },

    //   // 创建iconfont项目，返回项目信息
    //   createProject: async (name, options) => {
    //     await gitlab.login()
    //     let token = await iconfont.getIconfontToken()
    //     let project = await iconfont.createProject(name, token, options)
    //     return project
    //   },

    //   // 返回指定项目的信息
    //   getProject: async (id) => {
    //     await gitlab.login()
    //     let project = await iconfont.getProject(id)
    //     return project
    //   }
    // }

    // chartpark平台
    // MO TODO 没有地方引用，先注释掉
    // this.chartpark = {
    //   // 创建项目，返回项目信息
    //   createProject: async (name, options) => {
    //     await gitlabUtil.login()
    //     let project = await chartparkUtil.createProject(name, options)
    //     return project
    //   },
    //   getOptions: async (chartparkId) => {
    //     await gitlabUtil.login()
    //     return await chartparkUtil.getOptions(chartparkId)
    //   }
    // }

    // rap2平台
    // MO TODO 没有地方引用，先注释掉
    // this.rap = {
    //   // 创建项目，返回项目信息
    //   createProject: async (name, options) => {
    //     await gitlab.login()
    //     let project = await rapUtil.createProject(name, options)
    //     return project
    //   },

    //   // 获取rap上某项目的信息
    //   getRap2ModelsSingle: rapUtil.getRap2ModelsSingle,

    //   // 获取某接口的信息
    //   getRap2Action: rapUtil.getRap2Action
    // }

    // def平台
    // MO TODO 没有地方引用，先注释掉
    // this.def = {
    //   // 创建项目，返回项目信息
    //   // group:取的是name值，如mm
    //   createProject: async (name, group, options) => {
    //     await gitlabUtil.login()
    //     let project = await defUtil.joinDef(name, group, options)
    //     return project
    //   },
    //   release: async (publishBranch, publishType, internationalCdn, isCheck) => {
    //     await gitlabUtil.login()
    //     await defUtil.release(publishBranch, publishType, internationalCdn, isCheck)
    //   }
    // }

    // dataplus平台
    // MO TODO 没有地方引用，先注释掉
    // this.dataplus = {
    //   // 自动创建spma，b段是固定的
    //   createSpma: async (options) => {
    //     await gitlabUtil.login()
    //     let result = await dataplusUtil.createSpma(options)
    //     return result
    //   },
    //   // 接入数据小站
    //   joinDataplus: async (name, spma) => {
    //     await gitlabUtil.login()
    //     try {
    //       await dataplusUtil.joinDataplus(name, spma)
    //     } catch (error) {
    //       throw error
    //     }
    //   }
    // }

    // clue平台
    // MO TODO 没有地方引用，先注释掉
    // this.clue = {
    //   // 创建项目，返回项目信息
    //   createProject: async (name) => {
    //     await gitlabUtil.login()
    //     let project = await clueUtil.createProject(name)
    //     return project
    //   },
    //   // 添加一个自定义监控
    //   addCustomMonitor: async (name) => {
    //     await gitlabUtil.login()
    //     let project = await clueUtil.addCustomMonitor(name)
    //     return project
    //   }
    // }
  }

  // 提供给套件、插件用的保存配置
  // 与config.setConfig不同，套件的setConfig只会固定存在kits.套件名.[配置名]的命名空间下
  // 插件固定存在plugins.插件名.[配置名]命名空间下
  // 避免影响其他全局的配置，比如user用户信息
  // path格式：'xx.yy.zz', value为标准json格式值
  // MO TODO 没有地方引用，先注释掉
  // setConfig (path, value) {
  //   return config.setConfig(`${this.params.type}.${this.params.name}.${path}`, value)
  // }

  // 获取配置
  // MO TODO 没有地方引用，先注释掉
  // getConfig (path) {
  //   return config.getConfig(`${this.params.type}.${this.params.name}.${path}`)
  // }

  // 允许访问根级配置
  // getRootConfig (path) {
  //   return config.getConfig(path)
  // }
}
