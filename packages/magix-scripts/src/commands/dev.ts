'use strict'
/**
 * 项目开发命令，包含启动本地mat服务器
 * mm dev: 启动对接rap接口模拟的本地开发服务器
 * mm dev -d <ip>: 启动对接真实接口ip地址的本地开发服务器
 * mm dev -p <port>: 指定服务器的端口号
 */
import { utils } from 'thx-cli-core'
import { EventEmitter } from 'events'
import * as chalk from 'chalk'
import * as fse from 'fs-extra'
import * as getPort from 'get-port'
import * as WebSocket from 'ws'
import * as Mat from 'mat'
import * as magixCombine from 'magix-combine'
import * as magixComposer from 'magix-composer'
import * as magixCombineToolConfig from 'magix-combine-tool-config'
import * as magixComposerConfig from 'magix-composer-config'
import { clear } from 'thx-plugin-clear'
import * as open from 'open'
import * as util from '../util/index'
import * as matMiddleWare from '../mat-middleware/index'
import syncPromise from './syncPromise'
import * as minimist from 'minimist'
const argv = minimist(process.argv.slice(2))

const {
  rap,
  proxy,
  rapVerify,
  magixAnalyse,
  rewriteExtension,

  magixHmrInject, // magix热更新注入
  webSpriteInject, // magix帮助精灵注入
  magixDesigerInject, // magix-desiger 注入
  devEnvInject, // mm dev 开发环境标识注入
  magixInspectorInject, // magix-inspector 插件注入
  crossConfigsInject // window.crossConfigs 注入
} = matMiddleWare

const {
  syncGalleryPkg,
  genModuleList,
  genPreloadModule,
  checkBuilder,
  checkBuilderUpdateTips,
  checkGalleryUpdate
} = util

