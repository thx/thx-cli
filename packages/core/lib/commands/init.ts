
/**
 * 项目初始化命令
 */
import { tmpdir } from 'os'
import { join } from 'path'

import * as chartparkUtil from '../platforms/chartpark'
import { RMX_HOME, setAppPackage, spawnCommand, spawn, getLength, withSpinner, prefixLength, getGitLabGroupList, getConfig, setAppRCPart, getKit } from '../utils'
import * as gitlabUtil from '../platforms/gitlab'
import * as rapUtil from '../platforms/rap'
import * as iconfontUtil from '../platforms/iconfont'
import * as defUtil from '../platforms/def'
import * as clueUtil from '../platforms/clue'
import * as dataplusUtil from '../platforms/dataplus'
import * as fse from 'fs-extra'
import { EventEmitter } from 'events'
import { green, underline, greenBright, redBright } from 'chalk'
import { IGitLabGroup, ICreateAppInfo } from '../../types/index.d'
import simpleGit from 'simple-git'
import logger from '../logger'

// const { ICommandList } = require('../../types/index')
// ✘ ⓘ ✔ ✦ ♨

/**
params参数列表：
    kitName: 套件名称（如magix,react）
    cwd：工作目录
    name：项目名称
    groupId：gitlab分组id
    groupName：gitlab分组名称
    scaffold：脚手架仓库地址
    createRap：是否创建rap项目
    createIconfont: 是否创建iconfont,
    createChartpark: 是否创建chartpark,
    createSpma: 是否创建spma,
    createDef: 是否接入def云构建,
    createClue: 是否创建clue,
 */

/**
 * 创建gitlab项目
 */
const createGitLabRepository = async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
  if (appInfo.gitlab === false) return
  return withSpinner(
    '创建 GitLab 仓库',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      const groups: Array<IGitLabGroup> = await getGitLabGroupList()
      const groupMap = groups.reduce((acc, cur) => {
        acc[cur.name] = cur
        return acc
      }, {})
      const token = getConfig('user.private_token')
      const groupId = groupMap[appInfo.group].id

      return gitlabUtil._createProject(token, appInfo.app, groupId)
    }, (error) => {
      // 创建gitlab仓库失败的话，中断init流程
      console.log(error.message)
      if (error.statusCode === 400) {
        console.log(redBright('✘ GitLab 上已存在同名仓库，换个名称吧'))
      }
      process.exit(1)
    }
  )(emitter, appInfo)
}

/** 创建rap2项目 */
async function createRAPRepository (emitter: EventEmitter, appInfo: ICreateAppInfo) {
  if (appInfo.rap === false) return

  return withSpinner(
    '创建 RAP2 仓库',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      return rapUtil._createProject(appInfo.app)
    }
  )(emitter, appInfo)
}
/** 创建 iconfont 项目 */
async function createIconfontProject (emitter: EventEmitter, appInfo: ICreateAppInfo) {
  if (appInfo.iconfont === false) return

  return withSpinner(
    '创建 Iconfont 仓库',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      const token = await iconfontUtil.getIconfontToken()
      return iconfontUtil._createProject(appInfo.app, token)
    }
  )(emitter, appInfo)

  // let iconfontToken = await rmx.iconfont.getToken()
  // let iconfontProjectInfo: any = {}
  // if (appInfo.iconfont) {
  //   const spinner = ora('iconfont 项目创建中，请稍候...').start()
  //   emitter.emit('data', green(`\n♨ iconfont项目创建中，请稍候...`))
  //   try {
  //     iconfontProjectInfo = await iconfontUtil._createProject(appInfo.app, iconfontToken)
  //     spinner.succeed('iconfont 项目创建中，请稍候...成功')
  //     emitter.emit('data', green(`✔ iconfont 项目创建成功（id: ${iconfontProjectInfo.id}）`))
  //   } catch (error) {
  //     spinner.fail('iconfont 项目创建中，请稍候...失败')
  //     console.error(error)
  //     emitter.emit('data', yellow(`✘ iconfont 项目创建失败: ${error}`))
  //   }
  // }
  // return iconfontProjectInfo
}

/**
 * 创建chartpark项目
 */
