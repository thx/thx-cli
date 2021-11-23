# CHANGELOG

## WEEK 42 [2021-10-14]
* React 套件
  * 移除 MMWS 相关页面&代码，移动到独立仓库。

## WEEK 38 [2021-09-17]
* React 套件
  * [FEATURE] 命令 `mm models` 自动格式化生成的 JS & TS 文件 `src/dataplus/config.js|ts`。
* @ali/mm-scripts
  * [FEATURE] 新增配置项 `__unstable_dev_server_proxy: { [key: string]: {} }`，支持自定义接口代理。

## WEEK 37 [2021-09-10]
* MMWS
  * [FEATURE] 完善 UI，支持可视化管理产品、仓库、分支和页面，完善展示字段、关联查询。
* React 套件
  * [FEATURE] 命令 `mm spmlog` 自动格式化生成的 TS 文件 `src/dataplus/config.ts`。

## WEEK 36 [2021-09-05]
* @ali/mm-plugin-create-daily
  * [FIX] 命令 `mm createDaily` 创建迭代分支后，没有自动 push。
  * [REFACTOR] 重构内部实现，提取独立的工具方案，润色文案和颜色，更清晰的代码实现，方便后续维护。
* React 套件
  * [FEATURE] 命令 `mm spmlog` 自动生成 TS 文件 `src/dataplus/config.ts`。
* @ali/mm-scripts
  * [FIX] 命令 `mm dev --https` 启动本地 HTTPS 服务时，因为缺少自签名密钥和证书，导致自动打开的页面被浏览器拦截（提示：您的连接不是私密连接），并且热更新 HMR 不生效（控制台报错：/sockjs-node/info?t=1630403140481 net::ERR_CERT_AUTHORITY_INVALID）。

## WEEK 35 [2021-08-27]
* Web UI & React 套件
  * [FEATURE] 命令 `mm spmlog` 支持应用自定义代码的 eslint 风格。感谢 @示源 提供的 recast 工具。
* Core & Command
  * [REFACTOR] 移除 downgradingSudo 降权，改为仅降权子进程的模式
* Magix 套件
  * [REFACTOR] 优化 mm gallery 组件升级提示判断逻辑从判断本地 node_modules 改为判断项目中组件目录下存放的版本信息
  * [FEATURE] mm gallery 本地组件有修改时，选择 no 则跳过有修改的组件，只升级未修改过的组件
  * [FEATURE] 结合 snowpack 在 magix-combine 代码构建时支持直接 import npm 包的能力

## WEEK 33 [2021-08-13]
* Web UI & React 套件
  * [REFACTOR] 接入 MMWS 正式服务，更合理的代码实现，便于后续迭代。
  * [FEATURE] 如果 NPM 版本与分支版本不一致，给出提示，并提供同步功能。参见 https://yuque.antfin.com/mmfs/cli/kit-react#kKPlY。
  * [FEATURE] 接入 APlus、AEM、ARMS。
* @ali/mm-scripts
  * [REFACTOR] 移除 ts-loader，全部迁移到 babel-loader，以保证本地开发和线上构建的配置一致。
  * [REFACTOR] 升级 Webpack5 到 5.50.0。
  * [FIX] 修复线上构建结果报错问题：babel-loader 新增插件 @babel/plugin-proposal-private-methods、@babel/plugin-proposal-private-property-in-object、@babel/plugin-transform-runtime。@自勉 @墨尘 @江辞
* MMWS
  * [FEATURE] 增加 UI，支持可视化管理产品、仓库、分支和页面。

## WEEK 32 [2021-08-06]
* Magix 套件
  * [FEATURE] 代码压缩工具由 terser 升级为 esbuild, esBuildTarget 配置默认值为 es2018。
* @ali/mm-cli
  * [FEATURE] 新增 `mm install --link`，支持以本地链接方式安装套件&插件。
  * [FIX] 自动安装应用依赖时，将权为普通用户，避免污染 node_modules。
