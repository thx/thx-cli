// import WebTestCommand from './pageComponent/test'
// import Iconfont from './pageComponent/iconfont'
// import Spmlog from './pageComponent/spmlog'
// import Chartpark from './pageComponent/chartpark'
// import Gallery from './pageComponent/gallery'
// import Publish from './pageComponent/publish'
// import './index.css'

import widgets from './widgets'

console.groupCollapsed('Magix Widgets')
console.log(widgets)
console.groupEnd()

window.RMX.reset()
widgets.forEach(widget => {
  window.RMX.register(widget)
})