async function createChartparkProject (emitter: EventEmitter, appInfo: ICreateAppInfo) {
  if (appInfo.chartpark === false) return

  return withSpinner(
    '创建 Chartpark 项目',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      return chartparkUtil._createProject(appInfo.app)
    }
  )(emitter, appInfo)

  // let chartInfo: any = {}
  // if (params.chartpark || params.createChartpark) {
  //   const spinner = ora('chartpark 项目创建中，请稍候...').start()
  //   emitter.emit('data', green(`\n♨ chartpark 项目创建中，请稍候...`))
  //   try {
  //     chartInfo = await chartparkUtil._createProject(params.name)
  //     spinner.succeed('chartpark 项目创建中，请稍候...成功')
  //     emitter.emit('data', green(`✔ chartpark 项目创建成功（id: ${chartInfo.projectId}）`))
  //   } catch (error) {
  //     spinner.fail('chartpark 项目创建中，请稍候...失败')
  //     console.error(`✘ chartpark 项目创建失败`)
  //     console.error(error)
  //     emitter.emit('data', yellow(`✘ chartpark 项目创建失败`))
  //   }
  // }
  // return chartInfo
}

/**
  * 自动创建spma
  */
async function createSpma (emitter: EventEmitter, appInfo: ICreateAppInfo) {
  if (appInfo.spma === false) return

  const { spma } = await withSpinner(
    '创建 SPM A',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      return dataplusUtil._createSpma()
    }
  )(emitter, appInfo)

  await withSpinner(
    '接入数据小站 DataPlus',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      await dataplusUtil.joinDataplus(appInfo.app, spma)
    }
  )(emitter, appInfo)

  return spma
}

/**
 * 接入DEF平台发布系统
 */
async function joinDef (emitter: EventEmitter, appInfo: ICreateAppInfo) {
  if (appInfo.def === false) return

  return withSpinner(
    '接入 DEF 研发平台',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      return defUtil._joinDef(appInfo.app, appInfo.group)
    }
  )(emitter, appInfo)
}

/**
 * 创建clue项目
 */
async function createClue (emitter: EventEmitter, appInfo: ICreateAppInfo) {
  if (appInfo.clue === false) return

  await withSpinner(
    '创建 Clue 项目',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      await clueUtil._createProject(appInfo.app)
    }
  )(emitter, appInfo)

  await withSpinner(
    '创建 Clue 自定义监控',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      await clueUtil._addCustomMonitor(appInfo.app)
    }
  )(emitter, appInfo)
}

/**
 * clone 已创建好的 gitlab 项目到项目目录
 */
async function cloneTemplate (emitter: EventEmitter, appInfo: ICreateAppInfo) {
  await withSpinner(
    '克隆脚手架',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      const git = simpleGit(appInfo.cwd)
      const appPath = `${appInfo.cwd}/${appInfo.app}`
      logger.info(`${appInfo.scaffold} => ${appInfo.cwd}/${appInfo.app}`)
      if (appInfo.directory) {
        const tmpAppPath = join(tmpdir(), appInfo.app) // 临时目录/应用名称
        const tmpAppDirectory = join(tmpAppPath, appInfo.directory) // 临时目录/应用名称/子目录

        logger.info(`${appInfo.scaffold} => ${tmpAppPath}`)
        await git.clone(appInfo.scaffold, tmpAppPath)
        if (appInfo.branch) {
          logger.info(`git checkout ${appInfo.branch}`)
          await git.cwd(tmpAppPath)
          await git.checkout(appInfo.branch)
        }

        logger.info(`${tmpAppDirectory} => ${appPath}`)
        await fse.move(tmpAppDirectory, appPath, { overwrite: true })

        logger.info(`remove ${tmpAppPath}`)
        await fse.remove(tmpAppPath)
      } else {
        await git.clone(appInfo.scaffold, appPath)
        if (appInfo.branch) {
          logger.info(`git checkout ${appInfo.branch}`)
          await git.cwd(appPath)
          await git.checkout(appInfo.branch)
        }
      }
    },
    (error) => {
      logger.error(error)
      console.error(`您没有该脚手架仓库访问权限或该仓库地址不存在，仓库地址：${appInfo.scaffold}`)
    }
  )(emitter, appInfo)
}

