#!/usr/bin/env node
// ✘✖︎ ⓘ ✔ ✦ ♨ ℹ️ 🔗👻💥🔥🌈🍭🍬🎁🥇🥈🥉🏆🎗🧩🚐⌚️📱💻⌨️🖥🖨🖱💾💡⚒🛠⚙️🔒🔓🔍❌⭕️🛑⛔️🚫💯💢♨️❗️❕❔❓⚠️♻️🇨🇳🏳️🏴🏁🇱🇷💬📢

import { grey, redBright, blueBright, whiteBright } from 'chalk' // MO Terminal string styling done right
import * as program from 'commander' // MO the complete solution for node.js command-line programs
import * as minimist from 'minimist'
import { utils, cliUtils } from 'thx-cli-core'
import systemCommandList from './system/index'
import defaultKitCommandList from './kit/index'
import logger from './logger'
import { IKitInfo } from 'thx-cli-core/types'

// 入口命令名称 thx/mx
const pkg = require('../package.json')
const {
  initMMHome,
  getAppPkg,
  getAppPath,
  getAppRC,
  // goldlog,
  getKit,
  getCliName
} = utils
const {
  checkCliOutdated,
  registerCommand,
  checkModuleMissed,
  registerKitCommandList,
  registerPluginCommand
} = cliUtils
const cliName = getCliName()

// http://patorjk.com/software/taag/#p=display&f=Slant&t=M%20M%20C%20L%20I
logger.info(
  blueBright(`

    __  ___   __  ___   ______   __       ____
   /  |/  /  /  |/  /  / ____/  / /      /  _/
  / /|_/ /  / /|_/ /  / /      / /       / /  
 / /  / /  / /  / /  / /___   / /___   _/ /   
/_/  /_/  /_/  /_/   \\____/  /_____/  /___/   

  ${pkg.name} run v${pkg.version}
  
  ${process.argv.join(' ')}
`)
)
// logger.debug(process.env)

function outputHelp() {
  // docs
  console.log()
  console.log('Documentation:') // MO rmx => mm-cli, yarn add @ali/mm-cli
  console.log(
    `  ${grey('$')} ${blueBright.bold('https://thx.github.io/rmx-cli-book')}`
  ) // MO TODO 文档缺失
  console.log(
    `  ${grey('$')} ${blueBright.bold('https://yuque.antfin.com/mmfs/cli')}`
  ) // MO TODO 文档缺失

  // examples
  console.log()
  console.log('Examples:')
  console.log(`  ${grey('$')} ${blueBright.bold(`${cliName} init`)}`)
  console.log(`  ${grey('$')} ${blueBright.bold(`${cliName} dev`)}`)
  console.log('')

  // test for help info
  // this.commands.forEach((command: program.CommanderStatic) => {
  //   console.log(whiteBright.bgBlueBright(`\n\n========== ${command.name()} ==========\n\n`))
  //   command.outputHelp()
  // })
}

