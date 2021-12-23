export default function (name, action, path, vp, projectName) {
  return `
import Magix from 'magix'
import View from '${projectName}/view'
Magix.applyStyle('@./${name}.less')

export default View.extend({
  tmpl: '@${name}.html',
  init (options) {
    this.options = options
  },
  async render () {
    const loc = Magix.Router.parse()

    this.updater.digest({
      
    })
  }
})`
}
