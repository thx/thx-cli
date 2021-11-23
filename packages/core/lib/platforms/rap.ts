import { getConfig } from '../utils/mm'
import fetch from 'node-fetch'
import { IRAPRepository, IRAPInterface } from '../../types'
const rp = require('request-promise')
const request = require('request')
const chalk = require('chalk')
const ora = require('ora')
const { createHash } = require('crypto')

// 创建rap项目
export async function createProject (name, options) {
  const spinner = ora({
    text: 'RAP项目创建中，请稍候...'
  }).start()

  try {
    const result = await _createProject(name, options)
    spinner.succeed(chalk.green(`RAP项目创建成功(项目id：${result.id})`))
    return result
  } catch (error) {
    spinner.fail(chalk.red(`RAP项目创建失败：${error}`))
  }

  return {}
}

export async function _createProject (name: string, options = {}) {
  const empId = getConfig('user.extern_uid')
  const SALT = '喵喵喵'
  let path = 'https://rap2api.alibaba-inc.com/openapi/repository/create'
  const params = {
    collaboratorIds: [],
    description: '',
    domains: '',
    memberIds: [],
    members: [],
    name: name,
    organizationId: 928, // 阿里妈妈_广告_DMP 分组
    empId: empId
  }

  Object.assign(params, options)

  const method = 'POST'
  const signature = createHash('md5').update(SALT + JSON.stringify(params)).digest('hex')
  path = `${path}?signature=${signature}`

  const result = await rp({
    method,
    uri: path,
    body: params,
    json: true
  })

  if (result.error) {
    throw result.error
  } else {
    return result.data
  }

  // return {} // MO Unreachable code.
}

export async function fetchInterfaceList (repositoryId: number, resolved = []): Promise<Array<IRAPInterface>> {
  resolved.push(repositoryId)

  const result = []

  // 关联仓库
  const repository: IRAPRepository = await fetch(`http://rap2api.alibaba-inc.com/repository/get?id=${repositoryId}`, {
    headers: { 'Content-Type': 'application/json' },
    method: 'get'
  })
    .then(resp => resp.json())
    .then(json => json.data)
  repository.modules.forEach(module => result.push(...module.interfaces))

  // 协同仓库
  const { collaborators } = repository
  for (const collaborator of collaborators) {
    const { id: collaboratorRepositoryId } = collaborator
    if (resolved.indexOf[collaboratorRepositoryId] !== -1) continue
    // const collaboratorRepository = await fetchInterfaceList(collaboratorRepositoryId, resolved)
    // collaboratorRepository.modules.forEach(module => result.push(...module.interfaces))
    const collaboratorRepositoryInterfaces = await fetchInterfaceList(collaboratorRepositoryId, resolved)
    result.push(...collaboratorRepositoryInterfaces)
  }

  return result
}

// RAP2：
// 获取单条请求的接口 https://rap2api.alibaba-inc.com/app/mock/1453/GET/api/list.json
// 获取整个项目的RAP接口配置 https://rap2api.alibaba-inc.com/repository/get?id=1453
export function getRap2ModelsSingle (projectId) {
  return new Promise((resolve, reject) => {
    // RAP2的接口地址
    const rapModelQueryUrl = 'https://rap2api.alibaba-inc.com/repository/get'
    // 从rap上拿接口的json化数据
    const spinner = ora({
      text: `加载RAP上的接口数据，请稍候... ${chalk.gray(`[projectId:${projectId}]`)}`
    }).start()
    const startTime = new Date().getTime()

    request({
      url: rapModelQueryUrl,
      qs: {
        id: projectId,
        __TOKEN__: 'magix-cli'
      },
      rejectUnauthorized: false
    }, (error, response, body) => {
      const endTime = new Date().getTime()

      // RAP服务器挂了
      if (/^50\d$/.test(response.statusCode)) {
        reject(error)
        spinner.fail(chalk.red('RAP平台服务器挂了'))
        return
      }

      if (!error && response.statusCode === 200) {
        let modelJSON
        try {
          modelJSON = JSON.parse(body)
        } catch (error) {
          // console.log(error)

        }

        if (modelJSON && modelJSON.isOk === false) {
          spinner.fail(chalk.red(`${modelJSON.errMsg}\n`))
          resolve(false)
          return
        }

        if (!modelJSON || !modelJSON.data) {
          spinner.fail(chalk.red('没有找到该rapProjectId配置对应的RAP2仓库，请检查RAP项目id是否配置正确\n'))
          resolve(false)
          return
        }

        resolve(modelJSON)
        spinner.succeed(`RAP接口数据加载完毕 ${chalk.gray(`[projectId:${projectId}, 耗时:${endTime - startTime}ms]`)}`)
      } else {
        reject(error)
        spinner.fail(`RAP接口数据加载失败 ${chalk.gray(`[projectId:${projectId}, 耗时:${endTime - startTime}ms]`)}`)
      }
    })
  })
}

// RAP2获取指定ID接口的模板数据
// 包括返回数据 以及 入参
export function getRap2Action (actionId) {
  return new Promise(async (resolve, reject) => {
    const url = 'https://rap2api.alibaba-inc.com/interface/get'

    request({
      url: url,
      qs: {
        id: actionId,
        __TOKEN__: 'magix-cli'
      },
      rejectUnauthorized: false
    }, (err, response, body) => {
      if (err || response.statusCode !== 200) {
        // 接口不存在
        console.log(chalk.red('\n  ✘ 接口不存在，请确认id没有错误 (接口id从rap上查看) \n'))
        return
      }

      const actionData = JSON.parse(body).data
      // actionData.__modelName = parseActionUrlRap2(actionData)

      // 转换rap2的数据结构与rap结构一致
      actionData.requestParameterList = []
      actionData.requestProperties.forEach(prop => {
        actionData.requestParameterList.push({
          name: prop.description,
          identifier: prop.name
        })
      })

      // 递归
      function recurProp (list) {
        list.forEach(item => {
          if (item.children && item.children.length) {
            item.parameterList = item.children
            recurProp(item.parameterList)
          }
          item.identifier = item.name
          item.name = item.description
        })
      }

      recurProp(actionData.responseProperties)
      actionData.responseParameterList = actionData.responseProperties

      resolve(actionData)
    })
  })
}
