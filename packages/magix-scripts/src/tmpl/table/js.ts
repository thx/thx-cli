
export default function (name, action, path, vp, projectName) {
  return `
    import Magix from 'magix'
    import View from '${projectName}/view'
    Magix.applyStyle('@./${name}.less')
    const paramsStr = ['page', 'pageSize']
    
    export default View.extend({
        tmpl: '@${name}.html',
        init (options) {
          this.options = options
          this.observeLocation(paramsStr)
        },
        async render () {
          const params = {
            relationType: 1
          }
          const loc = Magix.Router.parse()
          paramsStr.forEach(item => {
            const val = loc.get(item)
            if (val) {
                params[item] = val
            }
          })

          params.pageSize = params.pageSize || 20
          params.page = params.page || 1

          ${action && action.__modelName
              ? `    
            try {
              const models = [{
                  name: '${action.__modelName}',
                  params: { query: params }
              }]
              const [model] = await this.fetch(models)
              const data = model.get('data')


              this.updater.digest({
                  list: model.get('data.result', []),
                  total: model.get('data.pageInfo.itemTotal'),
                  params
              })

              return data
            } catch (error) {
              this.alert('错误提示', error.msg || error.message, null, {mask: true})
            }
          `
          : `
            this.updater.digest({
              list: [],
              total: 0,
              params
            })
          `}
        },
    
        'setDate<change>' (e) {
          const dates = e.dates
          const params = this.updater.get('params')
          const tag = e.params.tag
          params[tag + 'Min'] = dates.startStr
          params[tag + 'Max'] = dates.endStr
        },
        'submit<click>' (e) {
          const params = this.updater.get('params')
          params.perPageSize = ''
          params.toPage = ''
          Magix.Router.to(params)
        },
        'reset<click>' (e) {
          const params = this.updater.get('params')
          params.forEach((value, key) => {
              params[key] = ''
          })
          Magix.Router.to(params)
        },
        'changePage<change>' (e) {
          Magix.Router.to({
              perPageSize: e.state.size,
              toPage: e.state.page
          });
        }
    })
    `
}