export default {
  /**
   * 参数
   * params.cwd [string] 项目目录
   * params.port [string] 端口号
   * params.ip [string] 对接真实接口时的ip地址，格式为ip或者ip,域名，默认对接RAP时无此值
   * params.isCloseHmr [boolean] 是否关闭HMR热更新功能，默认开启
   * params.isCloseDocs [boolean] 是否关闭帮助文档提示功能，默认开启
   * params.isCloseDesiger [boolean] 是否关闭magix-desiger功能，默认开启
   * params.isCloseInspector [boolean] 是否关闭magix-inspector功能，默认开启
   * params.isCloseSetHost [boolean] 是否关闭自动设置系统 host 以及清除 hsts 功能
   * params.isHttps [boolean] 是否开启反向代理https的接口，默认关闭
   * params.isDebug [boolean] 开启debug模式，会校验rap接口等，默认关闭.
   * params.magixDesigerServer
   * params.ai4mdCli
   * params.magixCliConfig
   */
  exec(params: any = {}) {
    let mat
    try {
      mat = new Mat()
    } catch (error) {
      mat = Mat
    }

    // 入口命令名称 thx/mx
    const cliName = utils.CLI_NAME
    const emitter = new EventEmitter()
    const { magixCliConfig = {}, cwd = process.cwd() } = params

    let hmrInst

    setTimeout(async () => {
      // 兼容原来的npm scripts里定义的mat-rap, mat-daily
      const appPath = utils.getAppPath(cwd)
      const appPkg = utils.getAppPkg(appPath)
      const { magixCombineConfig = {} } = magixCliConfig
      const isMagix5 = magixCliConfig.magixVersion === '5' // magix5 标识

      if (!appPkg) {
        return emitter.emit('close', {
          error: '找不到 package.json 文件'
        })
      }

      if (!(await utils.isInAppRoot(cwd))) {
        return emitter.emit('close', {
          error: '请在项目根目录下执行本命令'
        })
      }

      // 校验本地套件依赖的包版本与线上构建器版本是否一致，不一致给出升级套件提示
      if (magixCliConfig.cloudBuild) {
        const checkBuilderResult = await checkBuilder(isMagix5)
        if (!checkBuilderResult.isMatch) {
          await checkBuilderUpdateTips(checkBuilderResult.unmatchPkg)
        }
      }

      // 如果项目有 dependencies 则执行 mm sync 同步包到项目中(基于 snowpack)
      // 不再转发执行 mm sync，直接调用包执行
      if (appPkg.dependencies && Object.keys(appPkg.dependencies).length) {
        // 然后 magix-combine 解析包路径到 snowpack 生成的包路径里
        try {
          await syncPromise()
        } catch (error) {
          console.log(error)
        }
      }

      // 判断是否新版 magix5 编译工具
      let combineTool

      if (isMagix5) {
        const composerConfig = await magixComposerConfig(
          appPkg,
          magixCombineConfig,
          cwd
        )

        // magix5 编译工具
        combineTool = magixComposer
        combineTool.clearConfig()
        combineTool.config(composerConfig)
      } else {
        const combineToolConfig = await magixCombineToolConfig(
          appPkg,
          magixCombineConfig,
          cwd
        )

        // 老的 magix3 编译工具
        combineTool = magixCombine
        // magix-combine工具
        // @ts-ignore
        combineTool.clearConfig()
        combineTool.config(combineToolConfig)
      }

      // 提供额外的magixCliConfig里配置关闭辅助工具浮层的能力
      params.isCloseHmr =
        params.isCloseHmr === undefined
          ? magixCliConfig.closeHmr
          : params.isCloseHmr

      params.isCloseDocs =
        params.isCloseDocs === undefined
          ? magixCliConfig.closeDocs
          : params.isCloseDocs

      params.isCloseDesiger =
        params.isCloseDesiger === undefined
          ? magixCliConfig.closeDesiger
          : params.isCloseDesiger

      params.isCloseInspector =
        params.isCloseInspector === undefined
          ? magixCliConfig.closeInspector
          : params.isCloseInspector

      // 同步本地 node_modules 下所有组件的 package.json 到项目组件目录下 pkg.json
      // 用项目里的组件 pkg.json 里的版本来判断是否有线上更新的组件版本

      try {
        emitter.emit('data', '开始同步组件库 package.json 信息到项目中')
        await syncGalleryPkg(magixCliConfig.galleries)
      } catch (error) {
        emitter.emit(
          'data',
          `未找到本地安装的组件，请尝试执行 ${cliName} gallery 安装组件`
        )
      }

      // --skip-update-check跳过检测
      if (!argv['skip-update-check']) {
        // 检查组件库是否需要升级
        await checkGalleryUpdate(magixCliConfig, msg => {
          emitter.emit('data', msg)
        })
      }

      // 增加-o 配置，与-d相同，为了标识预发/线上环境
      let proxyPass = params.ip
      const _params = params.ip ? '-d' : '-o'

      // params.ip包含ip以及域名，如:106.11.211.220|dmp.taobao.com，
      // |分隔ip跟域名，将域名写入本地host配置127.0.0.1
      let ipSplits = []
      let fullHostName = magixCliConfig.autoOpenUrl || 'http://localhost'
      if (params.ip) {
        // mm dev -d 时获取到的ipConfig
        ipSplits = params.ip.split(/[,|]/)
        proxyPass = ipSplits[0]

        if (ipSplits.length > 1) {
          fullHostName = ipSplits[1]
        }
      }

      // 以ipConfig里配置的自动打开的url里是否带https为准
      // 对接rap时，根据autoOpenUrl里的Url protocal来决定打开的是https服务还是http服务
      if (/^https:\/\//.test(fullHostName)) {
        params.isHttps = true
      }

      // 反向代理接口的https设置，默认为http，优先从命令行参数--https里读取
      const protocolAlias = params.isHttps ? 'https' : 'http'

      // 去掉https://等，只留下host
      // 读取ipConfig里的端口信息
      const hostNameMatchs =
        /^(?:(?:https?:)?\/\/)?([^/:]+)(?::(\d+))?\/?(.*)/.exec(fullHostName)
      const hostName = hostNameMatchs && hostNameMatchs[1]
      const ipConfigPort = hostNameMatchs && hostNameMatchs[2]
      const pathname = hostNameMatchs && hostNameMatchs[3]

      /**
       * 端口优先级，命令行 -p > ipConfig里的端口 > matPort配置
       */
      const matPort =
        params.port ||
        ipConfigPort ||
        magixCliConfig.matPort ||
        (params.isHttps ? '443' : '80') // https默认端口443，http默认端口80

      // 端口只能为数字
      if (/\D/.test(matPort)) {
        return emitter.emit('close', {
          error: '端口号只能为纯数字'
        })
      }

      // 判断端口是否被占用
      const isOccupied = await utils.portIsOccupied(matPort)
      if (isOccupied) {
        return emitter.emit('close', {
          error: `${matPort}端口被占用或没有权限`
        })
      }

      // --https模式，需要本地有ssl证书
      let keyPathDefault, certPathDefault
      if (params.isHttps) {
        // keyPath, certPath为https服务需要的本地证书文件
        // 默认使用rmx cert生成的证书文件，在用户目录 ~/.self-signed-cert 下
        keyPathDefault = `${process.env.HOME}/.self-signed-cert/ssl.key`
        certPathDefault = `${process.env.HOME}/.self-signed-cert/ssl.crt`

        // 兼容下原先的rmx-ssl.key
        if (!fse.pathExistsSync(keyPathDefault)) {
          keyPathDefault = `${process.env.HOME}/rmx-ssl.key`
          certPathDefault = `${process.env.HOME}/rmx-ssl.crt`
        }

        //
        if (
          !fse.pathExistsSync(keyPathDefault) ||
          !fse.pathExistsSync(certPathDefault)
        ) {
          return emitter.emit('close', {
            error: `检测到本地还未安装自签名 ssl 证书，请先执行 ${chalk.cyan(
              `${cliName} cert`
            )} 插件命令进行本地证书一键自动安装。`
          })
        }
      }

      if (!params.isCloseSetHost) {
        // 将hostName写入系统host，需要sudo权限
        try {
          // 先清除同名host的配置（有可能是上次进程未正常关闭残留下来）
          utils.clearHostsByName(hostName)
          const randomKey = Math.random() // 标识添加的host块
          utils.setHosts(hostName, randomKey)

          emitter.emit(
            'data',
            chalk.greenBright(
              `✔ 已将 ${chalk.cyanBright(
                `127.0.0.1 ${hostName}`
              )} 配置写入系统 hosts`
            )
          )

          // 中断进程时删除当前设置的host配置
          process.on('exit', () => {
            emitter.emit(
              'data',
              chalk.greenBright(
                `✔ 已将 ${chalk.cyanBright(
                  `127.0.0.1 ${hostName}`
                )} 配置从系统 hosts 中移除`
              )
            )

            // utils.clearHosts(randomKey)
            utils.clearHostsByName(hostName)
          })
        } catch (error) {
          emitter.emit('data', chalk.yellowBright(`✘ ${error}`))
        }

        // 设置完hosts需要清除chrome的dns以及hsts
        emitter.emit(
          'data',
          chalk.greenBright('ⓘ 开始执行清除 chrome 的 hsts 及 dns 缓存操作')
        )
        await clear(hostName)
      }

      // mm dev 时重新生成预加载模块清单
      if (magixCliConfig.preloadModuleList) {
        // 遍历项目生成所有模块list，配合项目代码用于预加载资源
        await utils.withSpinner(
          'generate module list',
          async () => {
            await Promise.all([genModuleList(), genPreloadModule()])
          },
          err => {
            emitter.emit('error', err)
          }
        )()
      }

      // 增加rapProjectId，RAP项目id，从magixCliConfig配置里读取
      const rapProjectId = await util.getRapProjectId(cwd)

      // magix-desiger用到的端口号
      const dPort = (await getPort()) || 3007
      const aiPort = await getPort()

      /**
       * old
       * 兼容老的方式，在项目里直接放matfile.js，执行指定的devCommand/proxyCommand来执行mat
       */
      if (magixCliConfig.devCommand || magixCliConfig.proxyCommand) {
        // 启动mat反向代理服务器
        const command = 'tnpx' // npx直接绕过安装执行
        let args = []
        // 默认读取magixCliConfig里的配置，同时兼容以前配置在scripts里的配置
        let devCommand = magixCliConfig.devCommand || ''
        let proxyCommand = magixCliConfig.proxyCommand || ''

        // rap或反向代理的命令名
        if (params.ip) {
          // proxy接口
          args = proxyCommand.trim().split(/\s+/)
        } else {
          // rap接口
          args = devCommand.trim().split(/\s+/)
        }

        args.push('-t')
        args.push(matPort)

        //
        if (proxyPass && proxyPass !== true) {
          args.push(_params)
          args.push(proxyPass)
        }

        if (rapProjectId) {
          args.push('-i')
          args.push(rapProjectId)
        }

        // if (options.mport) {
        args.push('--mport')
        args.push(dPort)
        // }
        if (params.isHttps) {
          args.push(`--${protocolAlias}`)
        }

        emitter.emit(
          'data',
          chalk.yellow(
            'ⓘ 检测到当前为老项目，将直接执行 devCommand 或 proxyCommand 的命令'
          )
        )
        try {
          // 执行 启动本地服务器 命令
          utils.spawnCommand(command, args)
        } catch (err) {
          return emitter.emit('close', {
            error: err
          })
        }
        return
      }

      /**
       * 新的方式，mat收敛到cli工具内部，matfile配置在这里
       */

      // 匹配js文件
      // build文件夹下不作处理
      const jsPatterns = [/^(?!^\/?build\/\S*$)\S*\.js(\?.+)?$/]

      // 匹配两种访问主页
      // - /index.html?time=111
      // - /?time=111
      // indexMatch 支持单个字符串，或数组
      const indexMatch =
        typeof magixCliConfig.indexMatch === 'string'
          ? [magixCliConfig.indexMatch]
          : magixCliConfig.indexMatch || ['index.html']

      // 从autoOpenUrl配置里提取出来的入口文件也加入indexMatch中，并放到第一个
      if (pathname) {
        indexMatch.unshift(pathname)
      }
      const indexPatterns = [
        new RegExp(`^(\/(\\?.+)?|\/(${indexMatch.join('|')})(\\?.+)?)$`)
      ]

      // mat配置：端口等等
      mat.env({
        koaCorsConfig: magixCliConfig.koaCorsConfig,
        keyPath: keyPathDefault,
        certPath: certPathDefault,
        isHttps: params.isHttps,
        root: cwd || process.cwd(),
        logger(msg) {
          emitter.emit('data', msg)
        },
        index: indexMatch[0],
        port: matPort,
        limit: magixCliConfig.datalimit || '10mb', // post请求时可以携带参数的大小上限
        timeout: magixCliConfig.timeout || 60 * 1000, // 请求的过期时间，默认60秒
        ready: function (port) {
          if (magixCliConfig.autoOpenUrl) {
            // 服务启动成功后的回调
            const openOptions = { app: 'google chrome' }
            const protocol = params.isHttps ? 'https' : 'http'
            const openUrl = `${protocol}://${hostName}:${port}/${pathname}`
            open(openUrl, openOptions)

            utils.printSuccess(
              `本地服务已启动，请访问: \n ${chalk.grey(`↳ ${openUrl}`)}`,
              '[CLI]'
            )
          }
        },
        // 是否禁止mat的log输出
        log: params.isDebug
      })

      // api接口匹配规则
      // apiMatch 支持单个字符串，或数组
      let apiPatterns = [/api\//, /\.json/, /\.action/]
      if (magixCliConfig.apiMatch) {
        // 项目中magixCliConfig配置了apiMatch
        apiPatterns = []
        const _apiMatch =
          typeof magixCliConfig.apiMatch === 'string'
            ? [magixCliConfig.apiMatch]
            : magixCliConfig.apiMatch

        for (const match of _apiMatch) {
          if (match.includes('.')) {
            const _match = match.replace(/\./g, '\\.')
            // .json这种结尾的匹配
            apiPatterns.push(new RegExp(_match))
          } else {
            // /api/这种指定接口打头的匹配
            apiPatterns.push(new RegExp(match))
          }
        }
      }

      const wsPort = await getPort()

      // hmr配置
      const magixHmrConfig = {
        customLog(msg) {
          emitter.emit('data', msg)
        },
        cwd,
        rootAppName: magixCliConfig.rootAppName || 'app',
        // 热更新监听的文件
        watchFiles: magixCliConfig.HMRWatchFiles || [
          'src/**/*.js',
          'src/**/*.ts',
          'src/**/*.es',
          'src/**/*.mx',
          'src/**/*.css',
          'src/**/*.html',
          'src/**/*.scss',
          'src/**/*.less'
        ],
        // 项目级全局的样式，必须触发全页刷新
        scopedCss: magixCliConfig.scopedCss,
        combineTool,
        // mdPort: dPort,
        wsPort,
        // closeDesiger: params.isCloseDesiger,
        // magix5 标识
        isMagix5
      }

      const ws = new WebSocket.Server({
        port: wsPort
      })

      hmrInst = magixHmrInject(magixHmrConfig, ws)

      // pushState
      mat.task('pushState', function () {
        mat
          .url([/^((?!\.(css|less|js|html|ico|swf|do)).)*$/])
          .rewrite([[/(\/.*)+/, `/${indexMatch[0]}`]])
      })
      const relevantTasks = magixCliConfig.isPushState ? ['pushState'] : []

      /**
       * 本地mat服务器，对接rap模拟接口数据(对应命令mm dev)
       */

      const rapVersion = magixCliConfig.rapVersion || '2'

      mat.task('rap', relevantTasks, async () => {
        if (rapProjectId) {
          emitter.emit(
            'data',
            chalk.green(
              `[MTA] 启动对接 RAP 接口模拟开发环境（RAP 项目 id：${
                rapProjectId || '尚未配置'
              }）`
            )
          )
        }

        // 匹配js文件，用magix-combine工具进行预编译
        mat
          .url(jsPatterns)
          .rewrite([
            function (url) {
              return rewriteExtension(url, undefined, cwd)
            }
          ])
          .use(magixAnalyse(combineTool, ws, cwd))

        // 注入开发环境变量
        // window.__isRap__: mm dev
        // window.__isDaily__: mm dev -d
        // window.__isOnline__: mm dev -o
        const indexMatchUrl = mat.url(indexPatterns).use(devEnvInject())

        if (!params.isCloseInspector) {
          // 注入magix-inspector插件
          indexMatchUrl.use(magixInspectorInject())
        }

        if (!params.isCloseHmr) {
          // 启动hmr的websocket服务，index.html注入hmr脚本
          indexMatchUrl.use(hmrInst)
        }

        if (!params.isCloseDocs) {
          // mm dev时页面注入帮助文档
          indexMatchUrl.use(webSpriteInject(ws, wsPort))
        }

        if (!params.isCloseDesiger) {
          // mm dev注入的magix-desiger
          indexMatchUrl.use(
            magixDesigerInject({
              mdPort: dPort,
              aiPort
            })
          )
        }

        // mm dev 时使用 crossConfigsRap（此为新增配置，一般 apiHost 配置为 RAP 地址）
        indexMatchUrl.use(crossConfigsInject(true))

        // api接口rap模拟数据
        const apiMatchUrl = mat
          .url(apiPatterns)
          // rap接口模拟
          .use(
            rap({
              rapVersion,
              projectId: rapProjectId
            })
          )

        if (params.isDebug) {
          // rap接口校验
          apiMatchUrl.use(
            rapVerify({
              rapVersion,
              isRap: true,
              projectId: rapProjectId,
              log(msg) {
                emitter.emit('data', msg)
              }
            })
          )
        }
      })

      /**
       * 本地mat服务器对接真实环境接口(如daily,预发等环境) (对应命令mm dev -d 10.12.13.245)
       */
      mat.task('proxy', relevantTasks, async () => {
        emitter.emit(
          'data',
          chalk.green(
            `[MTA] 启动对接真实接口开发环境 ${chalk.cyan(
              `(接口代理 ip 地址:${proxyPass || '尚未配置'})`
            )}`
          )
        )

        // 匹配js文件，用magix-combine工具进行预编译
        mat
          .url(jsPatterns)
          .rewrite([
            function (url) {
              return rewriteExtension(url, undefined, cwd)
            }
          ])
          .use(magixAnalyse(combineTool, ws, cwd))

        // 注入开发环境变量
        const indexMatchUrl = mat.url(indexPatterns).use(devEnvInject())

        if (!params.isCloseInspector) {
          // 注入magix-inspector插件
          indexMatchUrl.use(magixInspectorInject())
        }

        if (!params.isCloseHmr) {
          // 启动hmr的websocket服务，index.html注入hmr脚本
          // mat.url(indexPatterns)
          indexMatchUrl.use(hmrInst)
        }

        if (!params.isCloseDocs) {
          // mm dev时页面注入帮助文档
          // mat.url(indexPatterns)
          indexMatchUrl.use(webSpriteInject(ws, wsPort))
        }

        if (!params.isCloseDesiger) {
          // mm dev注入的magix-desiger
          indexMatchUrl.use(
            magixDesigerInject({
              mdPort: dPort,
              aiPort
            })
          )
        }

        // mm dev -d 时使用 crossConfigs 配置（apihost 一般配置为预发/线上环境）
        if (magixCliConfig.crossConfigs) {
          indexMatchUrl.use(crossConfigsInject(false))
        }

        // api接口反向代理到真实接口
        const apiMatchUrl = mat
          .url(apiPatterns)
          // 真实接口反向代理
          .use(
            proxy({
              projectId: rapProjectId,
              proxyPass,
              protocolAlias: protocolAlias
            })
          )

        if (params.isDebug) {
          // rap接口校验
          apiMatchUrl.use(
            rapVerify({
              rapVersion,
              isRap: false,
              projectId: rapProjectId,
              log(msg) {
                emitter.emit('data', msg)
              }
            })
          )
        }
      })

      // 执行mat rap或mat proxy
      const runCommand = proxyPass ? 'proxy' : 'rap'
      mat.start(runCommand, () => {
        try {
          mat.launch()
        } catch (error) {
          return emitter.emit('close', {
            error
          })
        }
      })

      /**
       * 执行magix-desiger相关命令
       * -t 可以指定依赖的模板
       * --mport 指定magix-desiger本地服务的端口号
       * 默认使用magixCliConfig里的magixDesigerTemplate配置
       */

      if (
        magixCliConfig.magixDesigerTemplate &&
        !params.isCloseDesiger &&
        params.magixDesigerServer &&
        params.ai4mdCli
      ) {
        try {
          const defaultDesignTemplate = magixCliConfig.magixDesigerTemplate
          const appWrapper = params.magixDesigerServer
          const pwd = cwd || process.cwd()
          const config = {
            pwd,
            templateNpm: defaultDesignTemplate,
            port: dPort
          }
          const app = await appWrapper(config)
          app.listen(config.port)
          emitter.emit(
            'data',
            chalk.green(`✔ magix-desiger 服务成功启动[${config.port}]！`)
          )

          // ai desiger
          const aiWrapper = params.ai4mdCli
          const aiApp = await aiWrapper({
            port: aiPort,
            pwd
          })
          aiApp.listen(aiPort)
          emitter.emit(
            'data',
            chalk.green(`✔ ai-desiger 服务成功启动[${aiPort}]！`)
          )
        } catch (error) {
          emitter.emit(
            'data',
            chalk.yellow(
              `ⓘ magix-desiger 服务启动异常，原因如下：\n${error.message}`
            )
          )
        }
      }
    }, 0)

    // 增加关闭dev进程的方法
    /** @deprecated */
    // @ts-ignore
    emitter.stopDev = () => {
      console.trace('@deprecated')
      mat && mat.close()
      hmrInst && hmrInst.watcher.close()
      emitter.emit('data', chalk.green('✔ 已停止本地开发服务'))
    }

    return emitter
  }
}