async function prepare() {
  const appPath = getAppPath()
  const appConfig = getAppRC(appPath) // 兼容 .rmxrc 配置
  const appPkg = getAppPkg(appPath)

  // magix 套件下的 mm dev 命令强制重新 sudo 执行，以支持写入系统 host 等系统级操作
  // if (
  //   process.env.USER !== 'root' &&
  //   process.platform !== 'win32' &&
  //   process.argv[2] === 'dev' &&
  //   appPkg.magixCliConfig
  // ) {
  //   try {
  //     console.log(
  //       blueBright(`ⓘ 本命令已自动转 sudo 执行 ${grey('(dev 需要 sudo 权限)')}`)
  //     )
  //     await utils.spawnCommand('sudo', [cliName, ...process.argv.slice(2)])
  //   } catch (error) {
  //     console.log(redBright(`${error}`))
  //   }
  //   return process.exit(1)
  // } else {
  // 初始化 ~/.mm 目录和文件。
  initMMHome()

  // 例如 node rmx init react => node bin SUB_COMMAND kitName
  const [, , SUB_COMMAND, kitName] = process.argv
  logger.debug(whiteBright.bgBlueBright(__filename))
  logger.debug(process.argv)

  // 服务不稳定，暂去掉.
  // goldlog('mm-cli.system.command', process.argv)

  // MO 1. 检查自身是否需要更新。只做提示，不会自动强制更新。
  await checkCliOutdated(pkg)

  // MO 2. 检测域登录状态。如果未登录，则先提示登录。
  // await gitlab.login()

  let isSystemCommand = false // 系统命令
  let isKitCommand = false // 套件命令
  let isPluginCommand = false // 是否插件命令
  isSystemCommand = SUB_COMMAND
    ? !!systemCommandList.find(
        item =>
          [item.name, item.command, item.alias].indexOf(SUB_COMMAND) !== -1
      )
    : false

  // MO 3. 注册 --version、--help
  program
    .version(pkg.version, '-v, --version')
    .usage('<command> [options]')
    // .option('--color', '支持输出带颜色的 stdout、stderr') // 1.x MO TODO 默认开启？在哪里支持的呢？
    .option('--skip-update-check', '跳过版本更新检测')
    .option('--kit <kit>', '[beta] 强制指定套件，默认从应用 .rmxrc 中读取')
    .on('--help', outputHelp)

  // MO 4. 注册系统命令：login、logout、install、uninstall、list, web, init
  program
    .command(blueBright.bold('系统命令：')) // 分隔符
    .description(`              ${grey.italic(`${pkg.name}@${pkg.version}`)}`)
  systemCommandList.forEach(commandConfig =>
    registerCommand(program, commandConfig)
  )
  if (isSystemCommand) return

  // MO 6. 注册插件命令
  // 套件与插件命令的升级安装提示隔离开
  await utils.took(
    redBright('prepare/注册插件命令'),
    async () => {
      program.command(blueBright.bold('插件命令：')) // 分隔符
      const { plugins } = await utils.fetchModuleList()
      const quickMatch = plugins.find(
        pluginInfo =>
          pluginInfo.command.name === SUB_COMMAND ||
          pluginInfo.command.alias === SUB_COMMAND
      )
      if (quickMatch) {
        isPluginCommand = true
        // 判断安装套件
        if (!quickMatch.version) await checkModuleMissed('plugin', quickMatch)
        await registerPluginCommand(program, quickMatch)
        return
      }
      logger.debug('plugins', plugins)
      for (const pluginInfo of plugins) {
        // if (!pluginInfo.version) continue
        await registerPluginCommand(program, pluginInfo)
      }
    },
    logger
  )

  // 如果是插件命令跳出后续套件安装环节
  if (isPluginCommand) return

  // MO 5. 注册套件命令
  // MO TODO 如果是系统命令，则不注册套件命令吗？其实应该注册的！
  await utils.took(
    redBright('prepare/注册套件命令'),
    async () => {
      const { kits } = await utils.fetchModuleList()
      let kitInfo: IKitInfo = null

      const __argv__ = minimist(process.argv)
      if (__argv__.kit) {
        kitInfo = kits.find(kit => kit.name === __argv__.kit)
      }
      if (!kitInfo && kitName) {
        kitInfo = kits.find(kit => kit.name === kitName)
      }
      if (!kitInfo) {
        // 读取应用配置，优先从 .rmxrc 中读取，其次中 package.json 读取
        // 其他非系统级命令，非插件命令的套件里的其他命令
        // 读取项目 package.json 里的 rmxConfig.kit 字段来判断是哪个套件
        let appKitName =
          (appConfig && appConfig.kit) ||
          (appPkg.rmxConfig && appPkg.rmxConfig.kit)
        if (appPkg.magixCliConfig) appKitName = 'magix' // 如果检测到 magixCliConfig 则认为是 magix 套件
        if (appKitName) kitInfo = kits.find(kit => kit.name === appKitName)
        if (!kitInfo) kitInfo = await getKit(appKitName)
      }
      logger.debug('🚀 kitInfo', kitInfo)
      if (kitInfo) {
        // 判断安装套件
        await checkModuleMissed('kit', kitInfo)
        // 注册套件命令
        program
          .command(`${blueBright.bold('套件命令：')}`) // 分隔符
          .description(
            `              ${grey.italic(
              `${kitInfo.package}${
                kitInfo.version ? `@${kitInfo.version}` : ''
              }`
            )}`
          )
        isKitCommand = await registerKitCommandList(
          program,
          kitInfo,
          systemCommandList,
          defaultKitCommandList
        )
      }
    },
    logger
  )

  if (isKitCommand) return

  program.command(blueBright.bold('其他命令：')) // 分隔符

  // 未知命令会报错
  program.on('command:*', function () {
    console.error(
      redBright(
        `\n✘ 无效命令 %s，请执行 ${blueBright(
          `${cliName} -h`
        )} 查看所有可用命令\n`
      ),
      program.args.join(' ')
    )
    process.exit(1)
  })
  // }
}

;(async () => {
  await utils.took('preparation', async () => {
    await prepare()
  })
  program.parse(process.argv)
})()
