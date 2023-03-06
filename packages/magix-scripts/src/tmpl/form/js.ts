export default function (name, action, path, vp, projectName) {
  if (!action) {
    action = {
      requestUrl: '/api/test',
      __modelName: 'api_test'
    }
  }

  return `
import Magix from 'magix'
import View from '${projectName}/view'
Magix.applyStyle('@./${name}.less')

export default View.extend({
  tmpl: "@${name}.html",
  init (options) {
    this.assign(options)
  },

  assign(options) {//这里处理外部传入的参数
    this.options = options
    this.updater.set({
      // options
    });
    return true; //如果外部数据变化不走当前view的render方法，则返回false，否则就不要该return语句
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
