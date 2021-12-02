'use strict'
import { rap } from 'thx-cli-core'
import * as request from 'request'
import * as chalk from 'chalk'
import * as ora from 'ora'
import constant from './constant'

export default {

  // 获取RAP项目接口数据，如果有关联项目，则依次取
  getRapModels (projectId) {
    return new Promise(async (resolve, reject) => {
      const models = []
      const modelJSON = await this.getRapModelsSingle(projectId) // 从rap上拿接口的json化数据
      // modelJSON.relatedIds = ''
      this.modelJSONToModels(modelJSON, models)

      if (modelJSON.relatedIds) {
        modelJSON.relatedIds = modelJSON.relatedIds.split(',')
        console.log(chalk.cyan('ⓘ 该项目RAP有关联项目，开始加载关联项目数据...'))

        const promises = []
        for (let i = 0, len = modelJSON.relatedIds.length; i < len; i++) {
          const currentId = modelJSON.relatedIds[i]
          promises.push(this.getRapModelsSingle(currentId))
        }

        const subModelJsons = await Promise.all(promises)
        subModelJsons.forEach((subModelJson, i) => {
          this.modelJSONToModels(subModelJson, models)
        })
      }

      resolve(models)
    })
  },

  // rap2
  getRap2Models (projectId) {
    // let me = this
    return new Promise(async (resolve, reject) => {
      const models = []
      const modelJSON: any = await rap.getRap2ModelsSingle(projectId) // 从rap上拿接口的json化数据

      // rap的id不对，给出错误提示
      if (!modelJSON) {
        resolve(false)
        return
      }

      // modelJSON.relatedIds = ''
      this.modelJSONToModelsRap2(modelJSON, models)

      // 有关联项目
      if (modelJSON.data.collaborators && modelJSON.data.collaborators.length) {
        // modelJSON.relatedIds = modelJSON.relatedIds.split(',')
        console.log(chalk.cyan('ⓘ 该项目RAP有关联项目，开始加载关联项目数据...'))

        const promises = []
        for (let i = 0, len = modelJSON.data.collaborators.length; i < len; i++) {
          const currentId = modelJSON.data.collaborators[i].id
          promises.push(rap.getRap2ModelsSingle(currentId))
        }

        const subModelJsons = await Promise.all(promises)
        subModelJsons.forEach((subModelJson, i) => {
          this.modelJSONToModelsRap2(subModelJson, models)
        })
      }

      resolve(models)
    })
  },

  /**
    * 根据projectId获取rap全量接口数据
    * 获取单条请求的接口 http://rap.alibaba-inc.com/mockjsdata/1453/api/list.json
    * 获取整个项目的RAP接口配置 http://rap.alibaba-inc.com/api/queryRAPModel.do?projectId=1453
    ---------------
    *
    */
  getRapModelsSingle (projectId) {
    return new Promise((resolve, reject) => {
      const rapModelQueryUrl = 'http://rap.alibaba-inc.com/api/queryRAPModel.do' // 老版rap的接口地址

      // 从rap上拿接口的json化数据
      const spinner = ora({
        text: `加载RAP上的接口数据，请稍候... ${chalk.gray(`[projectId:${projectId}]`)}`
      }).start()
      const startTime = new Date().getTime()
      request({
        url: rapModelQueryUrl,
        qs: {
          projectId: projectId,
          __TOKEN__: 'magix-cli'
        },
        rejectUnauthorized: false
      }, (error, response, body) => {
        const endTime = new Date().getTime()

        if (!error && response.statusCode === 200) {
          const modelJSON = (() => {
            // eslint-disable-next-line no-eval
            return eval('(' + JSON.parse(body).modelJSON + ')')
          })()
          resolve(modelJSON)
          spinner.succeed(`RAP接口数据加载完毕 ${chalk.gray(`[projectId:${projectId}, 耗时:${endTime - startTime}ms]`)}`)
        } else {
          reject(error)
          spinner.fail(`RAP接口数据加载失败 ${chalk.gray(`[projectId:${projectId}, 耗时:${endTime - startTime}ms]`)}`)
        }
      })
    })
  },

  // 取出接口列表
  modelJSONToModels (modelJSON, models) {
    modelJSON.moduleList.forEach((module, i) => {
      module.pageList.forEach((page, _i) => {
        page.actionList.forEach((action, __i) => {
          action.projectId = modelJSON.id
          models.push(action)
        })
      })
    })
    return models
  },

  // 取出接口列表 rap2
  modelJSONToModelsRap2 (modelJSON, models) {
    modelJSON.data.modules.forEach((module, i) => {
      module.interfaces.forEach((action, _i) => {
        models.push(action)
      })
    })
    return models
  },

  /**
     * 正则解析url转为name
     * http://etao.alimama.net/bp/myActivity/activityInfo' --> /bp/myActivity/activityInfo
     * @return {[type]} [description]
     */
  parseActionUrlBase (action, isRap2, supportApiPathParams) {
    let method
    let apiUrl
    let projectId
    const id = action.id

    if (isRap2) {
      method = action.method || 'GET'
      apiUrl = action.url
      projectId = action.repositoryId
    } else {
      method = constant.METHOD_MAPS[action.requestType] || 'GET'
      apiUrl = action.requestUrl
      projectId = action.projectId
    }

    // var regExp = /(?:.+\.[^/]+)?(\/[^.]+)(?:\..+)?/
    const regExp = /^(?:https?:\/\/[^/]+)?(\/?.+?\/?)(?:\.[^./]+)?$/
    const regExpExec = regExp.exec(apiUrl)
    method = method.toLowerCase()

    if (!regExpExec) {
      console.log(chalk.yellow(`\n  ✘ 您的rap接口url为空或者设置格式不正确，参考格式：/api/test.json (接口url:${apiUrl}, 项目id:${projectId}, 接口id:${id})\n`))
      return
    }

    const urlSplit = regExpExec[1].split('/')

    // 接口地址为RESTful的，清除占位符
    // api/:id/get -> api//get
    // api/bid[0-9]{4}/get -> api//get

    if (!supportApiPathParams) {
      urlSplit.forEach((item, i) => {
        if (/:id/.test(item)) {
          urlSplit[i] = '$id'
          // } else if (/[\[\]\{\}]/.test(item)) {
          //     urlSplit[i] = '$regx'
        } else {
          // 支持:tagId这种自定义类型
          const rexp = /:([^:]+)/.exec(item)
          if (rexp) {
            urlSplit[i] = `$${rexp[1]}`
          }
        }
      })
    }

    // 只去除第一个为空的值，最后一个为空保留
    // 有可能情况是接口 /api/login 以及 /api/login/ 需要同时存在
    if (urlSplit[0].trim() === '') {
      urlSplit.shift()
    }

    urlSplit.push(method)

    const urlToName = urlSplit.join('_')
    return urlToName
  },

  /**
     * 正则解析url转为name (rap1)
     */
  parseActionUrl (action) {
    return this.parseActionUrlBase(action)
  },

  /**
     * 正则解析url转为name (rap2)
     */
  parseActionUrlRap2 (action, supportApiPathParams?) {
    return this.parseActionUrlBase(action, true, supportApiPathParams)
  }
}