* React 套件
  * [FIX] CSS Bridge 完善。
  * [FEATURE] 支持自定义 HTTPS 端口，不再强制为 443。
  * [FIX] 执行 @ali/mm-scripts 时，自动降权为普通用户，避免 Webpack 5 缓存权限问题。
* @ali/mm-scripts
  * [FEATURE] 支持环境变量 `process.env`。
  
## WEEK 31 [2021-07-30]
* @ali/mm-scripts
  * 本地代理
    * [REFACTOR] 优化代理策略，更清晰的实现，支持静态资源、本地文件、HTML 文件。
    * [FIX] Webpack DevServer 的 proxy 配置与 body-parser 插件冲突，禁用 body-parser。
    * [ ] 对于伪装成 HTML 的接口，例如 /sendBucSSOToken.do，不重定向、不代理。
  * [FEATURE] 增加命令 `mm-scripts start`，更贴近社区习惯。
  * [FEATURE] 新增配置项 `__unstable_rap2_scene_proxy: { [key: string]: string }`，支持 RAP2 场景代理。
* Web UI & React 套件
  * [FEATURE] 命令 `mm cssbridge`，重新梳理 CSS 3 变量在 Magix Gallery 与 Fusion Desingn 之间的映射关系。
  * [FEATURE] 命令 `mm dev`，新增参数 `--proxy-ip`、`--proxy-host`，支持直接指定代理 IP 或域名。
  * [FEATURE] 支持 Marquex 脚手架。

## WEEK 30 [2021-07-23]
* Web UI & React 套件
  * [FEATURE] 构建、发布时，支持自定义模块。
  * [FEATURE] 页面目录同时支持 pages 和 views，更新相应的构建工具、命令行和套件接口。
  * [FIX] 支持 Socket 客户端传入的环境变量。
  * [FEATURE] 执行命令 `mm dev` 启动本地服务后，默认自动在浏览器中打开页面。可通过设置 RC 配置项 `__unstable_auto_open: false` 禁用该行为。
  * [REFACTOR] 优化命令 `mm dev` 启动本地服务的端口、代理的参数和逻辑，更语意化的命名。
  * [FIX] 修复命令 `mm dev` 启动本地服务时总是关闭默认端口 8080 的问题。
* @ali/mm-scripts
  * [FEATURE] 新增 RC 配置项 `__unstable_html_webpack_plugin: boolean`。默认关闭 Webpack HtmlWebpackPlugin，该配置项为 true 时启用。
* @ali/mm-cli-core
  * [FEATURE] 新增工具方法 onetab(target)，尝试在浏览器中打开目标地址。如果是重复打开，则自动刷新已开页签。

## WEEK 29 [2021-07-16]
* Web UI & React 套件
  * [REFACTOR] 接入 MMWS 日常服务，更合理的代码实现，便于后续继续接入。
  * [REFACTOR] 发送请求的工具模块 packages/webui/src/utils/fetch.ts，更合理的接口设计和实现，移除冗余代码。
  * [FEATURE] 如果 NPM 包名与本地目录不一致，则提示。
  * [FEATURE] 如果 NPM 版本与分支版本不一致，则提示。

## WEEK 28 [2021-07-09]
* Web UI
  * [FEATURE] 引入 @welldone-software/why-did-you-render、web-vitals。
  * [FEATURE] 新增任务 CSS Bridge。
* React 套件
  * [FEATURE] 命令 `mm models` 输出更多接口细节信息，包括：接口变更原因、影响的文件，用于辅助判断接口变更的影响范围。
  * [FEATURE] 新增命令 `mm cssbridge`，自动生成 Magix <=> Fusion 主题互通文件。
    * 在 Magix 项目中，生成适配 React 的文件 `src/react.var.css`。
    * 在 React 项目中，生成适配 Magix 的文件 `src/react.var.css`。
    * 在 未知套件 项目中，同时生成以上 2 个文件。
