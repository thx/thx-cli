/**
 * 获取各平台的登录信息/token等
 */
// gitlab公开api
import { IGitLabGroup } from '../../types'
import { getConfig, setConfig } from '../utils/mm'
import logger from '../logger'
const inquirer = require('inquirer') // A collection of common interactive command line user interfaces.
const chalk = require('chalk')
const ora = require('ora')
const requestPromise = require('request-promise') // MO TODO => node-fetch
const gitlabApiPrefix = 'https://gitlab.alibaba-inc.com/api/v3'

/**
 * 登录 gitlab 系统，以获取 token、域账号、工号等信息
 * @param force
 */
export async function login (force = false) {
  const token = getConfig('user.private_token') // gitlab token
  const employeeId = getConfig('user.extern_uid') // 工号
  const account = getConfig('user.username') // 域账号

  // 如果都存在表示已经登录过
  if (token && employeeId && account && !force) {
    return
  }

  const loginQuestions = [{
    type: 'input',
    name: 'login',
    message: chalk.green('『请输入域账号』:'),
    validate (value) {
      if (!value.trim()) {
        return '域账号不能为空'
      }
      return true
    }
  }, {
    type: 'password',
    name: 'password',
    message: chalk.green('『请输入域密码』:'),
    validate (value) {
      if (!value.trim()) {
        return '域密码不能为空'
      }
      return true
    }
  }]

  console.log(chalk.grey('ⓘ 请输入域账号和密码来登录系统'))
  const loginInfo = await inquirer.prompt(loginQuestions)
  const spinner = ora({
    text: '登录中，请稍候...'
  }).start()

  // 登录
  const resp = await loginGitlab({
    login: loginInfo.login.trim(),
    password: loginInfo.password.trim()
  })

  if (resp.error) {
    spinner.fail(chalk.red(resp.error))
    throw resp.error
    // process.exit(1)
  } else {
    const loginUser = resp.data
    spinner.succeed(chalk.green('登录成功!'))
    try {
      setConfig('user', loginUser)
    } catch (error) {
      console.log(error)
    }
    return loginUser.private_token
  }
}

// 登录gitlat的接口方法
export async function loginGitlab (formData) {
  try {
    const loginUser = await requestPromise({
      url: gitlabApiPrefix + '/session',
      method: 'POST',
      rejectUnauthorized: false,
      json: true,
      formData
    })

    return {
      data: loginUser
    }
  } catch (error) {
    if (error.statusCode === 401) {
      return {
        error: '域账号或密码错误，请重试!'
      }
    } else {
      return {
        error
      }
    }
  }
}

// 获取gitlab的登录token
export async function getGitlabToken () {
  // 保存本地的config.json里的token
  let token = getConfig('user.private_token')

  // 验证下token是否可用
  try {
    // 获取用户groups信息来验证
    await requestPromise({
      url: `${gitlabApiPrefix}/groups`,
      method: 'get',
      rejectUnauthorized: false,
      json: true,
      formData: {
        private_token: token
      }
    })
  } catch (error) {
    if (error.statusCode === 401) {
      console.log(chalk.yellow('ⓘ token已过期或改变，需要重新登录gitlab'))
    } else {
      console.log(chalk.red(`✘ ${error.error.message}`))
    }

    // 重新登录，并获取新的token
    await login(true)
    token = getConfig('user.private_token')
  }

  return token
}

