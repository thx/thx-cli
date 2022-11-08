import { removeFromStore } from '../platform/darwin'
import * as fse from 'fs-extra'
import {
  SSL_CERTIFICATE_DIR,
  SSL_CONFIG_FILE,
  SSL_CRT_PATH,
  CN
} from '../config/index'

export async function uninstall() {
  if (await fse.pathExists(SSL_CRT_PATH)) {
    let configs

    try {
      configs = await fse.readJson(SSL_CONFIG_FILE)
    } catch (error) {}

    // 删除生成的证书
    await fse.remove(SSL_CERTIFICATE_DIR)
    // 从钥匙串里移除信任的证书
    await removeFromStore(CN)
    await removeFromStore(configs?.domains?.[0])

    console.log('本地自签名证书移除成功！')
  }
}
