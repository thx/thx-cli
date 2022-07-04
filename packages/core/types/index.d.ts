/* eslint-disable no-use-before-define */
/// <reference types="react" />
import React from 'react'

// declare global {
declare interface Window { // eslint-disable-line no-undef
  RMX: GLOBAL_RMX,
  io: any,
  aplus_queue: Array,
  goldlog_queue: Array,
}
// }

interface GLOBAL_RMX {
  /** 当前目录 */
  cwd: string;
  /**  应用信息 */
  app: IApp;
  /** 套件 widgets */
  widgets: Array<IWidget>;
  /** 注册 widget */
  register: Function;
  /** 清空 widget */
  reset: Function;
}

/** CLI */
export type ICommandOption = [] // TODO
export type IInitCommandConfigParams = {
  /** 校验应用名称 */
  nameValidate?: (value: string, answer: any) => true | string,
  /**
   * 支持套件自定义扩展问题集
   * 格式参见 https://github.com/SBoudrias/Inquirer.js
   * 例如：
   * ```json
   * {
   *   type: 'confirm',
   *   name: 'areyouok',
   *   message: blueBright('『ARE YOU OK』：'),
   *   default: true,
   *   when (a, b, c, d) {
   *     console.log(a, b, c, d)
   *     return true
   *   }
   * }
   * ```
   */
  questions?: Array<any>,
  /** 支持限定 GitLab 分组列表 */
  unstable_groups?: Array<string | RegExp>,
  [key: string]: any
}
export interface ICommandConfig {
  /** 命令名称 */
  name?: string;
  /** 命令名称，可能包含参数 */
  command?: string;
  /** 命令别名 */
  alias?: string;
  /** 命令描述 */
  description?: string;
  options?: Array<Array<any>>;
  /** 必须为异步方法 */
  action?: Function;
  on?: Array<any>;
  /** 其他 */
  params?: IInitCommandConfigParams;
  before?: Function;
  after?: Function;
  /** init 特供 */
  __after__?: Function;
  /** 是否禁用 */
  disabled?: boolean;
}
export interface ICommandMap {
  [key: string]: ICommandConfig
}
export type ICommandList = Array<ICommandConfig>

// MO 类型定义
/** @deprecated 请改用 IApp */
export interface IProject {
  id: string;
  name?: string;
  path: string;
  description?: string;
  index?: number;
}
/** 应用 App */
export interface IPackage {
  name: string;
  version: string;
  description: string;
  scripts?: any;
  dependencies?: any;
  devDependencies?: any;
  /** @deprecated */
  rmxConfig?: any;
  magixCliConfig?: any;
  standard?: any;
  standardx?: any;
  contributors?: Array<any>;
}
/** TNPM */
export interface ITNPMPackage extends IPackage {
  readme: string;
  readmeFilename: string;
  dist: {
    shasum: string;
    size: number;
    key: string;
    tarball: string;
  };
  publish_time: number;
}
export interface IOutdatedPackage {
  name: string;
  localVersion: string;
  latestVersion: string;
}
export interface IApp {
  /** 应用标识 */
  id: string;
  /** 应用名称 */
  name?: string;
  /** 本地路径 */
  path?: string;
  /** 本地目录 TODO 感觉命名不合适 */
  basename?: string;
  /** 应用描述 */
  description?: string;
  /** 应用 package.json */
  package?: IPackage;
  /** 应用仓库信息 */
  repository?: {
    type?: 'git';
    url?: string;
    directory?: string;
    group?: string;
    name?: string;
    branch?: string;
    branchVersion?: string;
    /** @deprecated */
    // repo?: string // group + name
  };
  rmxrc?: IAppRC
}
/** 创建应用需要收集的信息 */
export interface ICreateAppInfo {
  /** 工作目录 */
  cwd: string;
  /** 套件类型 */
  kit: string;
  /** 脚手架仓库地址 */
  scaffold?: string;
  /** 脚手架仓库分支 */
  branch?: string;
  /** 脚手架仓库地址的子目录 */
  directory?: string;
  /** GitLab 分组名称 */
  group?: string;
  /** 应用名称 */
  app?: string;
  /** 是否创建 GitLab 项目 */
  gitlab?: boolean;
  /** 是否接入 DEF 云构建 */
  def?: boolean;
  /** 是否创建 RAP2 项目 */
  rap?: boolean;
  /** 是否创建 Iconfont 项目 */
  iconfont?: boolean;
  /** 是否创建 ChartPark 项目 */
  chartpark?: boolean;
  /** 是否创建 spm 埋点 */
  spma?: boolean;
  /** 是否创建 clue 项目 */
  clue?: boolean;
  /** 是否自动安装依赖 */
  install?: boolean;
  /** 套件自定义扩展问题集 */
  [key: string]: string;
  /** 创建过程中收集的额外信息。如果其中的内容变得通用，则上提一层。 */
  snapshoot?: {
    scaffoldInfo?: IScaffold;
    gitProject?: any;
    rapProject?: any;
    iconfontProject?: any;
    chartparkProject?: any;
    spma?: any;
    defInfo?: any;
  };
}

