import * as fse from 'fs-extra'
import { utils } from 'thx-cli-core'
import * as path from 'path'

/**
 * websocket接口: saveMagixCliConfig
 * 说明：保存项目的package.json里的magixCliConfig配置
 */
export default async function (params) {
  const rootPath = await utils.getAppPath()
  const pkgPath = path.resolve(rootPath, 'package.json')
  const localPkg = await fse.readJson(pkgPath)
  localPkg.magixCliConfig = params
  await fse.outputFile(pkgPath, JSON.stringify(localPkg, null, 2), 'utf-8')

  return {
    ok: true
  }
}