// 获取gitlab上可用的分组
// 数据返回格式：
// {
//     groupsList: [
//       { name: 'mm', value: 3186 },
//     ],
//     groupsListMap: {
//       '3186': 'mm',
//     }
//   }
export async function getGroupList (privateToken) {
  const groups: Array<IGitLabGroup> = await requestPromise({
    url: `${gitlabApiPrefix}/groups`,
    method: 'get',
    rejectUnauthorized: false,
    json: true,
    formData: {
      private_token: privateToken
    }
  })

  // 查看下所有分组下的成员的权限，来对照查看当前用户是否有该分组的 MASTER 或 OWNER 权限（只有这两权限才可以创建 gitlab 项目）
  const username = getConfig('user.username')
  const groupsMembers = await Promise.all(
    groups.map(group =>
      requestPromise({
        url: `${gitlabApiPrefix}/groups/${group.id}/members`,
        method: 'get',
        rejectUnauthorized: false,
        json: true,
        formData: {
          private_token: privateToken
        }
      })
    )
  )
  // 过滤掉没有创建权限的分组
  return groups.filter((group, index) => {
    // 描述太长影响终端显示
    if (group.description.length > 20) {
      group.description = group.description.slice(0, 20) + '...'
    }

    const members = groupsMembers[index]
    // GUEST = 10, REPORTER = 20, DEVELOPER = 30, MASTER = 40, OWNER = 50
    const accessMembers = members
      .filter(user => user.access_level === 40 || user.access_level === 50)
      .map(user => user.username)
    const included = accessMembers.includes(username)
    if (!included) logger.info(`忽略 ${username} 权限不足的分组 #${group.id} ${group.name}`)
    return included
  })

  // return groups
}

export async function getGroups (privateToken) {
  console.trace('不推荐继续使用 `getGroups(privateToken)`，请改用 `getGroupList(privateToken)`')
  const spinner = ora({
    text: '获取你在gitlab上的分组信息...'
  }).start()

  try {
    // 获取用户groups信息
    const groups = await _getGroups(privateToken)
    spinner.succeed(chalk.green('gitlab分组信息加载成功'))

    // 如果没有分组信息，则提示先到gitlab平台上加入或创建分组
    if (!groups.groupsList.length) {
      console.log(chalk.red('✘ 您gitlab平台上还没有分组，请先到gitlab上创建或加入分组'))
      process.exit(1)
    }

    return groups
  } catch (err) {
    spinner.fail(chalk.red(err.error.message))
    return []
  }
}

// 纯获取groups
export async function _getGroups (privateToken) {
  console.trace('不推荐继续使用 `_getGroups(privateToken)`，请改用 `getGroupList(privateToken)`')
  const groupsListMap = {}
  const groupsListNameMap = {}

  // 获取用户groups信息
  const groups = await requestPromise({
    url: `${gitlabApiPrefix}/groups`,
    method: 'get',
    rejectUnauthorized: false,
    json: true,
    formData: {
      private_token: privateToken
    }
  })

  // 如果没有分组信息，则提示先到gitlab平台上加入或创建分组
  if (!groups || !groups.length) {
    return {
      groupsList: [],
      groupsListMap: {}
    }
  }

  const groupsList = groups.map(group => {
    return {
      name: group.name,
      value: group.id
    }
  })
  for (const _group of groupsList) {
    groupsListMap[_group.value] = _group.name
    groupsListNameMap[_group.name] = _group.value
  }

  return {
    groupsList,
    groupsListMap,
    groupsListNameMap
  }
}

// 创建gitlab项目
export async function createProject (privateToken, name, groupId, options) {
  let spinner2

  try {
    // 到 gitlab 平台上创建项目
    spinner2 = ora({
      text: 'gitlab创建项目中，请稍候...'
    }).start()
    const project = await _createProject(privateToken, name, groupId, options)
    spinner2.succeed(chalk.green('GitLab 仓库创建成功'))
    return project
  } catch (err) {
    switch (err.statusCode) {
      case 400:
        spinner2 && spinner2.fail(chalk.red('GitLab 上已存在同名仓库，换个名称吧'))
        break

      default:
        console.log(chalk.red('✘ ' + err.error.message))
        break
    }
    // process.exit(1)
  }
}

export async function _createProject (privateToken, name, groupId, options?) {
  const params = {
    private_token: privateToken,
    name,
    namespace_id: groupId
  }

  Object.assign(params, options)

  // 到gitlab平台上创建项目
  const project = await requestPromise({
    url: `${gitlabApiPrefix}/projects`,
    method: 'post',
    rejectUnauthorized: false,
    json: true,
    formData: params
  })

  return project
}
