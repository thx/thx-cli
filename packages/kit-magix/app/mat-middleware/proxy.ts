const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))

export default function (opts = {
  protocolAlias: '',
  proxyPass: '',
  projectId: ''
}) {
  return function * proxy (next) {
    this.protocolAlias = opts.protocolAlias
    this.proxyPass = opts.proxyPass || argv.d || argv.o
    this.rapProjectId = opts.projectId
    yield next
  }
}
