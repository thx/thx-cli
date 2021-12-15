import { blueBright, cyanBright, grey } from 'chalk'
import { EventEmitter } from 'events'
import { util } from 'thx-magix-scripts'
import * as minimist from 'minimist'
import * as fse from 'fs-extra'
import { utils } from 'thx-cli-core'
import { ICreateAppInfo } from 'thx-cli-core/types'
import { CommanderStatic } from 'commander'

const { checkPackageVersionsCorrect, replace: replaceUtil } = util
const { execCommand, withSpinner, checkDependencies, getCliName } = utils
// 入口命令名称 thx/mx
const cliName = getCliName()

export default async () => {
  const argv = minimist(process.argv.slice(2))
  const command = argv._[0]

  // 需要检测环境的命令，除了init/gallery
  const checkCommands = [
    'dev',
    'models',
    'add',
    'daily',
    'publish',
    'spmlog',
    'chartpark',
    'iconfont'
  ]
  if (checkCommands.includes(command)) {
    // 判断目录下有没有node_modules，如果没有则先执行npm install安装包
    const rootUser = process.env.USER // npm install 会判断 USER==='root'，sudo 不允许安装
    process.env.USER = ''
    await checkDependencies('npm', ['install', '--color'])
    process.env.USER = rootUser // 还原

    // 检测 package.json 里包版本与本地安装版本是否一致，给出升级提示
    if (command !== 'dev') {
      // mm dev 不需要检测，因为会执行 mm sync 安装同步 npm 包了。
      await checkPackageVersionsCorrect()
    }
  }

  const commands = []

  /**
   * 项目初始化
   */

  commands.push({
    command: 'init',
    description: '项目初始化, 默认 tnpm install 安装',
    params: {
      // 项目名称的校验
      nameValidate(value, answer, scaffoldsMap) {
        // 项目名称有校验规则的，校验一下
        const scaffoldInfo = scaffoldsMap[answer?.scaffold?.repository]
        const rule = scaffoldInfo?.nameValid?.rule
        if (rule) {
          const regExp = new RegExp(rule)
          if (!regExp.test(value)) {
            return (
              scaffoldInfo?.nameValid?.tips ??
              `项目名称规则校验失败，规则为：${rule}`
            )
          }
        } else if (!value.trim()) {
          return '项目名称不能为空'
        } else if (fse.pathExistsSync(value)) {
          // 判断是否已存在文件夹
          return '当前目录下已存在同名文件夹，换个项目名称吧'
        }

        return true
      }
    },
    // cli 内置的 init 完毕后，执行 magix 套件特有的后续操作
    // after 方法 cli 会自动执行
    // __after__ 是给 init 特殊提供的, cli 与 webui 共用逻辑
    async __after__(appInfo: ICreateAppInfo, emitter) {
      const { snapshoot = {}, cwd, app, gitlab } = appInfo
      const appPath = `${cwd}/${app}`
      const pkgPath = `${appPath}/package.json`
      const pkg = await fse.readJSON(pkgPath)

      /**
       * 初始化项目后，进行全文件的项目名称的替换，目前只支持zs_scaffold脚手架
       */

      if (snapshoot?.scaffoldInfo?.replaceable) {
        await withSpinner(
          '开始进行脚手架的项目全局项目名称替换',
          async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
            await replaceUtil.adjustProject(appInfo)
          }
        )(emitter, appInfo)
      }

      // initCompleted配置：允许 mm init 完执行一些自定义的命令
      if (pkg.magixCliConfig.initCompleted) {
        await execCommand(pkg.magixCliConfig.initCompleted, { cwd: appPath })
      }

      console.log(`\n应用 ${cyanBright(app)} 创建成功！你可以执行以下命令：\n`)
      console.log(`  ${grey('●')} ${blueBright(`cd ${app}`)}`)
      console.log(
        `  ${grey('●')} ${blueBright(`${cliName} dev`)}      ${grey(
          '启动本地开发服务'
        )}`
      )
      console.log(
        `  ${grey('●')} ${blueBright(`${cliName} build`)}      ${grey(
          '本地构建项目'
        )}`
      )

      console.log(
        `  ${grey('●')} ${blueBright(`${cliName} -h`)}       ${grey(
          '查看所有命令帮助'
        )}`
      )
      console.log('')
    },
    on: [
      [
        '--help',
        () => {
          console.log()
          console.log('Examples:')
          console.log()
          console.log(`  ${grey('$')} ${blueBright(`${cliName} init magix`)}`)
          console.log()
        }
      ]
    ]
  })

  /**
   * 安装gallery组件库，并同步到项目中
   */

  commands.push({
    command: 'gallery',
    alias: 'g',
    description: '安装 magixCliConfig.galleries 配置的所有组件并同步到项目中',
    options: [
      ['-n, --gallery-name <n>', '指定同步单个组件'],
      ['--gallery-repos <repoName>', '指定同步组件库，多个组件库以逗号分隔'],
      ['-l, --list', '列出本地所有组件版本信息']
    ],
    // 必须为异步方法
    async action(options) {
      await require('./service/commands/gallery').default(options)
    },
    on: [
      [
        '--help',
        () => {
          console.log()
          console.log('  Examples:')
          console.log()
          console.log(`    $ ${cliName} gallery`)
          console.log()
        }
      ]
    ]
  })

  /**
   * 运行本地服务器进行开发
   */
  commands.push({
    // params: {
    //     enableSudo: true
    // },
    command: 'dev',
    description: '启动本地开发服务器',
    options: [
      ['-p, --port <port>', '设置服务器的端口号，默认 1234'],
      [
        '-d, --daily [ip]',
        '设置反向代理的接口 ip 实际地址，ip 值不填则读取选择本地 magixCliConfig.ipConfigs 配置'
      ],
      [
        '-o, --online [ip]',
        '同 -d 配置，不过这个会标识现在接口环境是预发/线上真实地址'
      ],
      ['--close-hmr', '关闭 HMR 热更新功能'],
      ['--close-docs', '关闭帮助文档提示功能'],
      // ['--close-desiger', '关闭 magix-desiger 功能'],
      // ['--close-inspector', '关闭 magix-inspector 功能'],
      ['--https', '反向代理 https 的接口'],
      // ['--debug', '开启 debug 模式，会校验 rap 接口等'],
      [
        '-i, --ipconfig-index <i>',
        `默认选取 ${cliName} dev -d 时对应的第 i 个配置`
      ]
    ],
    // 必须为异步方法
    async action(options) {
      await require('./service/commands/dev').default(options)
    },
    on: [
      [
        '--help',
        () => {
          console.log()
          console.log('Examples:')
          console.log(`  $ ${cliName} dev`)
          console.log(`  $ ${cliName} dev -p 8888`)
          console.log(`  $ ${cliName} dev -d 10.12.13.199`)
          console.log()
        }
      ]
    ]
  })

  /**
   * 快速生成业务模板文件(包含html,ts,less)
   */
  // commands.push({
  //   command: 'add',
  //   description: '快速生成业务模板文件 (包含 html,ts,less )',
  //   // 必须为异步方法
  //   async action(options) {
  //     await require('./service/commands/add').default(options)
  //   },
  //   on: [
  //     [
  //       '--help',
  //       () => {
  //         console.log()
  //         console.log('  Examples:')
  //         console.log()
  //         console.log('    $ mm add')
  //         console.log()
  //       }
  //     ]
  //   ]
  // })

  /**
   * mm build命令，配置遵循commander工具
   */
  commands.push({
    command: 'build',
    options: [['--check', '开启debug模式构建代码']],
    description: '项目构建',
    // 必须为异步方法
    async action(options: CommanderStatic) {
      await require('./service/commands/build').default(options)
    },
    on: [
      [
        '--help',
        () => {
          console.log()
          console.log('  Examples:')
          console.log()
          console.log(`    $ ${cliName} build`)
          // console.log('    $ mm build --local')
          console.log()
        }
      ]
    ]
  })

  /**
   * 安装dependencies包，并同步到项目中
   */
  commands.push({
    command: 'sync',
    description: '安装 dependencies 包，并同步到项目中',
    async action(options) {
      await require('./service/commands/sync').default(options)
    },
    on: [
      [
        '--help',
        () => {
          console.log()
          console.log('  Examples:')
          console.log()
          console.log(`    $ ${cliName} sync`)
          console.log()
        }
      ]
    ]
  })

  return commands
}
