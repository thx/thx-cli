import util from '../../../../util/util'

/**
 * websocket接口: getMagixCliConfig
 * 说明：返回项目的package.json里的magixCliConfig配置
 */
export default async function () {
  const magixCliConfig = await util.getMagixCliConfig()

  return {
    ok: true,
    data: magixCliConfig
  }
}