* Magix 套件
  * [FEATURE] 开发帮助 web-sprite 工具结合 ALP，提供全量 magixCliConfig 配置的能力

## WEEK 26 [20201-06-25]
* Web UI & React 套件
  * [STYLE] 工作台视觉润色。

## WEEK 25 [20201-06-18]
* Web UI & React 套件
  * [FEATURE] 嵌入 webpack-bundle-analyzer 的构建分析结果。

## WEEK 24  [20201-06-11]
* mm-scripts
  * [FIX] 升级 Webpack 到 5.38.1，修复 5.24.0 调用 crypto 报错问题。
  * [CHORE] 日志中输出 ModuleFederationPlugin 配置项。
* React 套件 & 多入口架构
  * [FEATURE] 增加变更提示（颜色 + 文案），包括 3 种情况：
    * 当前文件有变更，需要重新构建并发布。
    * 依赖文件有变更，需要重新构建并发布。
    * 当前文件和依赖文件均无变更，无需构建和发布。
* @ali/mm-cli
  * [CHORE] 尝试加载插件模块时，在后台日志中记录可能的报错。

## WEEK 23 [20201-06-6]
* React 套件 & 多入口架构
  * [FEATURE] 检测变更内容，分析影响范围，并在 Web UI 中提示。
* Web UI
  * [FEATURE] 增加前端埋点，包括：组件生命周期埋点、逻辑 hooks 埋点。
  * [FEATURE] 增加接口埋点，包括：请求参数、响应状态、响应内容。
  * [DOCS] 工作台，首页，增加特性图片。

## WEEK 22 [2021-05-28]
* React 套件
  * [FIX] 命令 `mm spmlog` 修复 standardjs 参数，可用于生产。
* 套件脚手架
  * 更新文档，完善关于新套件开发流程的说明。
  *  简化套件开发的流程，支持自动链接本地套件和快速一键发布。

## WEEK 21 [20201-06-21]
* React 套件
  * [FEATURE] RC 文件 `.rmxrc` 支持 `__unstable_env`，用于配置环境变量。

## WEEK 19 [20201-05-07]
* [FIX] Node v14.16.1 执行 `mm web` 报错 `TypeError [ERR_INVALID_CHAR]: Invalid character in header content ["last-modified"]`
* [FIX] React 套件，执行 `mm build` 时，修改 `abc.json` 的逻辑未升级到 `@ali/mm-kit-react`。
* [FIX] React 套件，Web UI，本地开发和本地构建任务，不再同步远程页面设置，避免同仓库&同分支下并行开发时，两个同学的本地配置相互影响（冲突）。

## WEEK 16 [20201-04-16]
* [FEATURE] 升级提示增加防疲劳功能。

## WEEK 15
  * React 套件
    * [FEATURE] 页面配置表格化，配置更方便。
    * [FEATURE] 当前应用的构建入口列表，增加 `src/index`。
  * React mm-scripts
    * [FEATURE] 增加 babel-plugin-styled-components，支持显示组件名称，方便开发调试。
  * 升级提示，防疲劳间隔 1 周。

## WEEK 14
* React mm-scripts
  * [FEATURE] Webpack devServer 支持 HTTPS 环境变量。
  * [FEATURE] 增加 polyfill：crypto-browserify、stream-browserify。
* React 套件
  * [REFACTOR] HTTPS 被用于配置代理，不合理，应该是：是否为本地服务开启 HTTPS。（React 套件项目未用到该配置项，Magix 套件项目很少量用到但不生效）。
  * [FEATURE] 工作台的本地开发任务，支持 HTTPS。
  * [FEATURE] 新增 `--proxy-https`。

## WEEK 12
* [FEATURE] React 套件
  * 灰度方案，UI 交互梳理和开发完成（上行方案已确定，下行待定）。

## WEEK 11
* [FEATURE] WebUI & WebServer
  * 完善 WebServer Socket 通信内容，增加任务执行简报（主要是状态和错误）。
  * WebUI 增加错误状态提示。