/**
  {
    "name": "union_scaffold",
    "desc": "联盟后台脚手架",
    "url": "git@gitlab.alibaba-inc.com:mm/union_scaffold.git",
    "hasExtend": true,
    "hasGitlab": true,
    "hasRap": true,
    "hasIconfont": true,
    "hasDef": true,
    "hasChartpark": true,
    "hasSpma": true,
    "hasClue": true
  }
  */
// MO TODO desc => description
// MO TODO url =>
//   "repository": {
//     "type": "git",
//     "url": "https://github.com/facebook/react.git",
//     "directory": "packages/react"
//   },

export enum IModuleType {
  KIT = 'kit',
  PLUGIN = 'plugin'
}
// export type IModuleType = 'kit' | 'plugin'
export interface IScaffold {
  /** 脚手架标识 */
  name?: string;
  /** 脚手架名称 */
  title?: string;
  /** 脚手架描述 */
  description?: string;
  /** 脚手架仓库地址 */
  repository: string;
  /** 脚手架仓库分支 */
  branch: string;
  /** 脚手架仓库的子目录 */
  directory: string;
  /** 是否替换项目名称 */
  replaceable?: boolean;
  // MO 从 https://mo.m.taobao.com/magix-cli-scaffold-list 还有其他属性，规范和含义是什么？
}
export interface ITemplate {
  /** 脚手架标识 */
  name?: string;
  /** 模版名称 */
  title?: string;
  /** 模版描述 */
  description?: string;
  /** 模版仓库地址 */
  repository: string;
  /** 模版仓库分支 */
  branch: string;
  /** 模版仓库的子目录 */
  directory: string;
  /** 模版输出目录 */
  output: string;
}
/** 套件 & 插件 info.json */
interface IModuleInfo {
  /** 协议版本 */
  porotocal?: '0.x' | '1.x' | '2.x';
  /** 套件 kit，插件 plugin */
  type: 'kit' | 'plugin';
  /** 套件 & 插件标识 */
  name: string; // MO react | magix | dev
  /** 套件 & 插件标题 */
  title: string;
  /** 套件 & 插件描述 */
  description: string;
  /** 套件 & 插件 NPM 包 */
  package: string;
  // /** @deprecated localVersion => version */
  // localVersion?: string;
  // /** @deprecated latestVersion => latest */
  // latestVersion?: string;
  /** 本地版本 */
  version?: string;
  /** 最新版本 */
  latest?: string;
  /** 是否需要升级 */
  updatable?: boolean;
  /** @deprecated 兼容 0.x 版本 */
  value?: string;
  /** @deprecated 兼容 0.x 版本 */
  alias?: string;
}

/** 套件的描述文件 info.json */
export interface IKitInfo extends IModuleInfo {
  /** 套件 kit */
  type: 'kit',
  /** 套件脚手架集合 */
  scaffolds: Array<IScaffold>,
  /** 套件模版集合 */
  templates: Array<ITemplate>
}
export interface IKitMap {
  [key: string]: IKitInfo
}
/** 套件监听的 HTTP 路由 */
export interface ISysRoute {
  method: 'get' | 'post' | 'put' | 'delete',
  path: string,
  controller: string
}
interface IKitRoute {
  method: 'get' | 'post' | 'put' | 'delete' | 'socket',
  path: string,
  controller: string
}
/** 套件监听的套接字 */
interface IKitSocket {
  type: string,
  controller: string
}
/** 套件的配置文件 config.json @deprecated */
export interface IKitRouterConfig {
  routes: Array<IKitRoute>,
  // MO TODO socket 和 routes 的结构、消费方式，有什么区别？
  sockets: Array<IKitSocket>,
}