async function createLocalApp (emitter: EventEmitter, appInfo: ICreateAppInfo,
  {
    rapProject,
    iconfontProject,
    defInfo,
    gitProject,
    spma,
    chartparkProject
  }
) {
  const git = simpleGit(appInfo.cwd)
  const appPath = `${appInfo.cwd}/${appInfo.app}`

  // 1
  // const spinner = ora('创建本地项目...').start()
  emitter.emit('data', green('ⓘ 创建本地项目'))
  emitter.emit('data', appPath)
  await fse.ensureDir(appPath)// 创建项目目录
  await cloneTemplate(emitter, appInfo)

  // 2
  await withSpinner(
    '设置远程仓库',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      await spawnCommand('rm', ['-rf', '.git'], { cwd: appPath })
      await git.cwd(appPath)
      await git.init()
      await git.addRemote('origin', gitProject?.ssh_url_to_repo) // eslint-disable-line camelcase
    }
  )(emitter, appInfo)

  // 3 设置项目相关配置信息
  await withSpinner(
    '更新应用 .rmxrc 配置',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      // emitter.emit('data', green('ⓘ 将各平台id写入本地rmxConfig中'))
      const pkgPath = `${appPath}/package.json`
      // 往package.json里写入项目gitlab仓库地址
      setAppPackage('repository', {
        type: 'git',
        url: gitProject?.ssh_url_to_repo // eslint-disable-line camelcase
      }, pkgPath)
      setAppPackage('name', appInfo.app, pkgPath)

      // 写入套件名称
      setAppRCPart('kit', appInfo.kit, appPath)
      // RAP
      if (rapProject?.id) setAppRCPart('rapProjectId', rapProject.id, appPath)
      // iconfont
      if (iconfontProject?.id) setAppRCPart('iconfontId', iconfontProject.id, appPath)
      // DEF云发布
      if (defInfo?.id) setAppRCPart('defId', defInfo.id, appPath)
      // gitlab项目地址
      if (gitProject?.web_url) setAppRCPart('gitlabUrl', gitProject.web_url, appPath) // eslint-disable-line camelcase
      // 埋点相关
      if (spma) setAppRCPart('spma', spma, appPath)
      // chartpark
      if (chartparkProject?.projectId) setAppRCPart('chartParkId', chartparkProject.projectId, appPath)
      // emitter.emit('data', green(`✔ 本地项目创建完毕`))
    }
  )(emitter, appInfo)
}

async function gitCommit (emitter: EventEmitter, appInfo: ICreateAppInfo) {
  if (appInfo.gitlab === false) return

  await withSpinner(
    '提交本地代码',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      const git = simpleGit(`${appInfo.cwd}/${appInfo.app}`)
      await git.add('-A')
      await git.commit('first commit by @ali/mm-cli', '--no-verify')
      await git.push('origin', 'master')
    }
  )(emitter, appInfo)
}

async function installDependencies (emitter: EventEmitter, appInfo: ICreateAppInfo) {
  if (appInfo.install === false) return
  await withSpinner(
    '安装应用依赖',
    async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
      const command = process.platform === 'win32' ? 'tnpm.cmd' : 'tnpm'
      const args = ['install', '--color']
      const options = { cwd: `${appInfo.cwd}/${appInfo.app}` }
      return new Promise((resolve, reject) => {
        spawn(command, args, options)
          .on('data', message => {
            emitter.emit('data', message)
          })
          .on('error', error => {
            emitter.emit('error', error)
            reject(error)
          })
          .on('close', async code => {
            // MO TODO 待测试 resp => code
            // if (typeof resp === 'object') {
            //   logger.debug(__filename)
            //   logger.warn(redBright('@deprecated 请不要在 close 事件中返回一个对象'), resp)
            // }
            if (code === 0) resolve(code)
            else reject(code)
          })
      })
    }
  )(emitter, appInfo)
}

