import { utils } from 'thx-cli-core'
import { Logger } from 'log4js'
const { getLogger } = utils

const pkg = require('../package.json')
const logger: Logger = getLogger(pkg.name)
export default logger
