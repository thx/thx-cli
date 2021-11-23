'use strict'
/**
 * 生成最基础的Magix view, 包含html, js 文件
 */
import * as fs from 'fs'
import util from '../../util/util'
import * as fse from 'fs-extra'
import * as inquirer from 'inquirer' // A collection of common interactive command line user interfaces
import { utils, rap } from '@ali/mm-cli-core'
import * as chalk from 'chalk'
import * as path from 'path'
import rapUtil from '../../util/rap'

export default async (options) => {
  let templateTypes = [{
    name: 'blank : 基础空白页',
    value: 'blank'
  }, {
    name: 'table : 包含表格的列表页',
    value: 'table'
  }, {
    name: 'form  : 基础表单提交页面',
    value: 'form'
  }]

  const magixCliConfig = await util.getMagixCliConfig()
  const appPath = await utils.getAppPath()
  const pkg = await utils.getAppPkg(appPath)
  // 优先package.json里的localTmplPath配置
  const localTmplPath = magixCliConfig.codeTmpl || 'mama_config/tmpl'
  const isExistLocalTmpl = await util.getExistFile(localTmplPath)
  let tmplPath

  if (isExistLocalTmpl) {
    console.log(chalk.cyan(`ⓘ 检测到存在本地模板 -> ${localTmplPath}/，将使用本地模板生成`))
    templateTypes = [] // 如果本地存在 tmpl， 则直接用本地的
    tmplPath = path.resolve(isExistLocalTmpl.join('/'), localTmplPath)
    const files = fs.readdirSync(tmplPath)

    // 根据 mama_config/tmpl/** 下的目录来确定可选的模板类型
    files.forEach(file => {
      const stat = fs.lstatSync(path.resolve(tmplPath, file))
      if (stat.isDirectory()) {
        templateTypes.push({
          name: file,
          value: file
        })
      }
    })
  }

  const questions: Array<any> = [{
    type: 'list',
    name: 'theme',
    message: chalk.green('【请选择模板类型】:'),
    choices: templateTypes
  }, {
    type: 'input',
    name: 'viewpath',
    message: chalk.green('【请输入文件名(可以带目录), 如: hello/index】:'),
    default: () => {
      // return 'Doe';
    },
    validate: value => {
      const viewpath = value.trim()

      if (!viewpath) {
        return '请输入正确的path'
      }
      return true
    }
  }]

  questions.push({
    type: 'input',
    name: 'actionId',
    message: chalk.green('【请输入rap接口的id，可不填】:'),
    default: () => {
      // return 'Doe';
    },
    validate: value => {
      const viewpath = value.trim()

      if (/\D/.test(viewpath)) {
        return 'rap接口id为数字'
      }
      return true
    }
  })

  const answers = await inquirer.prompt(questions)
  const viewpath = answers.viewpath.trim()
  const splits = viewpath.split('/')
  const fileName = splits[splits.length - 1]

  // 可配置生成.es或.ts或.js文件
  const jsExtension = magixCliConfig.jsExtension || '.js'
  const jsFile = viewpath + jsExtension
  const htmlFile = viewpath + '.html'
  const lessFile = viewpath + '.less'
  const startTime = new Date().getTime()

  // view模板
  let htmlTplFn // 基础模板
  let jsTplFn // 基础js
  let lessTplFn // 基础less

  // 如果有本地模板，则使用本地模板
  try {
    if (isExistLocalTmpl) {
      // no-eval
      htmlTplFn = eval(`(${fs.readFileSync(`${tmplPath}/${answers.theme}/html.js`, 'utf-8')})`) // 转成执行代码
      jsTplFn = eval(`(${fs.readFileSync(`${tmplPath}/${answers.theme}/js.js`, 'utf-8')})`) // 转成执行代码
      lessTplFn = eval(`(${fs.readFileSync(`${tmplPath}/${answers.theme}/less.js`, 'utf-8')})`) // 转成执行代码
    } else {
      htmlTplFn = require(`../../tmpl/${answers.theme}/html.js`).default // 基础模板
      jsTplFn = require(`../../tmpl/${answers.theme}/js.js`).default // 基础js
      lessTplFn = require(`../../tmpl/${answers.theme}/less.js`).default // 基础less
    }
  } catch (error) {
    // console.log(error)
  }

  // 生成相对view.ts的路径
  function generatePath () {
    const projectName = pkg.name || 'app'
    const _regexp = new RegExp(`${projectName}.*`)
    const cwd = process.cwd()
    const projectRoot = cwd.replace(_regexp, projectName)
    const viewTsPath = `${projectRoot}/src/${projectName}`

    let _viewPath = ''
    if (viewpath.includes('/')) {
      _viewPath = viewpath.replace(/\/[^/]+$/, '')
    }

    let relativePath = path.relative(`${cwd}/${_viewPath}`, viewTsPath)

    // fix path
    if (relativePath === '') {
      relativePath = '.'
    } else if (relativePath[0] !== '.') {
      relativePath = './' + relativePath
    }

    // viewPathAbs，view的相对项目根目录的绝对路径
    const viewPathAbs = `${cwd.replace(projectRoot, '')}/${viewpath}`

    return { relativePath, viewPathAbs }
  }

  // 生成html, js文件
  function generateFile (fileName, action?) {
    function generate (type) {
      const typeMaps = {
        js: {
          path: jsFile,
          tplFn: jsTplFn
        },
        html: {
          path: htmlFile,
          tplFn: htmlTplFn
        },
        less: {
          path: lessFile,
          tplFn: lessTplFn
        }
      }

      const path = typeMaps[type].path
      fs.open(path, 'wx', (err, fd) => {
        if (err && err.code === 'EEXIST') return console.error(chalk.red(`✘ ${type}模板创建失败：文件已经存在！`))
        const {
          relativePath,
          viewPathAbs
        } = generatePath()

        fse.outputFileSync(path, typeMaps[type].tplFn(fileName, action, relativePath, viewPathAbs.replace(/\//g, '_')), 'utf8')
        console.log(chalk.green(`✔ ${type}模板创建完成 => ${path}`))
      })
    }

    if (jsTplFn) {
      generate('js')
    }

    if (htmlTplFn) {
      generate('html')
    }

    if (lessTplFn) {
      generate('less')
    }
  }

  // 取rap接口数据，匹配到具体的接口，然后输出html,js模板文件
  if (answers.actionId) {
    const projectId = await util.getRapProjectId()

    // 从项目package.json里获取使用rap的版本
    // 使用墨智的RAP2请在项目package.json里增加配置 rapVersion: 2
    const rapVersion = magixCliConfig && magixCliConfig.rapVersion
    let models
    let action
    if (+rapVersion === 2) { // RAP2数据处理
      // rap2单独请求接口的模板数据
      action = await rap.getRap2Action(answers.actionId)
      action.__modelName = rapUtil.parseActionUrlRap2(action)
    } else {
      models = await rapUtil.getRapModels(projectId)

      // 解析全量的rap接口数据，根据接口id，返回某个接口
      action = (() => {
        let currentAction
        models.forEach((_action) => {
          if (_action.id == answers.actionId) {
            currentAction = _action
            currentAction.__modelName = rapUtil.parseActionUrl(currentAction)
          }
        })
        return currentAction
      })()
    }

    if (!action) {
      console.log(chalk.red('✘ 接口不存在，请重新输入正确的接口id'))
      return
    }
    generateFile(fileName, action)
  } else { // 不填rap接口，直接生成静态模板文件
    generateFile(fileName)
  }

  const endTime = new Date().getTime()
  console.log(chalk.cyan(`➤ 总耗时:${endTime - startTime}ms`))
}
