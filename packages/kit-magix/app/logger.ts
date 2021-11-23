import { utils } from '@ali/mm-cli-core'
const { getLogger } = utils

const pkg = require('../package.json')
export default getLogger(pkg.name)
