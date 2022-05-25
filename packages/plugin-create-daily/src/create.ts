/**
 * 根据已存在的版本最大的daily分支来+1创建新的开发分支，避免多人开发分支重复创建冲突
 */
import { CommanderStatic } from 'commander'
import { gray, blueBright, yellowBright } from 'chalk'
import * as semver from 'semver'
import * as inquirer from 'inquirer'
import * as dateformat from 'dateformat'
import { utils } from 'thx-cli-core'
const {
  getAppPkg,
  getAppPath,
  execCommandReturn,
  getPrecentBranch,
  spawnCommand,
  getLogger
} = utils
const pkg = require('../package.json')
const logger = getLogger(pkg.name)

// 时间戳，避免版本号里有 0 开头，特殊处理下
const nowDate = new Date()
const milliseconds = parseInt(dateformat(nowDate, 'l'), 10) // 防止0开头
const TAG = dateformat(nowDate, 'yyyymmdd.HMMss.') + milliseconds // 小时也防止0开头

// semver不支持xx.xx.0xx这种0开头的版本，
// 自行实现.gt对比版本方法
// ver1 > ver2
function gt(ver1: string, ver2: string) {
  const ver1s = ver1.split('.').map(v => parseInt(v, 10))
  const ver2s = ver2.split('.').map(v => parseInt(v, 10))

  if (ver1s[0] > ver2s[0]) {
    return true
  } else if (ver1s[1] > ver2s[1]) {
    return true
  } else if (ver1s[2] > ver2s[2]) {
    return true
  }

  return false
}

/**
 * 选择分支格式
 * 1 - 日期格式
 * 2 - 自定义版本
 */
async function buildInquirer(
  command: CommanderStatic,
  _tag: string,
  _allTags: Array<string>
) {
  const questions = [
    {
      type: 'input',
      name: 'branch', // 给分支取一个语义化的名称吧，不要再用 daily了
      message:
        blueBright('『请输入语义化的分支名称』') +
        gray(`（不含版本号部分，例如 feature_playground）`) +
        blueBright('：'),
      filter(value: string) {
        return value.trim() // 去除前后空格
      },
      validate(value: string) {
        if (!value.trim()) {
          return '分支名称不能为空'
        }
        return true
      },
      when(answers: any) {
        return !command.branch
      }
    },
    {
      type: 'list',
      name: 'dateVersion',
      message: blueBright('『请选择要创建的分支格式』：'),
      choices: [
        {
          name: `时间戳格式 ${gray(
            '推荐。自动以当前时间戳为分支版本，格式为 YYYYMMDD.HHmmss.***'
          )}`,
          value: TAG,
          short: '时间戳格式'
        },
        {
          name: `语义化格式 ${gray('Semver，例如 1.0.0')}`,
          value: 'semver',
          short: '语义化格式'
        }
      ],
      when(answers: any) {
        return !command.timestamp
      }
    },
    {
      type: 'input',
      name: 'semverVersion',
      message:
        blueBright('『请输入版本号』') +
        gray(`（当前最新版本为 ${_tag}，格式为 x.x.x）`) +
        blueBright('：'), //  `当前最新版本为${chalk.cyan(_tag)}\n请输入要创建的版本，格式如${chalk.cyan('x.x.x')}`,
      when(answers: any) {
        return answers.dateVersion === 'semver'
      },
      validate(value: string) {
        if (!semver.valid(value)) {
          return '请输入合法的版本号！'
        }

        for (const tag of _allTags) {
          if (tag === value) {
            return '已存在相同版本的分支，请重新输入'
          }
        }

        return true
      }
    }
  ]
  return inquirer.prompt(questions)
}

// 获取本地最新的tag
async function getAllTags() {
  // 获取tag
  const gitTags = async function () {
    const reg = /publish\/(\d+\.\d+\.\d+)$/
    const stdout = await execCommandReturn('git tag')
    let tags = []

    if (!stdout) {
      return tags
    }

    tags = stdout.split(/\n/)
    if (!tags.length || tags[0] === '') {
      tags = ['publish/0.0.0']
    }
    tags = tags
      .filter(v => !!v && reg.test(v))
      .map(v => {
        return reg.exec(v)[1]
      })
    return tags
  }

  // 获取分支
  const gitBranchs = async function () {
    const reg = /.+\/(\d+\.\d+\.\d+)$/
    const stdout = await execCommandReturn('git branch -a')
    let tags = stdout.split(/\n/)
    if (!tags.length) {
      tags = []
    }
    tags = tags
      .filter(v => !!v && reg.test(v))
      .map(v => {
        return reg.exec(v)[1]
      })
    return tags
  }

  let [tags, branches] = await Promise.all([gitTags(), gitBranchs()])

  tags = tags.concat(branches)

  return tags
}

async function getLatestTag() {
  const tags = await getAllTags()
  tags.sort((a, b) => {
    return gt(b, a) ? 1 : -1
  })
  return tags[0]
}

export default async (command: CommanderStatic) => {
  const appPath = getAppPath()
  logger.info(appPath)
  const pkg = getAppPkg(appPath)
  const magixCliConfig = pkg.magixCliConfig || {}

  // 检测是否在项目目录下
  // await getRootPath()

  const currentBranch = await getPrecentBranch()

  // 不在 master 分支下执行，给出提示
  if (currentBranch !== 'master') {
    const questions = [
      {
        type: 'confirm',
        name: 'confirmCheckout', //
        message: `当前分支不是 ${yellowBright(
          'master'
        )} ，确认要基于当前分支创建吗？`
      }
    ]
    const { confirmCheckout } = await inquirer.prompt(questions)
    if (!confirmCheckout) {
      return
    }
  }

  // 先更新下最新的tag/branch等
  await spawnCommand('git', ['pull', 'origin', currentBranch])
  const allTags = await getAllTags()
  const latestTag = await getLatestTag()
  const answers = await buildInquirer(command, latestTag, allTags)

  answers.dateVersion = answers.dateVersion || TAG
  answers.branch = answers.branch || command.branch

  const newVersion =
    answers.dateVersion === 'semver'
      ? answers.semverVersion
      : answers.dateVersion // 自定义分支
  const newDaily = `${answers.branch}/${newVersion}`

  console.log(gray.bold(`$ git checkout -b ${newDaily}`))
  await spawnCommand('git', ['checkout', '-b', newDaily])
  console.log(gray.bold(`$ git push --set-upstream origin ${newDaily}`))
  await spawnCommand('git', ['push', '--set-upstream', 'origin', newDaily])

  // 提供切换完分支后自定义的一些命令操作
  if (magixCliConfig.createDailyHook) {
    const hookCommands = magixCliConfig.createDailyHook.trim().split(/\s+/)
    const firstCommand = hookCommands.shift()
    await spawnCommand(firstCommand, hookCommands)
  }
}
