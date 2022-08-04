import { grey, yellowBright, greenBright, blueBright } from 'chalk'
import * as utils from '../utils/index'
import * as semver from 'semver'
import * as path from 'path'
import logger from '../logger'
import { IOutdatedPackage, IPackage } from '../../types'
import * as minimist from 'minimist'
import { SpawnOptions } from 'child_process'
import { prompt, QuestionCollection } from 'inquirer'
const argv = minimist(process.argv.slice(2))
const {
  getTnpmPackage,
  getOutdatedPkgs,
  spawn,
  fixLength,
  needBlockProcessByModuleOutdated,
  IS_OPEN_SOURCE,
  CLI_NAME,
  skipCheckNpmPackage
} = utils
// const pkg: IPackage = require('../../package.json')

// 需要检测版本的核心包
const NEED_CHECK_DEP_PACKAGE_LIST = [
  // 'thx-cli-core', '@ali/mm-cli-server', '@ali/mm-cli-webui'
]
const CWD = path.join(__dirname, '../../')

/**
 * 获取工具的最新版本号，然后跟本地对比，提示升级
 * MO FIXED 实现逻辑不清晰
 */
export default async function checkCliOutdated(pkg) {
  // --skip-update-check跳过检测
  // skipCheckNpmPackage 一天内跳过检测版本升级
  if (argv['skip-update-check'] || skipCheckNpmPackage(pkg.name)) {
    return
  }

  const start = Date.now()
  logger.debug('⌚️ checkCliOutdated')

  const outdatedPkgs: Array<IOutdatedPackage> = []
  let outdatedCliPkg

  // 检测 CLI 版本
  const cliLocalVersion = pkg.version
  const tnpmPkg = await getTnpmPackage(pkg.name)
  const { version: cliLatestVersion } = tnpmPkg || {}
  if (cliLatestVersion && semver.lt(cliLocalVersion, cliLatestVersion)) {
    outdatedPkgs.push(
      (outdatedCliPkg = {
        name: pkg.name,
        localVersion: cliLocalVersion,
        latestVersion: cliLatestVersion
      })
    )
  }

  // 检测依赖包版本
  const depOutdatedPkgs = await getOutdatedPkgs(
    CWD,
    NEED_CHECK_DEP_PACKAGE_LIST
  )
  outdatedPkgs.push(...depOutdatedPkgs)

  logger.debug(`⌚️ checkCliOutdated ${Date.now() - start}ms.`)
  if (!outdatedPkgs.length) return

  const message = [
    yellowBright(`\n⚠️  检测到 ${CLI_NAME} CLI 依赖的核心包可更新，请升级：`)
  ]
  outdatedPkgs.forEach((pkg, index) => {
    const prefix = index === outdatedPkgs.length - 1 ? '└──' : '├──'
    message.push(
      `${grey(prefix)} ${pkg.name} ${grey('本地版本：')}${
        pkg.localVersion
      }，${grey('最新版本：')}${greenBright(pkg.latestVersion)}`
    )
  })
  message.push(
    `\n运行 ${blueBright(
      `${IS_OPEN_SOURCE ? 'npm' : 'tnpm'} install -g ${pkg.name}`
    )} 或者 ${blueBright(`yarn global add ${pkg.name}`)} 即可更新。`,
    grey(
      `CHANGELOG: ${
        IS_OPEN_SOURCE
          ? 'https://github.com/thx/thx-cli/blob/master/CHANGELOG.md'
          : 'https://gitlab.alibaba-inc.com/mmfs/mm-cli/blob/master/CHANGELOG.md'
      }\n`
    ) // MO TODO 缺少文档
  )

  console.log(message.join('\n'))
  logger.info(message.join('\n'))

  // 提示是否升级 CLI
  if (!outdatedCliPkg) return

  // 防疲提示
  if (needBlockProcessByModuleOutdated(pkg.name)) {
    await installCli(outdatedCliPkg)
  }
}

async function installCli(pkg) {
  const questions: QuestionCollection = [
    {
      type: 'confirm',
      name: 'isUpdate',
      default: true,
      message: `要立即更新吗（${grey('本地版本：')}${pkg.localVersion}${grey(
        '，最新版本：'
      )}${greenBright(pkg.latestVersion)}）？`
    },
    {
      type: 'list',
      name: 'command',
      message: '请选择包管理工具',
      choices: [
        ...[
          ['yarn', `yarn global add ${pkg.name}`],
          ['tnpm', `tnpm install -g ${pkg.name}`],
          ['npm', `npm install -g ${pkg.name}`]
        ].map(([name, value]) => ({
          name: `${fixLength(name, 10)} ${grey(value)}`,
          value,
          short: value
        }))
        // { name: '暂不更新，下次再说', value: 'no' }
      ],
      when(answer) {
        return answer.isUpdate
      }
    }
  ]
  const answer = await prompt(questions)
  if (answer.isUpdate && answer.command !== 'no') {
    await new Promise((resolve, reject) => {
      const [command, ...args] = answer.command.split(' ')

      //  tnpm install 禁止 SUDO 执行 （根据判断env.USER是否为 root），所以需要将 USER 设为其他值
      const rootUser = process.env.USER
      process.env.USER = ''
      // 子进程执行的 options 配置
      const options: SpawnOptions = {
        stdio: 'inherit'
      }

      // 如果是 sudo 则降权执行安装
      if (process.env.SUDO_GID) {
        options.gid = parseInt(process.env.SUDO_GID, 10)
      }
      if (process.env.SUDO_UID) {
        options.uid = parseInt(process.env.SUDO_UID, 10)
      }

      spawn(command, args, options)
        .on('data', message => console.log('data', message))
        .on('error', error => {
          console.error(error)
          reject(error)
        })
        .on('close', async code => {
          // 还原 root
          process.env.USER = rootUser

          if (code === 0) resolve(null)
          else reject(code)
        })
    })
  }
}
