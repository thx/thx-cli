const rapAPIPrefixMap = {
  1: 'rap.alibaba-inc.com/mockjsdata/',
  2: 'rap2api.alibaba-inc.com/app/mock/'
}

const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))

export default function (opts = {
  rapVersion: '',
  projectId: ''
}) {
  return function * rap (next) {
    const rapVersion = opts.rapVersion || '2' // 默认用rap2
    const rapAPIPrefix = rapAPIPrefixMap[rapVersion]

    // RAP项目id来自于命令行参数-i，其次取opts里的配置
    const projectId = argv.i || opts.projectId || ''
    this.isRap = true // 标识现在是rap请求
    this.rapProjectId = projectId

    // rap2
    if (rapVersion === '2') {
      this.protocolAlias = 'https'
      this.proxyPass = `${rapAPIPrefix + projectId}/${this.request.method}`
      // this.request.method = 'GET'
      this.isChangeOrigin = true // https需要设置header.host
    } else {
      // rap1
      this.proxyPass = rapAPIPrefix + projectId
    }

    yield next
  }
}
