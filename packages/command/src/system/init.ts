/**
 * 项目初始化命令
 */
import * as inquirer from 'inquirer' // A collection of common interactive command line user interfaces.
import { cyan, greenBright, yellowBright, grey, redBright, blueBright, underline } from 'chalk'
import { EventEmitter } from 'events'
import { CommanderStatic } from 'commander'
import * as fse from 'fs-extra'
import { utils, init as coreInitCommand } from '@ali/mm-cli-core'
import { IKitInfo, IGitLabGroup, ICreateAppInfo, ICommandConfig, IModuleType, ICommandList } from '@ali/mm-cli-core/types'
import { checkModuleMissed } from '../utils/index'
import logger from '../logger'
const { getLength, fixLength, RMX_HOME } = utils
// MO TODO
inquirer.registerPrompt('search-list', require('inquirer-search-list'))

const OPTION_LIST = [
  'scaffold', 'branch', 'directory', 'group', 'app',
  'gitlab',
  'createDef', 'createRap', 'createIconfont', 'createChartpark', 'createSpma', 'createClue',
  'def', 'rap', 'iconfont', 'chartpark', 'spma', 'clue',
  'install'
]
function pick (host: any, props: Array<string>) {
  const result = {}
  for (const prop of props) {
    if (host[prop] !== undefined) result[prop] = host[prop]
  }
  return result
}

export async function prepareKitName () {
  // 从 ALP 获取可当前套件用的脚手架列表
  const { kits } = await utils.getModuleList()
  const maxTitleLength = Math.max(...kits.map(kit => getLength(kit.title)), 10)
  const maxPkgLength = Math.max(...kits.map(kit => getLength(kit.package)), 10)
  const questions = [{
    type: 'list',
    name: 'kit',
    message: blueBright('『请选择套件』：'), // MO 1. 请选择套件：
    choices: kits.map(kit => ({
      name: `${fixLength(kit.title, maxTitleLength)} ${grey(fixLength(kit.package, maxPkgLength))} ${grey(kit.description)}`,
      value: kit, // kit.package
      short: `${kit.title} ${kit.package}`
    }))
  }]

  const answer = await inquirer.prompt(questions)
  const nextKit: IKitInfo = answer.kit

  // 安装套件
  await checkModuleMissed('kit', nextKit)
  // await kpm.installModule(nextKit, 'kit')

  /**
   * 由于 commander 命令行工具需要在运行时进行命令的定义，
   * init 未选择套件前无法得知用的是什么套件
   * 所以在选择套件后重新开进程 spawn 执行下 `rmx init 套件`，明确指定的套件命令
   */
  // 再执行 `rmx init [套件]`，进入真正的套件 init 命令
  // await spawnCommand(CLI_COMMAND, ['init', nextKit.name], {})
  // MO TODO 会丢失参数！！！

  return nextKit.name
}

