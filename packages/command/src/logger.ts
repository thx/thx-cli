import { utils } from 'thx-cli-core'
const { getLogger } = utils

const pkg = require('../package.json')
export default getLogger(pkg.name)
