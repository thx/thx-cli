import Daily from './pageComponent/daily'
import Dev from './pageComponent/dev'
import Models from './pageComponent/models'
// import WebTestCommand from './pageComponent/test'
// import Iconfont from './pageComponent/iconfont'
// import Spmlog from './pageComponent/spmlog'
// import Chartpark from './pageComponent/chartpark'
// import Gallery from './pageComponent/gallery'
// import Publish from './pageComponent/publish'
import Iconfont from './pageComponent/iconfont'
import Spmlog from './pageComponent/spmlog'
import Chartpark from './pageComponent/chartpark'
import Gallery from './pageComponent/gallery'
import Publish from './pageComponent/publish'
import CliConfig from './pageComponent/cliConfig'

export default [
  // {
  //   type: 'app.nav',
  //   name: 'cliconfig',
  //   component: CliConfig,
  //   title: '应用配置'
  // },
  {
    type: 'app.task',
    name: 'dev',
    component: Dev,
    title: '本地开发'
  },
  {
    type: 'app.task',
    name: 'models',
    component: Models,
    title: '同步 RAP'
  },
  {
    type: 'app.task',
    name: 'iconfont',
    component: Iconfont,
    title: '同步 Iconfont'
  },

  {
    type: 'app.task',
    name: 'chartpark',
    component: Chartpark,
    title: '同步 Charkpark'
  },

  {
    type: 'app.task',
    name: 'gallery',
    component: Gallery,
    title: '同步 Gallery 组件'
  },

  {
    type: 'app.task',
    name: 'spmlog',
    component: Spmlog,
    title: '打点 spmlog'
  },

  {
    type: 'app.task',
    name: 'daily',
    component: Daily,
    title: '日常部署'
  },

  {
    type: 'app.task',
    name: 'publish',
    component: Publish,
    title: '正式部署'
  }
]

// webui.register({
//   path:'app.task',
//   component : WebTestCommand,
//   name: 'test',
//   title: 'test Socket'
// })

/**
 * MO 注册动作不应该放到套件、插件中。
 * 这里应该返回 UI 插件配置。
 */