async function prepareQuestionList (kitName: string, appInfo: any, params) {
  // 被授权的 GitLab 分组
  const authorizedGroups: Array<IGitLabGroup> = await utils.getGitLabGroupList()
  // 套件限定的 GitLab 分组
  let groupsFilterByKit = authorizedGroups
  {
    // 支持限定 GitLab 分组列表
    const effectiveGroupList: Array<string> = params.unstable_groups
    if (effectiveGroupList && effectiveGroupList.length) {
      groupsFilterByKit = authorizedGroups.filter(group => {
        return effectiveGroupList.find((pattern: string | RegExp) => {
          if (typeof pattern === 'string') return pattern === group.name
          if (pattern instanceof RegExp) return pattern.test(group.name)
          return false
        })
      })
    }
  }

  // 获取 GitLab 分组信息
  const groups = groupsFilterByKit
  const maxGroupLength = Math.max(...groups.map(group => getLength(group.name)), 10)
  const groupChoices = groups.map((group: IGitLabGroup) => ({
    name: `${fixLength(group.name, maxGroupLength)} ${grey(group.description)}`,
    value: group.name,
    short: group.name
  }))
  // 从 ALP 获取可当前套件用的脚手架列表
  const { kits } = await utils.getModuleList()
  const kit = kits.find(kit => kit.name === kitName)
  const scaffoldsMap = kit.scaffolds.reduce((acc, cur) => {
    acc[cur.repository] = cur
    return acc
  }, {})
  const maxTitleLength = Math.max(...kit.scaffolds.map(scaffold => getLength(scaffold.title)), 10)
  const maxDescriptionLength = Math.max(...kit.scaffolds.map(scaffold => getLength(scaffold.description)), 10)
  const maxRepositoryLength = Math.max(...kit.scaffolds.map(scaffold => getLength(scaffold.repository)), 10)
  const scaffoldChoices = kit.scaffolds.map(scaffold => {
    return {
      name: `${fixLength(scaffold.title, maxTitleLength)} ${grey(fixLength(scaffold.description, maxDescriptionLength))} ${grey(fixLength(scaffold.repository, maxRepositoryLength))} ${grey.italic(scaffold.directory)}`,
      value: scaffold,
      short: scaffold.title
    }
  })

  // 问题集
  return [
    {
      type: 'list',
      name: 'scaffold',
      message: blueBright('『请选择脚手架』：'),
      choices: scaffoldChoices,
      when: appInfo.scaffold === undefined
    },
    {
      type: 'list',
      name: 'group',
      message: blueBright('『请选择 GitLab 分组』：'), // 『请选择应用归属的 GitLab 分组』：
      choices: groupChoices,
      when: appInfo.group === undefined && appInfo.gitlab !== false
    },
    {
      type: 'input',
      name: 'app',
      message: blueBright('『请输入应用名称』：'),
      validate: (value, answer) => {
        if (params.nameValidate) {
          return params.nameValidate(value, answer, scaffoldsMap)
        }
        return true
      },
      when: appInfo.app === undefined || appInfo.app === '' ||
       typeof appInfo.app === 'function' // MO 与 command.name() 冲突
    },
    {
      type: 'confirm',
      name: 'def',
      default: true,
      message: blueBright('『是否接入 DEF 云构建』:'),
      when: appInfo.def === undefined
    },
    {
      type: 'confirm',
      name: 'rap',
      default: true,
      message: blueBright('『是否创建 RAP2 项目』:'),
      when: appInfo.rap === undefined
    },
    {
      type: 'confirm',
      name: 'iconfont',
      default: true,
      message: blueBright('『是否创建 Iconfont 项目』:'),
      when: appInfo.iconfont === undefined
    },
    {
      type: 'confirm',
      name: 'chartpark',
      default: true,
      message: blueBright('『是否创建 ChartPark 项目』:'),
      when: appInfo.chartpark === undefined
    },
    {
      type: 'confirm',
      name: 'spma',
      default: true,
      message: blueBright('『是否创建 SPM 埋点』:'),
      when: appInfo.spma === undefined
    },
    {
      type: 'confirm',
      name: 'clue',
      default: true,
      message: blueBright('『是否创建 Clue 项目』:'),
      when: appInfo.clue === undefined
    }
  ]
}

async function commandAction (kitName: string, command: CommanderStatic, sysParams) {
  if (!kitName) {
    kitName = await prepareKitName()
  }

  const { kits } = await utils.getModuleList()
  const kitInfo = kits.find(kit => kit.name === kitName)

  // FIXED `mm init kit` 不提示安装套件
  // 安装套件
  await checkModuleMissed('kit', kitInfo)

  let kitCommandListModule = require(`${RMX_HOME}/kit/${kitInfo.name}/node_modules/${kitInfo.package}/dist/commands`)
  kitCommandListModule = kitCommandListModule.__esModule ? kitCommandListModule.default : kitCommandListModule
  const kitCommandList: ICommandList = await kitCommandListModule()
  const kitInitCommand = kitCommandList.find(commandConfig => commandConfig.command === 'init' || commandConfig.name === 'init') || {}
  const { params: kitParams } = kitInitCommand

  // 优先级：套件参数 extra > 命令行参数 command > 问答参数 appInfo
  // 套件参数 extra true：     命令行不问答，直接创建
  // 套件参数 extra false：    命令行不问答，不创建
  // 套件参数 extra undefined：命令行给问答，再决定是否创建

  // MO 支持套件自定义扩展问题集
  const kitOptionList = [...OPTION_LIST]
  if (kitParams.questions) {
    kitParams.questions.forEach(question => {
      kitOptionList.push(question.name)
    })
  }
  const appInfo: ICreateAppInfo = { // MO TODO 提升 kitParams 到通用规则
    cwd: process.cwd(),
    kit: kitName,
    ...pick(sysParams, kitOptionList),
    ...pick(command, kitOptionList),
    ...sysParams, // MO TODO 也应该执行 pick 筛选指定参数
    ...kitParams // MO TODO 也应该执行 pick 筛选指定参数
  }
  logger.info(cyan(__filename))
  logger.info(appInfo)

  // 初始化问题集
  const initQuestionList = await prepareQuestionList(kitName, appInfo, { ...sysParams, ...kitParams })
  // MO 支持套件自定义扩展问题集
  if (kitParams.questions) {
    initQuestionList.push(...kitParams.questions)
  }

  // 收集应用信息
  const answers = await inquirer.prompt(initQuestionList)
  if (appInfo.scaffold === undefined) {
    const { scaffold: scaffoldAnswer } = answers
    answers.scaffold = scaffoldAnswer.repository
    answers.branch = scaffoldAnswer.branch
    answers.directory = scaffoldAnswer.directory

    appInfo.snapshoot = {
      ...(appInfo.snapshoot || {}),
      scaffoldInfo: scaffoldAnswer
    }
  }
  Object.assign(appInfo, answers)
  logger.debug(cyan(__filename))
  logger.info('appInfo', appInfo)

  // 校验应用目录是否已经存在
  const appPath = `${appInfo.cwd}/${appInfo.app}`
  if (await fse.pathExists(appPath)) {
    const answers = await inquirer.prompt([{
      type: 'confirm',
      name: 'clear',
      default: true,
      message: yellowBright(`当前目录下已存在同名文件夹 ${appInfo.app}，是否先执行删除？`)
    }])
    if (answers.clear) {
      await fse.remove(appPath)
    }
  }

  return new Promise((resolve, reject) => {
    async function doit () {
      const emitter = new EventEmitter()
      emitter
        .on('data', (message) => logger.info(message))
        .on('error', (error) => {
          logger.error(error)
          reject(error)
        })
        .on('close', (resp) => {
          if (typeof resp === 'object') {
            logger.debug(__filename)
            logger.warn(redBright('@deprecated 请不要在 close 事件中返回一个对象'), resp)
          }

          if (resp.error) {
            console.log(redBright(`✘ 项目初始化失败 ${resp.error}`))
            logger.error(resp.error)
            // reject(resp.error)
            return
          }
          console.log(greenBright('✔ 项目初始化成功'))
          resolve(appInfo)
        })

      // MO 可读性不好 => require('core/init')
      // api.execSystemCommand('init', appInfo)
      await coreInitCommand(appInfo, emitter)
    }
    doit()
  })
}

