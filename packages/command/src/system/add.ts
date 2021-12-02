import { blueBright, cyanBright, greenBright, grey, yellowBright } from 'chalk'
import simpleGit from 'simple-git'
import * as fse from 'fs-extra'
import { prompt } from 'inquirer'
import { CommanderStatic } from 'commander'
import { utils } from 'thx-cli-core'
import { ICommandConfig, IKitInfo, ITemplate } from 'thx-cli-core/types'
import { prepareKitName } from './init'
import { EventEmitter } from 'events'
import logger from '../logger'
import { join } from 'path'
import { tmpdir } from 'os'
const { getLength, fixLength, withSpinner, getAppPath, getAppRC } = utils

async function prepareTemplate (kitInfo: IKitInfo, command: CommanderStatic) {
  const maxTitleLength = Math.max(...kitInfo.templates.map(template => getLength(template.title)), 10)
  const maxDescriptionLength = Math.max(...kitInfo.templates.map(template => getLength(template.description)), 10)
  const maxRepositoryLength = Math.max(...kitInfo.templates.map(template => getLength(template.repository)), 10)
  const templateChoices = kitInfo.templates.map(template => {
    return {
      name: `${fixLength(template.title, maxTitleLength)} ${grey(fixLength(template.description, maxDescriptionLength))} ${grey(fixLength(template.repository, maxRepositoryLength))} ${grey.italic(template.directory)} ${grey('=>')} ${grey.italic(template.output)}`,
      value: template,
      short: template.title
    }
  })

  const questions = [
    {
      type: 'list',
      name: 'template',
      message: greenBright('『请选择模版』：'),
      choices: templateChoices,
      when: command.template === undefined
    }
  ]
  const answer = await prompt(questions)
  const nextTemplate: ITemplate = answer.template

  return nextTemplate
}

async function prepareModuleName () {
  const questions = [{
    type: 'input',
    name: 'module',
    message: '『请输入模块名称』：',
    validate: (value, answer) => {
      if (!value) return '请输入模块名称'
      return true
    }
  }]

  const answers = await prompt(questions)
  return answers.module
}

async function cloneTemplate (emitter: EventEmitter, templateInfo: ITemplate, appPath: string, dest: string) {
  logger.info(`${templateInfo.repository} => ${appPath}`)
  await withSpinner(
    `克隆模版 ${templateInfo.repository} => ${dest}`,
    async (emitter: EventEmitter, templateInfo: ITemplate) => {
      const modulePath = join(appPath, dest)
      const git = simpleGit(appPath)

      // 最简实现
      if (!templateInfo.directory) {
        await git.clone(templateInfo.repository, appPath)
        if (templateInfo.branch) {
          logger.info(`git checkout ${templateInfo.branch}`)
          await git.cwd(appPath)
          await git.checkout(templateInfo.branch)
        }
        return
      }

      const tmpAppPath = join(tmpdir(), templateInfo.name || '', `${Math.random()}`) // 临时目录/模版名称
      const tmpAppDirectory = join(tmpAppPath, templateInfo.directory) // 临时目录/模版名称/子目录

      logger.info(`${templateInfo.repository} => ${tmpAppPath}`)
      await git.clone(templateInfo.repository, tmpAppPath)

      if (templateInfo.branch) {
        logger.info(`git checkout ${templateInfo.branch}`)
        await git.cwd(tmpAppPath)
        await git.checkout(templateInfo.branch)
      }

      logger.info(`${tmpAppDirectory} => ${modulePath}`)
      await fse.copy(tmpAppDirectory, join(appPath, dest), { overwrite: true })
      // await fse.move(tmpAppDirectory, join(appPath, dest), { overwrite: true })
      // MO FIXED move => copy，move 会直接覆盖目标目录，copy 则是拷贝源目录中的所有文件到目标目录。

      logger.info(`remove ${tmpAppPath}`)
      await fse.remove(tmpAppPath)
    },
    (error: Error) => {
      logger.error(error)
      // console.error(`您没有该脚手架仓库访问权限或该仓库地址不存在，仓库地址：${templateInfo.repository}`)
      console.log(error.message)
    }
  )(emitter, templateInfo)
}

