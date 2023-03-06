export default function (name, action, path, vp, projectName) {
  return `
import Magix from 'magix'
import View from '${projectName}/view'
Magix.applyStyle('@./${name}.less')

export default View.extend({
  tmpl: '@${name}.html',
  init (options) {
    this.assign(options)
    this.observeLocation([])
  },

  assign(options) {//这里处理外部传入的参数
    this.options = options
    this.updater.set({
      // options
    });
    return true; //如果外部数据变化不走当前view的render方法，则返回false，否则就不要该return语句
  },
  
  async render () {
    const loc = Magix.Router.parse()

    this.updater.digest({
      
    })
  }
})`
}