function parseBool (value: string): boolean {
  if (value === 'true') return true
  if (value === 'false') return false
  return !!value
}

const commandConfig: ICommandConfig = {
  name: 'init',
  command: 'init [kit]',
  alias: 'create', // MO TODO init => create
  description: '初始化一个应用',
  options: [
    // ['--yes', '是否采用默认值', false],
    ['--app        <name>', '应用名称'],
    ['--scaffold   <scaffold>', '脚手架仓库地址'],
    ['--branch     <branch>', '脚手架仓库分支'],
    ['--directory  <directory>', '脚手架仓库的子目录'],
    ['--group      <group>  ', `GitLab 分组名称         ${underline('http://gitlab.alibaba-inc.com/dashboard/groups')}`],
    ['--gitlab     [boolean]', `是否创建 GitLab 项目    ${underline('http://gitlab.alibaba-inc.com/')}`, parseBool],
    ['--rap        [boolean]', `是否创建 RAP2 项目      ${underline('https://rap2.alibaba-inc.com/')}`, parseBool],
    ['--def        [boolean]', `是否接入 DEF 云构建     ${underline('https://work.def.alibaba-inc.com/my')}`, parseBool],
    ['--iconfont   [boolean]', `是否创建 Iconfont 项目  ${underline('https://www.iconfont.cn/')}`, parseBool],
    ['--chartpark  [boolean]', `是否创建 ChartPark 项目 ${underline('https://chartpark.alibaba-inc.com/')}`, parseBool],
    ['--spma       [boolean]', `是否创建 spma 埋点      ${underline('https://aplus.alibaba-inc.com/aplusplus/index.htm')}`, parseBool],
    ['--clue       [boolean]', `是否创建 Clue 项目      ${underline('https://clue.alibaba-inc.com/')}`, parseBool],
    ['--install    [boolean]', '是否自动安装依赖', parseBool]
    // 废弃，=> name
    // ['-n, --projectName <name>', '项目名称'],
    // MO 太长了，精简命名
    // ['--createRap [boolean]', '（废弃）是否创建Rap2项目', parseBool],
    // ['--createDef [boolean]', '（废弃）是否接入DEF云构建', parseBool],
    // ['--createIconfont [boolean]', '（废弃）是否创建iconfont项目', parseBool],
    // ['--createChartpark [boolean]', '（废弃）是否创建chartpark项目', parseBool],
    // ['--createSpma [boolean]', '（废弃）是否创建spma', parseBool],
    // ['--createClue [boolean]', '（废弃）是否创建clue', parseBool],
  ],
  // MO TODO params 套件传入的？
  async action (kit: IModuleType, command: CommanderStatic, params: any) {
    await commandAction(kit, command, params)
  },
  params: {
    // 校验应用名称
    nameValidate (value: string, answer) {
      if (!value.trim()) {
        return '应用名称不能为空'
      }
      // 判断是否已存在同名的文件夹
      if (fse.pathExistsSync(value)) {
        return '当前目录下已存在同名文件夹，换个应用名称吧'
      }
      return true
    }
  },
  on: [
    ['--help', () => {
      console.log('\nExamples:')
      console.log(`  ${grey('$')} ${blueBright('mm init')}`)
    }]
  ]
}

export default commandConfig