// eslint-disable-next-line no-unused-vars
async function createBlankModule (emitter: EventEmitter, command: CommanderStatic, appPath: string, dest: string) {
  const { ts } = command
  const extension = ts ? 'ts' : 'js'

  const htmlPath = `${process.cwd()}/${module}.html`
  await fse.outputFile(htmlPath, `hello ${module}`)
  console.log(greenBright(`✔ ${module}.html`), grey(htmlPath))

  const lessPath = `${process.cwd()}/${module}.less`
  await fse.outputFile(lessPath, `.${module} {}`)
  console.log(greenBright(`✔ ${module}.less`), grey(lessPath))

  const scriptPath = `${process.cwd()}/${module}.${extension}`
  await fse.outputFile(scriptPath, 'export default {}')
  console.log(greenBright(`✔ ${module}.${extension}  `), grey(scriptPath))
}

async function commandAction (kitName: string, command: CommanderStatic) {
  const curPath = process.cwd()
  const appPath = await getAppPath()
  const appRC = await getAppRC(appPath)

  // 1. 获取套件信息
  if (!kitName) {
    if (appRC && appRC.kit) kitName = appRC.kit
    else kitName = await prepareKitName()
  }
  const { kits } = await utils.getModuleList()
  const kitInfo = kits.find(kit => kit.name === kitName)

  // 2. 获取模版信息
  let templateInfo: ITemplate
  // 通过参数指定 模版仓库地址 和 子目录路径
  if (command.template && command.directory) {
    const { template: templateName, branch: templateBranch, directory: templateDirectory, output: templateOutput } = command
    templateInfo = { repository: templateName, branch: templateBranch, directory: templateDirectory, output: templateOutput }
  }
  // 通过参数指定 模版唯一标志
  if (!templateInfo && command.template) {
    templateInfo = kitInfo.templates.find((item: ITemplate) => item.name === command.template)
  }
  // 参数未指定任何模版信息，提示选择可用的模版列表
  if (!templateInfo) {
    templateInfo = await prepareTemplate(kitInfo, command)
  }
  console.log('模版仓库', templateInfo)
  logger.info(templateInfo)

  // 3. 获取模块信息
  let { module: moduleName } = command
  if (!moduleName) moduleName = await prepareModuleName()

  const moduleDest = join(templateInfo.output, moduleName)
  const modulePath = join(curPath, moduleDest)
  if (await fse.pathExists(modulePath)) {
    const answers = { clear: true }
    if (command.yes) {
      answers.clear = true
    } else {
      const message = moduleName === '.' ? '是否清空当前目录？'
        : yellowBright(`当前目录下已存在同名文件夹 ${cyanBright(moduleDest)}，是否先执行删除？`)

      Object.assign(answers,
        await prompt([
          {
            type: 'confirm',
            name: 'clear',
            default: true,
            message
          }
        ])
      )
    }
    if (answers.clear) {
      if (moduleName === '.') await fse.emptyDir(modulePath)
      else await fse.remove(modulePath)
    }
  }

  // 4. 获取输出目录
  // if (moduleName === '.') {
  //   const questions = [{
  //     type: 'input',
  //     name: 'output',
  //     message: greenBright('『请输入输出目录』：'),
  //     validate: (value, answer) => {
  //       if (!value) return '请输入输出目录'
  //       return true
  //     },
  //     default: templateInfo.output,
  //     when: moduleName === '.'
  //   }]
  //   const answers = await prompt(questions)
  //   templateInfo.output = answers.output
  // }

  const emitter = new EventEmitter()
  emitter
    .on('data', (chunk) => logger.info(chunk))
    .on('error', (error) => logger.error(error))
    .on('close', (code) => logger.info(code))
  await cloneTemplate(emitter, templateInfo, curPath, moduleDest)

  function consoleWithFile (arg, ...args) {
    console.log(arg, ...args)
    logger.info(arg, ...args)
  }
  consoleWithFile(`\n模块 ${cyanBright(modulePath)} 创建成功！\n`)

  return modulePath

  /**

  */
}

/**
 * 内置的添加页面命令
 */
const commandConfig: ICommandConfig = {
  name: 'tmpl',
  command: 'tmpl [kit]',
  description: '生成样板模块',
  options: [
    ['--template   <template>', '模版仓库地址'],
    ['--branch     <branch>', '模版仓库分支'],
    ['--directory  <directory>', '模版仓库的子目录'],
    ['--output     <output>', '模版输出目录', 'src'],
    ['-m, --module <module>', '要生成的模块名称'],
    ['--yes', 'avoid all prompts']
    // ['--ts', '生成 typescript 文件']
  ],
  async action (kit: string, command: CommanderStatic) {
    // MO FIXED await?
    return await commandAction(kit, command)
  },
  on: [
    ['--help', () => {
      console.log('\nExamples:')
      console.log(`  ${grey('$')} ${blueBright('mm tmpl')}`)
      console.log()
    }]
  ]
}

export default commandConfig