function outputPlatformInfo (emitter: EventEmitter, appInfo: ICreateAppInfo,
  {
    rapProject,
    iconfontProject,
    defInfo,
    gitProject,
    spma,
    chartparkProject
  }
) {
  if (gitProject?.web_url || rapProject?.id || defInfo?.id || iconfontProject?.id || chartparkProject?.projectId || spma) { // eslint-disable-line camelcase
    // MO TODO emitter.emit('data' => console.log
    const platforms = []
    if (gitProject?.web_url) { // eslint-disable-line camelcase
      platforms.push({ title: 'GitLab 仓库', repository: gitProject.web_url })
    }
    if (rapProject?.id) {
      platforms.push({ title: 'RAP2 仓库', repository: `https://rap2.alibaba-inc.com/repository/editor?id=${rapProject.id}` })
    }
    if (defInfo?.id) {
      platforms.push({ title: 'DEF 研发平台', repository: `https://work.def.alibaba-inc.com/app/${defInfo.id}/index` })
    }
    if (iconfontProject?.id) {
      platforms.push({ title: 'Iconfont 仓库', repository: `https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=${iconfontProject.id}` })
    }
    if (chartparkProject?.projectId) {
      platforms.push({ title: 'Chartpark 项目', repository: `https://chartpark.alibaba-inc.com/#!/manage/index?projectId=${chartparkProject.projectId}` })
    }
    if (spma) {
      platforms.push({ title: 'APlus', repository: `https://aplus.alibaba-inc.com/aplus/page.htm?pageId=17164&id=${spma}` })
      platforms.push({ title: '数据小站 DataPlus', repository: `https://data.alimama.net/#!/performance/index?spma=${spma}` })
    }
    console.log(greenBright('\nⓘ 已自动创建以下关联项目'))
    const maxLength = Math.max(...platforms.map(item => getLength(item.title)), 10)
    platforms.forEach(item =>
      console.log('  ', prefixLength(item.title, maxLength), underline(item.repository))
    )
    console.log('')
  }
}

export default async function init (appInfo: ICreateAppInfo, emitter: EventEmitter) {
  const { kit: kitName } = appInfo
  const kitInfo = await getKit(kitName)
  const { package: kitPackage } = kitInfo
  let kitCommandListModule = require(`${RMX_HOME}/kit/${appInfo.kit}/node_modules/${kitPackage}/dist/commands`)
  kitCommandListModule = kitCommandListModule.__esModule ? kitCommandListModule.default : kitCommandListModule
  const kitCommandList = await kitCommandListModule()
  const kitInitCommand = kitCommandList.find(commandConfig => commandConfig.name === 'init' || commandConfig.command === 'init')

  // init 命令的 __before__ 方法先执行
  try {
    if (kitInitCommand.__before__) {
      await kitInitCommand.__before__(appInfo, msg => {
        emitter.emit('data', msg)
      })
    }
  } catch (error) {
    emitter.emit('error', error)
  }

  // 获取 gitlab token
  const projectPath = `${appInfo.cwd}/${appInfo.app}`
  if (await fse.pathExists(projectPath)) {
    return emitter.emit('error', `初始化失败，当前目录下已存在同名文件夹 ${projectPath}`)
  }

  const gitProject = await createGitLabRepository(emitter, appInfo)
  const rapProject = await createRAPRepository(emitter, appInfo)
  const iconfontProject = await createIconfontProject(emitter, appInfo)
  const chartparkProject = await createChartparkProject(emitter, appInfo)
  const spma = await createSpma(emitter, appInfo)
  const defInfo = await joinDef(emitter, appInfo)
  await createClue(emitter, appInfo)

  // 关联项目的信息存入 appInfo
  appInfo.snapshoot = {
    ...(appInfo.snapshoot || {}),
    gitProject,
    rapProject,
    iconfontProject,
    chartparkProject,
    spma,
    defInfo
  }

  await createLocalApp(emitter, appInfo, {
    gitProject,
    rapProject,
    iconfontProject,
    defInfo,
    spma,
    chartparkProject
  })

  await gitCommit(emitter, appInfo)
  outputPlatformInfo(emitter, appInfo, {
    gitProject,
    rapProject,
    iconfontProject,
    defInfo,
    spma,
    chartparkProject
  })
  await installDependencies(emitter, appInfo)

  // init 命令的 __after__ 后执行
  try {
    if (kitInitCommand.__after__) {
      await kitInitCommand.__after__(appInfo, emitter)
      // message => { emitter.emit('data', message) }
    }
  } catch (error) {
    return emitter.emit('error', error)
  }
}