* [FEATURE] React 套件
  * 日常部署，接入 MMWS 日常服务（ MMWS 线上服务发布中，整体链路待联调&完善）。
  * 灰度方案，UI 交互梳理和开发完成（上行方案已确定，下行待定）。

## WEEK 10
* [FEATURE] React 套件
  * 命令 publish 支持 跳过日常 --prod、代码审阅 --all-reviewer、--code-reviewers 参数。
  * WebUI 同步支持。
  * WebUI 支持编辑复制任务命令
  * WebUI 支持完整覆盖一个应用的生命周期（开发、日常、发布、推送）。

## WEEK 09
* [FEATURE] 整站开屏动画。
* [CHORE] 执行 lerna run|exec 优先使用 yarn。
* [REFACTOR] 重构 react 套件修改 abc.json 的逻辑，因为不够通用，从 @ali/mm-cli-core 移出至 @ali/mm-kit-react。
* [FEATURE] 多入口架构
  * 修复：WebUI 任务管理，切换任务标签时，发送的任务名偶尔错误。
  * mm-scripts 构建时输出版本号，便于调试&定位问题。
  * 增强：WebUI 的日常发布、正式发布，支持指定构建入口。
  * 重构：WebUI 的本地开发，基于 Field 重构任务配置实现，减少代码行数，同时便于未来扩展更多配置项。
  * 优化：WebUI 忽略子进程执行过程日志，避免控制台刷屏。
* [FIX] 黄金零件发送失败，导致 CLI 中断。
* [TODO][FIX] lerna 忽略 chalk 颜色。

## WEEK 06
* 多入口架构
  * 优化模块查找逻辑。模块路径支持 `src/module`，模块名自动剔除 `src`。参见下方测试用例。
  * 修复：WebUI 任务管理，切换任务标签时，发送的任务名偶尔错误。

```sh
ANALYZE=true PORT=8081 PAGE=src/index,src/pages/home/index,src/pages/account,shared,foo/bar yarn run dev

$ mm-scripts dev
    NODE_ENV development
     webpack 5.16.0
         cwd /Users/mo/mm/ws/mmfs/mm-cli/packages/playground/example-react
        PAGE src/index,src/pages/home/index,src/pages/account,shared,foo/bar
        PORT 8081
     ANALYZE true
      output /Users/mo/mm/ws/mmfs/mm-cli/packages/playground/example-react/build
       entry [ 'index', 'pages/home/index', 'pages/account', 'shared', 'foo/bar' ]

       Page Name Source Path
           index /Users/mo/mm/ws/mmfs/mm-cli/packages/playground/example-react/src/index.tsx
pages/home/index /Users/mo/mm/ws/mmfs/mm-cli/packages/playground/example-react/src/pages/home/index.tsx
   pages/account /Users/mo/mm/ws/mmfs/mm-cli/packages/playground/example-react/src/pages/account/index.tsx
          shared /Users/mo/mm/ws/mmfs/mm-cli/packages/playground/example-react/src/pages/shared/index.tsx
         foo/bar /Users/mo/mm/ws/mmfs/mm-cli/packages/playground/example-react/src/pages/foo/bar/index.tsx
```

## WEEK 05
* [FIX] 多入口构建修改 `abc.json` 异常。
* [CHORE]
  * 美化 RC 配置界面。
  * 对于尚未发布的套件，在本地执行命令，检测 tnpm 版本时报错。
  * 为一些莫名其妙的日志输出添加关键字，方便定位问题。
  * 检测并提示 Webpack 配置项 entry、output，如果默认配置与自定义配置不一致，则提示并优先采用自定义配置。
  * 本地服务：先强制关闭指定端口，再执行 dev 启动本地服务。
  * 不再支持环境变量 process.env.BUILD_DEST。
  * 合并 React 套件的 DevConfigure 和 BuildConfigure。
  * React 套件增加 `mm dev --mock [id]`，开启接口代理到 RAP（之前是，只要配置了 `rapProjectId`，就会开启代理，造成不必要的转发）。
  * 重构发布流程，支持自动 CR，优化日志输出，不再依赖过时的 @ali/alimama-deploy。


