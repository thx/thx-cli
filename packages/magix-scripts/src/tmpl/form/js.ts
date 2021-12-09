
export default function (name, action, path) {
  if (!action) {
    action = {
      requestUrl: '/api/test',
      __modelName: 'api_test'
    }
  }

  return `
import Magix from 'magix'
import View from '${path}/view'
Magix.applyStyle('@./${name}.less')

export default View.extend({
  tmpl: "@${name}.html",
  init (options) {
    this.options = options
  },
  async render (e) {
    this.updater.digest({})
  },
  async 'submit<click>' () {
    const formParams = {}

    try {
      const [model] = await this.fetch([{
        name: '${action.__modelName}',
        formParams
      }])
      const data = model.get('data')
    } catch (err) {
      this.alert('错误提示', err.msg || err.message, null, {mask: true})
    }

  }
});
    `
}