export interface IPluginInfo extends IModuleInfo {
  /** 插件 plugin */
  type: 'plugin',
  /** 插件命令 */
  command: ICommandConfig,
}
export interface IPluginMap {
  [key: string]: IPluginInfo
}
export interface IWebUI {
  [key: string]: any
}
export interface IUser {
  /** 员工花名 */
  name?: string,
  /** 员工账号 */
  username?: string,
  /** 唯一标识 */
  id?: number,
  /** 员工头像 */
  avatar_url?: string,
  /** 员工工号 */
  extern_uid?: string
}
export interface IRMXConfig {
  port: number,
  portssl: number,
  /** @deprecated => apps */
  projects: Array<IProject>,
  apps: Array<IApp>,
  webui: IWebUI,
  user: IUser,
  iconfontToken: string,
  // MO TODO 为什么 projects 是数组，plugin(s) 是对象？
  plugin: any,
  // MO TODO
  [key: string]: any,
  // 升级提示，防疲劳间隔 1 周 = 1000 * 60 * 60 * 24 * 7
  __unstable_check_outdated_at: {
    [key: string]: number
  }
}
export const IWidgetType = 'main.nav' | 'app.nav' | 'app.task'
export interface IWidget {
  // MO 用 home 作为分组是不合理的，首先 home 没有任何含义，其次 home 可能变更为官宣页。
  /** 插件类型：首页导航 | 应用导航 | 应用任务 */
  // HOME 首页，MAIN 工作台主页（应用列表）
  type: IWidgetType; // 两层分类
  // id?: string; // 唯一标识，废弃
  /** 唯一标识 */
  name: string;
  path?: string;
  /* 插件图标 */
  icon?: React.ReactNode | string;
  /** 插件内容：component => content: React.ReactElement */
  component?: React.Component | React.FC<any, any>;
  content?: React.ReactNode;
  /* 插件描述 */
  title?: string; // 展现名
  /* 插件描述 */
  description?: string;
  /* 插件提示信息 */
  tip?: {
    content?: string;
    url?: string;
  };
  /* 插件额外配置 */
  options?: any;
  /** 插件外链，无内容，点击图标后直接打开新窗口 */
  // href?: string // 废弃
  /** 是否激活 */
  active?: boolean;
  /** 任务状态 */
  state?: string;
  /** 任务命令 */
  argv?: Array<any>;
  /** 任务执行简报（主要是状态和错误） */
  subprocessBriefing?: {
    state: string;
    code: number;
    signal: any;
    error: string;
  };
}

export interface ITaskWidgetConfigureProps {
  app: IApp,
  appId: string,
  appPath: string,
  taskWidget: IWidget,
  state: string,
  resolve: Function,
  reject: Function,
  switchTask: Function
}

export interface IModuleList {
  kits: Array<IKitInfo>,
  plugins: Array<IPluginInfo>
}

/** Git */
export interface IGitGroup {
  id: string;
  name: string;
}
export type IGitGroupList = Array<IGitGroup>
export interface IGitGroupMapById {
  [id: string]: IGitGroup
}
export interface IGitGroupMapByName {
  [name: string]: IGitGroup
}

/** Create APP */
export interface IIinitParams {
  /** 命令 */
  command?: 'mx';
  /** 命令参数 */
  options?: ['init'];
  /** 本地目录 */
  directory: string;
  /** 应用名称 name */
  appName: string;
  /** Git 分组标识 id */
  gitGroupId: string;
  /** Git 分组名称 name */
  /** 套件名称 name */
  kitName: string;
  /** 脚手架 Git 地址 url */
  scaffoldUrl: string;
  scaffoldBranch: string;
  scaffoldDirectory: string;
  gitGroupName: string;
  /** 其他 */
  gitlab: boolean;
  createRap: boolean;
  createDef: boolean;
  createIconfont: boolean;
  createSpma: boolean;
  createChartpark: boolean;
  createClue: boolean;
}
/** Clone APP */
export interface ICloneParams {
  /** 本地目录 */
  directory: string;
  /** 应用名称 name */
  appName: string;
  /** Git 仓库地址 */
  gitUrl: string;
}
/** Import APP */
export interface IImportParams {
  /** 本地目录 */
  directory?: string
}

/** GitLab Group */
export interface IGitLabGroup {
  id: number; // 252473
  name: string; // 'mmfs-playground'
  path: string; // 'mmfs-playground'
  description: string; // ''
  avatar_url: string | null;
  web_url: string; // 'http://gitlab.alibaba-inc.com/groups/mmfs-playground'
}