## 2020.1
* [FIX] 清除默认 webpack externals 后，webui react 报错
* [REFACTOR] 梳理所有依赖，移除无用依赖，升级过期依赖。
* [FIX] 隔离不同套件的 widgets。在本地切换多个套件的应用时，widgets 会累积，重名 widget 还会报错。
* [REFACTOR] 移除注册命令时的 kitName 或 pluginName，因为没有消费场景。
* [FEATURE] 支持套件自定义扩展问题集。

## WEEK50~53

### @ali/mm-cli-core
* [FIX] 修复测试用例运行时的临时目录。
* [REFACTOR] 本地日志从 `~/.mm/` 移至 `~/.mm/logs/`，避免工作目录 `.mm` 下产生太多文件。
* [FEATURE] 忽略权限不足的 gitlab 分组。
* [FEATURE] 校验组件名称、限定 GitLab 分组。
* [PREFORMANCE] 优化占位符替换耗时。

### @ali/mm-cli
* [REFACTOR] 命令 `add` 从默认的套件命令，上升为系统命令。
* [REFACTOR] 系统命令 `add` 调整为 `tmpl`，避免与 Magix 套件已有的 `add` 命令冲突。
* [FEATURE] 提示是否升级 CLI。
* [FEATURE] 参数 `--kit <kit>` 支持强制指定套件。

### @ali/mm-scripts
* [REFACTOR] 升级到 Webpack 5，内置支持 React Refresh、Module Federation，默认开启 Hot Module Replacement。
* [TEST] 增加测试用例，覆盖常用环境变量。
* [REFACTOR] TODO 性能优化。

### @ali/mm-kit-cell
* [TEST] 增加测试用例。

### @ali/mm-cli-server
* [FEATURE] 启动本地服务时，发送系统通知。

### @ali/mm-kit-react
* [FEATURE] `mm daily --list` 支持先选择页面再发布（即选择发布范围）。
* [FEATURE] `mm publish --list` 支持先选择页面再发布（即选择发布范围）。
* [FEATURE] 选择页面列表时，支持搜索（searchable checkbox list）。

### @ali/builder-mm-scripts
* [FEATURE] 支持自动拉取分支对应的构建范围，并执行构建和发布。

### @ali/mm-cli-webui
* [FIX] 初始化应用时丢失脚手架的 `--branch`、`--directory` 参数。

## WEEK49

### @ali/mm-cli
* [REFACTOR] 命令 `add` 支持克隆任意仓库、任意分支、任意子目录的模版代码。不再支持创建空白文件。
* [FIX] 命令 `init` 支持 `--branch`。

### @ali/mm-kit-dev
* [REFACTOR] 套件命令 `dev` 只负责转发应用 `dev` 配置。

## WEEK47 & WEEK48

### DONE
* [REFACTOR] 重构已有测试用例
  * 移除重复代码，提取公共文件 `shared.ts`。
  * 优化控制台输出，移除执行日志，只输出测试结果，方便快速查看。
* [REFACTOR] `nodemon --verbose`，输出导致任务重启的变更文档，方便调试。
* [REFACTOR] `nodemon --watch`，减少监听范围，减少内存消耗，避免无意义地重启任务。
* [REFACTOR] `yarn run dev:mece`，一个命令启动与本地开发相关的所有任务。
* [DOCS] 建立 Labels 体系。

### @ali/mm-scaffold-dev-kit
* [REFACTOR] 完善样板代码（依赖、脚本、RC 文件、测试用例、完整功能示例）。
* [TEST] 完整链路测试，完善开发、构建、测试体验。

