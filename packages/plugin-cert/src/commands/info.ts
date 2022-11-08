import { SSL_CONFIG_FILE } from '../config/index'
import * as fse from 'fs-extra'

export async function info() {
  if (await fse.pathExists(SSL_CONFIG_FILE)) {
    const configs = await fse.readJson(SSL_CONFIG_FILE)
    console.log('本地自签名证书支持的域名列表：', configs.domains)
  }
}