/** App Runtime Configuration */
export interface IIPConfig {
  [key: string]: string
}
/** App Runtime Configuration */
export interface IAppRC {
  /** 应用采用的套件标识 */
  kit: string;
  /** 如果 kit 为 dev，则用 type 区分套件或插件 */
  type?: IModuleType;
  /** GitLab 仓库地址 */
  gitlabUrl?: string;
  /** RAP 平台版本 */
  rapVersion: 1 | 2;
  /** RAP 仓库 ID */
  rapProjectId?: number;
  /** 基于关联的 RAP 仓库生成的本地模块文件路径 */
  modelsPath?: string;
  /** 是否基于 rapper 生成完整的模型配置和请求库 */
  rapper: boolean;
  /** Iconfont 项目 ID */
  iconfontId?: number;
  /** 基于关联的 Iconfont 项目生成的本地图标文件路径 */
  iconfontPath: string;
  /** 指定扫面图标使用情况的目录 */
  iconfontScanPath: string;
  /** DEF 应用 ID */
  defId: number;
  /** SPM A 配置 */
  spma: string;
  /** 黄金令箭 key */
  logkey: string;
  /** 阿里妈妈数据平台 */
  dataPlusConfigPath: string;
  /** 图表平台 ChartPark 项目 ID */
  chartParkId: number;
  /** 基于关联的 ChartPark 项目生成的本地图表文件路径 */
  chartParkIndexPath: string;
  /** Hosts 域名配置 */
  ipConfig?: IIPConfig;
  /** Webpack 配置 */
  webpack?: any;
  /** 指定依赖的远程应用 */
  __unstable_module_federation_remotes: any;
  /** 默认开启 Webpack 5 ModuleFederationPlugin。值为 false 时禁用。 */
  __unstable_module_federation?: false;
  /** 应用自定义代理服务 */
  __unstable_dev_server_before?: Function;
  __unstable_dev_server_proxy?: any;
  /** 应用自定义映射 @deprecated */
  // __unstable_resolve_alias?: {
  //   [index:string]:string
  // }
  /** 环境变量 */
  __unstable_env?: {
    [key: string]: string
  };
  /** 默认关闭 Webpack HtmlWebpackPlugin。值为 true 时启用。 */
  __unstable_html_webpack_plugin?: true | undefined;
  /** 默认自动在浏览器中打开本地服务。值为 false 时禁用。 */
  __unstable_auto_open?: false | undefined;
  /** 插件 @ali/mm-plugin-create-daily 配置项 */
  createDailyHook?: string;
  /** ALP Portal 配置 */
  alpJsonpId: number;
  /** @deprecated 支持 RAP2 场景代理，临时过渡方案。 */
  __unstable_rap2_scene_proxy?: {
    [key: string]: string
  }
}

/** RAP2 */
export interface IRAPRepository {
  id: number;
  name: string;
  description: string;
  modules: Array<IRAPModule>;
  collaborators: Array<IRAPRepository>;
}
export interface IRAPModule {
  id: number;
  name: string;
  description: string;
  interfaces: Array<IRAPInterface>;
}
export interface IRAPInterface {
  repositoryId: number;
  moduleId: number;
  id: number;
  name: string;
  description: string;
  url: string;
  method: string;
  properties: Array<IRAPProperty>;
  updatedAt: string;
}
export interface IRAPProperty {
  id: number;
  name: string;
  description: string;
  scope: 'request' | 'response';
  type: string;
  value: any;
}
export interface IRAPModel {
  __id__?: number | string;
  __name__?: string;
  __remote__?: string;
  __updatedAt__?: string;
  name: string;
  url: string;
  method: string;
  /** 变更原因，不持久化 */
  __reason__?: {
    id?: boolean | number | string;
    name?: boolean | string;
    url?: boolean | string;
    method?: boolean | string;
  };
  /** 影响文件，不持久化 */
  __consequences__?: Array<string>;
}
export interface IRAPModelMap {
  [key: string]: IRAPModel
}
export interface IRAPModelMapByMethodAndUrl {
  [key: string]: Array<IRAPModel>
}
export interface IRAPInterfaceMap {
  [key: string]: IRAPInterface
}
export interface IRAPInterfaceMapByMethodAndUrl {
  [key: string]: Array<IRAPInterface>
}

/** MM CLI Server */
export interface IAppInitPayload {
  appId: string
}
export interface ITaskInitPayload {
  appId: string,
  taskName: string
}
export interface ITaskClosePayload {
  socketId: string,
  appId: string,
  taskName: string
}
export interface ITaskResolvePayload {
  appId: string,
  appPath: string,
  taskName: string,
  argv: Array<any>
}
export interface ITaskRejectPayload {
  appId: string,
  taskName: string
}
export interface ITaskLogPayload {
  appId: string,
  taskName: string,
  log?: string
}
export interface ITaskChunkPayload {
  appId: string,
  taskName: string,
  chunk?: string
}
export interface ITaskClearPayload {
  appId: string,
  taskName: string
}