### @ali/mm-scaffold-dev-plugin
* [REFACTOR] 完善样板代码（依赖、脚本、RC 文件、测试用例、完整功能示例）。
* [TEST] 完整链路测试，完善开发、构建、测试体验。

### @ali/mm-cli-core
* [REFACTOR] 重构代码结构。
  * `lib/platforms/index.tsx` 更内聚的实现。
  * `lib/commands/index.tsx` 更内聚的实现。

### @ali/mm-cli
* [REFACTOR] 重构代码结构。
  * `src/commands` 合并命令定义和命令实现，更精简的目录，更内聚的命令实现，更准确直观的文件命名。
  * `src/utils` 拆封工具方法到独立文件，更准确直观的方法命名，更内聚的方法实现。

### @ali/mm-cli-core
* [REFACTOR] 重构 utils 实现，将混乱的工具方法拆分到 12 个文件中：constant、mm、module、app、logger、file、process、git、tnpm、net、printf、magix。

## WEEK46
### @ali/mm-scripts
* [FIX] 命令 `dev` 开启 `--analyze` 后阻塞 `CompilerResolvedPlugin` 事件，导致 `devServer` 不启动。

### @ali/mm-kit-react
* [REFACTOR] 任务『本地开发』，优化参数表单布局。
* [REFACTOR] 任务『同步 RAP2 数据』，更合理的实现。
* [FIX] 任务『同步 RAP2 数据』，`require` 缓存 `models.json` 导致检测失效。
* [FIX] 任务『同步 RAP2 数据』，配置项 `rapper` 失效。
* [FEATURE] 命令 `mm models` 支持参数 `--yes`。
* [FEATURE] 应用 RC 配置，透出关联平台的链接，方便快速访问。
* [REFACTOR] 支持自定义任务配置：dev、build。

## WEEK45
* [REFACTOR] 废弃 kit-scripts。由 mm-scripts 提供套件/插件的构建服务。
* [REFACTOR] 废弃 utils 包。核心包 core 和工具包 utils 的定义比较相似、交叉，合二为一。

### @ali/mm-cli-webui
* [REFACTOR] 增加 SPM 埋点 https://aplus.alibaba-inc.com/aplus/page.htm?pageId=170&bu_code=e&id=a2e16k。

### @ali/mm-kit-react
* [FEATURE] 新增应用 RC 配置。
* [FEATURE] 新增应用页面管理（页面列表、本地预览地址）。
* [FEATURE] 新增依赖检查 `mm check`。
* [REFACTOR] React 套件的所有命令、部件就绪。
* [REFACTOR] 支持自定义任务配置：dev。


## WEEK44 2020.10.28
* [FIX] 修复 `scripts` 的 `dev`、`test`、`madge` 的路径配置错误。

### @ali/mm-cli-webui
* [FIX] 禁止删除当前分支和 master 分支。
* [REFACTOR] 重构创建新应用（新建、导入、克隆）。
* [REFACTOR] 重构模块（套件&插件）管理（安装、卸载）。
* [REFACTOR] 移除无效代码。

## WEEK38 2020.09.18

### @ali/mm-cli-utils
* [FEATURE] 黄金令箭支持记录内网域账号。

### @ali/mm-cli-server
* [FIX] 启动时，丢失指定的端口号。
* [FEATURE] 执行 `yarn run dev` 时，将自动启动本地服务；当（监听）文件变化时，自动重启。
* [REFACTOR] 完全重构 SocketServer，更规范的通信方式，更合理、更简洁的代码结构和实现。
* [REFACTOR] 重构目录结构，更合理的分层方式。
* [REFACTOR] 重构入口文件 index.html，更合理的全局 API 设计 `windwo.RMX.register()`。
* [REFACTOR] 重构路由 `/git` 的实现，更合理的入参。
* [REFACTOR] 重构路由 `/system` 的实现，更合理的出参。

