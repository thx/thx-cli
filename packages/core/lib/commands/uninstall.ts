/**
 * rmx install 卸载套件或组件
 * 先选择套件还是插件
 * 然后列出本地已经安装的套件/插件
 * 最后选择删除
 */

import { EventEmitter } from 'events'
import * as fse from 'fs-extra'
import { MODULE_TYPE_MAP, withSpinner, RMX_HOME } from '../utils'
import logger from '../logger'

export default async function uninstall (emitter: EventEmitter, params) {
  const { type, module } = params

  await withSpinner(
    `卸载${MODULE_TYPE_MAP[type]} ${module.name} ${module.package}`,
    async (emitter: EventEmitter, params: any) => {
      const moduleDir = `${RMX_HOME}/${type}/${module.name}`
      logger.info('remove', moduleDir)
      await fse.remove(moduleDir)
    }
  )(emitter, params)
}
