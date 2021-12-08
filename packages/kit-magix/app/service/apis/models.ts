/**
 * 从RAP上同步接口到本地项目中
 */
import { cyan, gray, green, grey, red, redBright, yellow } from 'chalk'
import { EventEmitter } from 'events'
import * as fse from 'fs-extra'
import util from '../../util/util'
import { resolve } from 'path'
import rapUtil from '../../util/rap'
import rapper from '../../util/rapper'
import logger from '../../logger'
import { utils } from 'thx-cli-core'

// 接口的type转换
const METHOD_MAPS = utils.METHOD_MAPS
// const ORIGIN_MODELS_PATH = 'src/app/models/models.js'
const ORIGIN_MODELS_TEMPLATE_PATH = '../tmpl/models.js'
const modelsTmplKey = 'modelsTmpl' // magixCliConfig中的相关模板路径配置的key值
const modelsPathKey = 'modelsPath' // magixCliConfig中的相关生成路径配置的key值

export default {
  // params.cwd 当前工作目录
  // params.models  由check()返回
  // params.repeatApis  由check()返回
  // params.originModels 由check()返回
  // 返回emitter，包含事件data,close
  exec(params: any = {}) {
    const emitter = new EventEmitter()

    setTimeout(async () => {
      const cwd = params.cwd
      const managerTmplGenerater = await util.getTmplGenerater(
        ORIGIN_MODELS_TEMPLATE_PATH,
        modelsTmplKey,
        cwd
      )
      const appPath = await utils.getAppPath()
      const pkg = await utils.getAppPkg(appPath)
      const magixCliConfig = await util.getMagixCliConfig(cwd)
      const models = params.models || []
      const repeatApis = params.repeatApis || []
      const originModels = params.originModels || []
      const rapVersion = (magixCliConfig && magixCliConfig.rapVersion) || 2
      const rmxConfig = pkg.rmxConfig || {}
      // 获取RAP项目ID
      // 没有配置从本地matfile
      const projectId =
        rmxConfig.rapProjectId ||
        magixCliConfig.rapProjectId ||
        magixCliConfig.matProjectId

      // 生成models.js的路径默认值
      const originModelsPath = magixCliConfig[modelsPathKey] || ''
      const modelsJsPath = resolve(appPath, originModelsPath)

      //
      emitter.emit('data', cyan('↳ 以下是接口详情列表：(接口名：接口描述)'))
      for (const model of models) {
        emitter.emit(
          'data',
          `  ├── ${model.name}：` + gray(`${model.__apiName__}`)
        )
      }

      // 总计
      emitter.emit(
        'data',
        cyan(`➤ 共${models.length}个接口 (项目id: ${projectId})`)
      )

      // 接口重复提示
      if (repeatApis.length) {
        emitter.emit('data', yellow('✘ RAP上存在重复的接口，请去重: '))
        repeatApis.forEach(api => {
          if (+rapVersion === 2) {
            emitter.emit(
              'data',
              grey(`  项目id: ${api.repositoryId} - ${api.name} - ${api.url}`)
            )
            emitter.emit(
              'data',
              grey(
                `  └─ https://rap2.alibaba-inc.com/repository/editor?id=${api.repositoryId}&itf=${api.id}`
              )
            )
          } else {
            emitter.emit(
              'data',
              grey(
                `  项目id: ${api.projectId} - ${api.name} - ${api.requestUrl}`
              )
            )
            emitter.emit(
              'data',
              grey(
                `  └─ http://rap.alibaba-inc.com/workspace/myWorkspace.do?projectId=${api.projectId}#${api.id}`
              )
            )
          }
        })
      }

      // 生成models.js文件
      fse.outputFile(modelsJsPath, managerTmplGenerater(models))
      emitter.emit('data', green(`✔ 接口文件${originModelsPath}文件创建完毕`))

      // 调用rapper
      if (magixCliConfig.rapper) {
        // let _name = magixCliConfig.rootAppName
        // let _path = path.join('/')

        const modelsPathSplit = originModelsPath.split('/')
        modelsPathSplit.pop()
        const servicePath = resolve(`${appPath}/`, modelsPathSplit.join('/'))

        rapper(originModels, projectId, servicePath)
          .on('data', msg => {
            emitter.emit('data', msg)
          })
          .on('close', resp => {
            if (typeof resp === 'object') {
              logger.debug(__filename)
              logger.warn(
                redBright('@deprecated 请不要在 close 事件中返回一个对象'),
                resp
              )
            }

            if (resp.error) {
              emitter.emit('data', red(resp.error))
            }

            emitter.emit('close', {})
          })
      } else {
        emitter.emit('close', {})
      }
    }, 0)

    return emitter
  },

  // 同步models前，先检测RAP上是否有接口被删除或修改
  // 返回：{
  //     error: '错误信息', //如果有error代表出错
  //     data: {
  //         models: [], //RAP上定义的接口集合
  //         noMatchAPis: [] //检测到的本地存在，但RAP上不存在的接口，说明RAP上接口被改动了
  //         repeatApis: [] //重复的api集合
  //         originModels: []
  //     }
  // }
  async check(params: any = {}) {
    const appPath = await utils.getAppPath()
    const pkg = await utils.getAppPkg(appPath)
    const magixCliConfig = pkg.magixCliConfig || {}
    const rmxConfig = pkg.rmxConfig || {}

    // 生成models.js的路径默认值
    // 优先获取package.json里配置
    const originModelsPath = magixCliConfig[modelsPathKey] || ''

    if (!originModelsPath) {
      return {
        error: '缺失rmx models生成本地文件路径的配置：magixCliConfig.modelsPath'
      }
    }

    // 获取RAP项目ID
    // 没有配置从本地matfile
    const projectId =
      rmxConfig.rapProjectId ||
      magixCliConfig.rapProjectId ||
      magixCliConfig.matProjectId

    // rap项目id不能为空
    if (!projectId) {
      return {
        error:
          'rapProjectId不能为空，请检查package.json->magixCliConfig.rapProjectId是否正确配置了'
      }
      // rap项目id只能为纯数字
    } else if (/\D/.test(projectId)) {
      return {
        error:
          'rapProjectId只能为纯数字，请检查package.json->magixCliConfig.rapProjectId配置'
      }
    }

    const models = []
    const apiMaps = {} // url去重判断
    const repeatApis = [] // 重复的api列在这里

    // 从项目package.json里获取使用rap的版本
    // 默认为rap2
    const rapVersion = (magixCliConfig && magixCliConfig.rapVersion) || 2
    let originModels

    // RAP2数据处理
    if (+rapVersion === 2) {
      originModels = await rapUtil.getRap2Models(projectId)

      if (!originModels) {
        return {
          error: 'RAP上还没有配置接口'
        }
      }

      originModels.forEach(action => {
        // 正则解析url转为name
        // http://etao.alimama.net/bp/myActivity/activityInfo' --> /bp/myActivity/activityInfo
        const urlToName = rapUtil.parseActionUrlRap2(
          action,
          magixCliConfig.supportApiPathParams
        )
        const method = action.method

        // 去除掉:id, [0-9]{4}这种信息
        // api/get/:id/data -> api/get/
        let requestUrl = action.url.replace(/:id.*/, '')
        if (magixCliConfig.supportApiPathParams) {
          // 支持带id的url直接完整保留
          requestUrl = action.url
        }
        // .replace(/[^\/]*(?:\[.+\])?(?:\{.+\}).*/, '')

        if (!urlToName || !requestUrl) {
          return
        }

        if (apiMaps[urlToName]) {
          repeatApis.push(action)
          return
        }

        // 拼models.js
        models.push({
          __apiName__: action.name,
          __projectId__: action.repositoryId,
          __id__: action.id,
          name: urlToName,
          method: method,
          url: requestUrl
        })

        apiMaps[urlToName] = action
      })
    } else {
      // 老的RAP数据处理
      originModels = await rapUtil.getRapModels(projectId)

      originModels.forEach(action => {
        // 正则解析url转为name
        // http://etao.alimama.net/bp/myActivity/activityInfo' --> /bp/myActivity/activityInfo
        const urlToName = rapUtil.parseActionUrl(action)
        const method = METHOD_MAPS[action.requestType]

        // 去除掉:id, [0-9]{4}这种信息
        // api/get/:id/data -> api/get/
        const requestUrl = action.requestUrl
          .replace(/:id.*/, '')
          .replace(/[^/]*(?:\[.+\])?(?:\{.+\}).*/, '')

        if (!urlToName || !requestUrl) {
          return
        }

        if (apiMaps[urlToName]) {
          repeatApis.push(action)
          return
        }

        // 拼models.js
        models.push({
          __apiName__: action.name,
          __projectId__: action.projectId,
          __id__: action.id,
          name: urlToName,
          method: method,
          url: requestUrl
        })

        apiMaps[urlToName] = action
      })
    }

    const modelsJsPath = resolve(appPath, originModelsPath)

    /**
     * 校验RAP平台的接口跟本地接口有没有被删除或编辑的情况，有的话给出提示
     * 接口增加的情况不做提示
     */

    const noMatchAPis = []
    try {
      // let oldModels = fse.readFileSync(modelsJsPath, 'utf8')
      // let parseOldModels = JSON.parse(oldModels.replace(/\s\/\/\s.+\n/g, '').replace(/\n/g, '').replace(/.+\[/, '[')) //解析本地model.js成数组
      const parseOldModels = require(modelsJsPath)

      // 本地models与rap上的接口做对比
      for (const localModel of parseOldModels) {
        let isMatch = false
        for (const rapModel of models) {
          if (rapModel.url === localModel.url) {
            isMatch = true
          }
        }
        if (!isMatch) {
          noMatchAPis.push(localModel)
        }
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.log(yellow(`ⓘ  models.js文件解析异常：${error.message}`))

        // return {
        //     error
        // }
      }
    }

    return {
      error: null,
      data: {
        models,
        noMatchAPis,
        repeatApis,
        originModels
      }
    }
  }
}