### @ali/mm-cli-webui
* [REFACTOR] 完全重构 SocketClient，规范通信方式，更合理、更简洁的代码结构和实现。
* [REFACTOR] 页面框架的导航、菜单、任务，全部 Widget 化，保证框架、套件的一致性。
* [REFACTOR] 功能完整、分层合理、实现清晰的任务管理器。
* [REFACTOR] 重构 `README.md` 样式，与 GitHub Markdown Theme 一致，更好看。
* [REFACTOR] 重构 应用/仓库管理 的实现，拆分视图和逻辑，更清晰的代码结果和实现。
* [REFACTOR] 重构 应用/系统信息 的实现，拆分视图和逻辑，更清晰的代码结果和实现。
* [FEATURE] 工作台/导航、应用/导航，支持响应式布局。
* [REFACTOR] 移除大量面条式、补丁式代码。
* [FIX] 修复通信不规范导致的任务状态不一致。

### @ali/mm-kit-react
* [FEATURE] 增加 心跳消息 任务。

## WEEK37
* [REFACTOR] 补齐所有命令的示例部分。

### @ali/mm-plugin-clear
* [FIX] 升级依赖包 `trusted-cert`，并适配对应的 API 变化。

### @ali/mm-cli
* [PREFORMANCE] 提升插件执行速度，插件准备时间减少约 80%（例如 `mm clear`，只会加载插件 `@ali/mm-plugin-clear`）。
* [FEATURE] `mm web` 增加参数 `-p, --port <port>`，支持自定义工作台端口（默认 6868）。

### @ali/mm-core
* [FEATURE] 命令 `mm remote` 的实现，从 `@ali/mm-kit-react` 提升至 `@ali/mm-core`，方便其他套件复用。。

### @ali/mm-cli-server
* [REFACTOR] 服务日志收敛至 `~/.mm/mm-debug.log`。
* [REFACTOR] 修复和润色启动日志。

### @ali/mm-kit-scirpts
* [FIX] 完善对 `.ts|tsx` 的支持。之前 `ts-loader` 的配置缺少 `tsconfig.json`。

### @ali/mm-kit-react
* [FIX] 命令 `mm dev --proxy` 未加前缀 `sudo` 时，执行鉴权失败后，继续获取代理 IP 和 HOST 报错。
* [FEATURE] 新增命令 `mm pages`，列出当前应用的所有页面。
* [TEST] 补齐测试用例，功能覆盖率 80%。

### @ali/mm-plugin-clear
* [REFACTOR] 全部用 TS 改写，优化代码结果，优化交互文案。
* [REFACTOR] 命令 `--add <hosts>` 优化为 `--add <host[,host]>`。
* [FEATURE] 命令 `mm clear [options]` 升级为 `mm clear [options] [host[,host]]`，支持更快速地添加域名和清除缓存（等价于 `mm clear --add <host[,host]>` + `mm clear`。
* [FIX] 修复 applescript 路径错误，导致无法清空 DNS 和 HSTS。
* [TEST] 补齐测试用例，功能覆盖率 100%。

---

## WEEK36

* [CHORE] 全面检查和升级依赖包。
* [PREFORMANCE] 大幅度提升依赖安装包速度，以测试仓库 `packages/playground/example-react` 为例，从 200+s 减少至 10s 左右，约 20~30 倍。
* [PREFORMANCE] 大幅度提升云构建速度，以测试仓库 `packages/playground/example-react` 为例，从 169s 减少至 30s 左右，约 5 倍。
* [REFACTOR] 后台调试日志全部收敛至 `logger.ts`，区别于控制台输出，方便记录更详细的运行时日志和数据。
* [FEATURE] 新增 `@ali/mm-scaffold-dev-kit`。
* [FEATURE] 新增 `@ali/mm-scaffold-dev-plugin`。

