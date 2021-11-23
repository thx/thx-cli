import { blueBright, cyanBright, grey } from 'chalk'
import { EventEmitter } from 'events'
import simpleGit from 'simple-git'
import replaceUtil from './util/replace'
import { checkPackageVersionsCorrect } from './util/check'
import * as minimist from 'minimist'
import * as fse from 'fs-extra'
import { utils } from '@ali/mm-cli-core'
import { ICreateAppInfo } from '@ali/mm-cli-core/types'
import { CommanderStatic } from 'commander'

// commands list
// import galleryCmd from './service/commands/gallery'
// import devCmd from './service/commands/dev'
// import addCmd from './service/commands/add'
// import buildCmd from './service/commands/build'
// import dailyCmd from './service/commands/daily'
// import publishCmd from './service/commands/publish'
// import modelsCmd from './service/commands/models'
// import spmlogCmd from './service/commands/spmlog'
// import iconfontCmd from './service/commands/iconfont'
// import chartparkCmd from './service/commands/chartpark'
// import syncCmd from './service/commands/sync'

const { execCommand, withSpinner, checkDependencies } = utils

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
    const rootUser = process.env.USER // tnpm install 会判断 USER==='root'，sudo 不允许安装
    process.env.USER = ''
    await checkDependencies('tnpm', ['install', '--color'])
    process.env.USER = rootUser // 还原

    // 检测 package.json 里包版本与本地安装版本是否一致，给出升级提示
    if (command !== 'dev') {
      // mm dev 不需要检测，因为会执行 mm sync 安装同步 npm 包了。
      await checkPackageVersionsCorrect()
    }

    // 检测package.json里版本是否明确指定版本，不建议使用范围版本，非强制
    // await checkPackageVersionsRange()
  }

  const commands = []

  /**
   * 项目初始化
   */

  commands.push({
    command: 'init',
    description: '项目初始化, 默认 tnpm install 安装',
    params: {
      // createIconfont: true,
      // createRap: true,
      // createChartpark: true,
      // createSpma: true,
      // createDef: true,
      // createClue: true,

      // 项目名称的校验
      nameValidate(value, answer, scaffoldsMap) {
        // 项目名称有校验规则的，校验一下
        const scaffoldInfo = scaffoldsMap[answer.scaffold.repository]
        const rule = scaffoldInfo.nameValid.rule
        if (rule) {
          const regExp = new RegExp(rule)
          if (!regExp.test(value)) {
            return (
              scaffoldInfo.nameValid.tips ||
              `项目名称规则校验失败，规则为：${rule}`
            )
          }
        } else if (!value.trim()) {
          return '项目名称不能为空'
        } else if (fse.pathExistsSync(value)) {
          // 判断是否已存在文件夹
          return '当前目录下已存在同名文件夹，换个项目名称吧'
        }
        // 特定脚手架需要限制项目名称
        // if (answer.scaffoldGitUrl.includes(`boom-template-scaffold`)) {
        //     if (!/^cellex\-.+/.test(value)) {
        //         return `项目名称必须以cellex-开头`
        //     }
        // } else if (answer.scaffoldGitUrl.includes(`cell-components-scaffold`)) {
        //     if (!/^cell(ex)?\-.+/.test(value)) {
        //         return `项目名称必须以cell-或者cellex-开头`
        //     }
        // }
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

      await withSpinner(
        '写入各平台 id 到 magixCliConfig 中',
        async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
          pkg.magixCliConfig = pkg.magixCliConfig || {}
          pkg.magixCliConfig.rapProjectId = snapshoot?.rapProject?.id || ''
          pkg.magixCliConfig.iconfontId = snapshoot?.iconfontProject?.id || ''
          pkg.magixCliConfig.defId = snapshoot?.defInfo?.id || ''
          pkg.magixCliConfig.spma = snapshoot?.spma || ''
          pkg.magixCliConfig.chartParkId =
            snapshoot?.chartparkProject?.projectId || ''
          pkg.magixCliConfig.gitlabUrl = snapshoot?.gitProject?.web_url || ''
          await fse.writeJson(pkgPath, pkg, { spaces: 2 })
        }
      )(emitter, appInfo)

      await withSpinner(
        '设置入口页的 spma 值',
        async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
          replaceUtil.setSpma(snapshoot?.spma, app)
        }
      )(emitter, appInfo)

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
      if (gitlab !== false) {
        await withSpinner(
          '提交本地代码',
          async (emitter: EventEmitter, appInfo: ICreateAppInfo) => {
            const git = simpleGit(`${appInfo.cwd}/${appInfo.app}`)
            git.outputHandler((command, stdout, stderr) => {
              // stdout.pipe(process.stdout)
              // stderr.pipe(process.stderr)
            })
            await git.add('-A')
            await git.commit('first commit by @ali/mm-cli', '--no-verify')
            await git.push('origin', 'master')
          }
        )(emitter, appInfo)
      }

      // customLog => console.log
      // console.log('')
      // console.log(green(`✔ magix 项目初始化完成，请 ${cyan(`cd ${name}`)} 进入项目目录，执行：`))
      console.log(`\n应用 ${cyanBright(app)} 创建成功！你可以执行以下命令：\n`)
      console.log(`  ${grey('●')} ${blueBright(`cd ${app}`)}`)
      console.log(
        `  ${grey('●')} ${blueBright('mm dev')}      ${grey(
          '启动本地开发服务'
        )}`
      )
      console.log(
        `  ${grey('●')} ${blueBright('mm daily')}    ${grey('日常发布')}`
      )
      console.log(
        `  ${grey('●')} ${blueBright('mm publish')}  ${grey('正式发布')}`
      )
      console.log(
        `  ${grey('●')} ${blueBright('mm -h')}       ${grey(
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
          console.log(`  ${grey('$')} ${blueBright('mm init magix')}`)
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
    description: '安装 zs_gallery 组件并同步到项目 gallery 目录下',
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
          console.log('    $ mm gallery')
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
    description: '本地开发服务',
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
      // ["-t, --template <n>", "设置magix-desiger依赖的项目模板"],
      // ["--mport <n>", "设置magix-desiger本地服务的端口号"],
      ['--close-hmr', '关闭 HMR 热更新功能'],
      ['--close-docs', '关闭帮助文档提示功能'],
      ['--close-desiger', '关闭 magix-desiger 功能'],
      ['--close-inspector', '关闭 magix-inspector 功能'],
      ['--https', '反向代理 https 的接口'],
      ['--debug', '开启 debug 模式，会校验 rap 接口等'],
      ['-i, --ipconfig-index <i>', '默认选取 mm dev -d 时对应的第 i 个配置']
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
          console.log('  $ mm dev')
          console.log('  $ mm dev -p 8888')
          console.log('  $ mm dev -d 10.12.13.199')
          console.log()
        }
      ]
    ]
  })

  /**
   * 快速生成业务模板文件(包含html,ts,less)
   */
  commands.push({
    command: 'add',
    description: '快速生成业务模板文件 (包含 html,ts,less )',
    // 必须为异步方法
    async action(options) {
      await require('./service/commands/add').default(options)
    },
    on: [
      [
        '--help',
        () => {
          console.log()
          console.log('  Examples:')
          console.log()
          console.log('    $ mm add')
          console.log()
        }
      ]
    ]
  })

  /**
   * mm build命令，配置遵循commander工具
   */
  commands.push({
    command: 'build',
    description: '本地云构建',
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
          console.log('    $ mm build')
          // console.log('    $ mm build --local')
          console.log()
        }
      ]
    ]
  })

  /**
   * mm daily命令，配置遵循commander工具
   */
  commands.push({
    command: 'daily',
    alias: 'd',
    description: '将当前的开发分支发布到预发环境',
    options: [
      ['-m, --message <message>', 'commit信息'],
      ['--nospm', '发布前不执行打点任务']
    ],
    // 必须为异步方法
    async action(options: CommanderStatic) {
      await require('./service/commands/daily').default(options)
    },
    on: [
      [
        '--help',
        () => {
          console.log()
          console.log('Examples:')
          console.log('  $ mm daily')
          console.log()
        }
      ]
    ]
    // 执行命令前的勾子函数
    // async before(options) {
    //     if (!options.nospm) {
    //         const magixCliConfig = await util.getMagixCliConfig()
    //         let currentBranch = await util.getPrecentBranch()

    //         //发布前执行spm打点
    //         await util.runSpmlog(magixCliConfig, currentBranch)
    //     }
    // }
  })

  /**
   * mm publish命令，配置遵循commander工具
   */
  commands.push({
    command: 'publish',
    alias: 'p',
    description:
      '将当前的开发分支发布到线上生产环境 (会删除掉当前分支并回到 master)',
    options: [
      ['-m, --message <message>', 'commit 信息'],
      ['--nospm', '发布前不执行打点任务'],
      ['-i, --international', '是否同时发布到国际版 cdn'],
      ['-p, --prod', '是否跳过 daily 发布直接发布生产环境'],
      ['-a, --all-reviewer', '是否全选已配置的代码审阅人员'],
      [
        '-c, --code-reviewers <reviewers>',
        '直接指定代码审阅人员工号，多工号以逗号分隔'
      ]
    ],
    // 必须为异步方法
    async action(options) {
      await require('./service/commands/publish').default(options)
    },
    on: [
      [
        '--help',
        () => {
          console.log()
          console.log('Examples:')
          console.log('  $ mm publish')
          console.log()
        }
      ]
    ]
    // 执行命令前的勾子函数
    // async before(options) {
    //     if (!options.nospm) {
    //         const magixCliConfig = await util.getMagixCliConfig()
    //         let currentBranch = await util.getPrecentBranch()

    //         //发布前执行spm打点
    //         await util.runSpmlog(magixCliConfig, currentBranch)
    //     }
    // }
  })

  /**
   * 根据当前项目RAP的projectId，生成models.js接口集合文件
   */

  commands.push({
    command: 'models',
    alias: 'm',
    description: '根据当前项目 RAP 的 projectId，生成 models.js 接口集合文件',
    async action(options) {
      await require('./service/commands/models').default(options)
    },
    on: [
      [
        '--help',
        () => {
          console.log()
          console.log('  Examples:')
          console.log()
          console.log('    $ mm models')
          console.log()
        }
      ]
    ]
  })

  /**
   * 黄金令箭埋点
   */

  commands.push({
    command: 'spmlog',
    alias: 'sl',
    description: '黄金令箭埋点，同时同步数据小站配置',
    options: [
      // ["-d, --dataconfig", "只同步数据小站的数据到本地"],
      ['-r, --remove-spm', '清空所有 spm 打点']
    ],
    async action(options) {
      await require('./service/commands/spmlog').default(options)
    },
    on: [
      [
        '--help',
        () => {
          console.log()
          console.log('  Examples:')
          console.log()
          console.log('    $ mm spmlog')
          console.log('    $ mm spmlog -r')
          console.log()
        }
      ]
    ]
  })

  /**
   * iconfont相关的命令
   * --check 比对项目与iconfont平台的icon，列出项目中没有用到的icon
   */
  commands.push({
    command: 'iconfont',
    alias: 'if',
    description: 'iconfont 相关的命令',
    options: [
      ['--check', '比对项目与 iconfont 平台的 icon，列出项目中没有用到的 icon']
    ],
    async action(options) {
      await require('./service/commands/iconfont').default(options)
    },
    on: [
      [
        '--help',
        () => {
          console.log()
          console.log('  Examples:')
          console.log()
          console.log('    $ mm iconfont --check')
          console.log()
        }
      ]
    ]
  })

  /**
   * 同步chartPark的options到本地
   */
  commands.push({
    command: 'chartpark',
    alias: 'cp',
    description: '同步 chartpark 平台图表配置信息到本地',
    async action(options) {
      await require('./service/commands/chartpark').default(options)
    },
    on: [
      [
        '--help',
        () => {
          console.log()
          console.log('  Examples:')
          console.log()
          console.log('    $ mm chartpark')
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
          console.log('    $ mm sync')
          console.log()
        }
      ]
    ]
  })

  return commands
}
