import { join } from 'path'
import * as moment from 'moment'
import { configure, getLogger } from 'log4js'
import fetch from 'node-fetch'
import { MM_HOME } from './constant'
import { getRmxConfig } from './mm'
import { cyanBright } from 'chalk'

export { getLogger }

const TODAY = moment().format('YYYY-MM-DD')

configure({
  appenders: {
    // multiFile https://log4js-node.github.io/log4js-node/multiFile.html
    file: { type: 'file', filename: join(MM_HOME, 'logs', `mm-debug_${TODAY}.log`) },
    multi: { type: 'multiFile', base: join(MM_HOME, 'logs'), property: 'categoryName', extension: '.log' },
    console: { type: 'console' }
  },
  categories: {
    default: { appenders: ['multi'], level: 'all' },
    console: { appenders: ['console'], level: 'all' }
  }
})

const console = getLogger('console')
export { console }
