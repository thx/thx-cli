import { getLogger } from './utils/logger'

const pkg = require('../package.json')
export default getLogger(pkg.name)