### @ali/mm-cli
* [FEATURE] 命令 `mm init` 支持选项 `--directory`，用于指定脚手架仓库的子目录。
* [REFACTOR] 规范命令 `mm daily` 通信方式，完善控制台日志，用 TS 改写。
* [REFACTOR] 规范命令 `mm publish` 通信方式，完善控制台日志，用 TS 改写。
* [FEATURE] 移除无效参数 `--color`。
* [FEATURE] 自命令配置支持 `name` 和 `command`。前者是存粹的命令名，用于查找和缓存命令配置，后者还可能包含命令参数，用于注册命令。
* [REFACTOR] 后台调试日志收敛至 `src/logger.ts`，区别于控制台输出，方便记录更详细的运行时日志。
* [DOC] 新增 `mm init`、`mm dev`、`mm --help` 运行对比图。

### @ali/mm-cli-core
* [REFACTOR] 后台调试日志收敛至 `src/logger.ts`，区别于控制台输出，方便记录更详细的运行时日志。
* [REFACTOR] 套件/插件列表 ALP 地址更新 <https://mo.m.taobao.com/v1/mm_cli_module_list>。
* [FEATURE] 运行时 RC 文件支持 `iconfontScanPath`，用于指定扫面图标使用情况的目录。
* [REFACTOR] `packages/core/lib/platform/rap.js` => `packages/core/lib/platform/rap.ts`

### @ali/mm-cli-utils
* [FEATURE] 增加黄金令箭埋点工具 `goldlog(key, argv, start, end)`，用于收集 CLI 运行时日志和数据。

### @ali/mm-kit-react
* [FEATURE] 命令 `mm dev` 支持参数 `[page<,page>]`，用于指定需要构建的一个或多个页面。
* [FEATURE] 命令 `mm dev` 支持选项 `--list`，用于列出所有页面，选中后开始构建指定的一个或多个页面。
* [FEATURE] 命令 `mm dev` 支持选项 `--analyze [port]`，用于开启 `webpack-bundle-analyzer`，分析文件依赖和大小。
* [FEATURE] 命令 `mm dev` 移除选项 `--daily [ip]` 和 `--online [ip]`，改为命名合理、更简洁的代码结构和实现。的 `--proxy [ip]`。
* [REFACTOR] 命令 `mm dev` 主函数重构，优化代码组织结构、规范环境变量命名。

### @ali/mm-scripts
* [FEATURE] 支持环境变量 `PORT`，由 `mm dev --port <port>` 传入。
* [FEATURE] 支持开始 `proxy`，由 `mm dev --proxy <ip>` 传入。
* [FEATURE] 支持配置多个 Webpack `entry`，由 `mm dev [page<,page>]` 传入。
* [FEATURE] Webpack `entry` 文件支持自适配 `.js`、`.jsx`、`.ts`、`.tsx` 类型。
* [FEATURE] 应用运行时 RC 文件支持 `.rmxrc`、`.rmxrc.js`、`.rmxrc.json`。
* [FEATURE] 支持开启 `webpack-bundle-analyzer`，分析文件大小，由 `mm dev --analyze [port]` 传入。
* [REFACTOR] 后台调试日志收敛至 `src/logger.ts`，区别于控制台输出，方便记录更详细的运行时日志。
* [FIX] 修复 `mm build` 云构建出错。
* [FEATURE] 插件 html-webpack-plugin 适配环境变量 `NODE_ENV`，只在 `development` 时生效。

### @ali/mm-plugin-create-daily
* [REFACTOR] 用 TS 改写，取消对 RmxCore 实例的依赖。

### @ali/mm-plugin-clear
* [REFACTOR] 用 TypeScript 重写，更安全

---

### V2 TODO-LIST
* [TODO][REFACTOR] 测试用例重构。
* [TODO][REFACTOR] MM CLI 架构梳理：产品架构和代码架构不一致，差异很大。
* [TODO][REFACTOR] MM CLI 架构重构：Core、Command、Server、WebUI 沉淀至框架层。
* [TODO][REFACTOR] Magix 套件重构。
* [TODO][REFACTOR] Cell 套件接入。
* [X][DOCS] 建立 Labels 体系。
* [TODO][FEATURE] `mm run`