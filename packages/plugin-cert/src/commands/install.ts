import * as mkcert from 'mkcert'
import * as fse from 'fs-extra'
import { addStore } from '../platform/darwin'
import { addStore as addStoreWin } from '../platform/win32'
import { addStore as addStoreLinux } from '../platform/linux'
import { uninstall } from './uninstall'
import { info } from './info'

import {
  SSL_CERTIFICATE_DIR,
  SSL_CONFIG_FILE,
  SSL_KEY_PATH,
  SSL_CRT_PATH,
  CN,
  DEFAULT_DOMAINS,
  VALIDITY_DAYS
} from '../config/index'

export async function install(domains?) {
  // 如果已经存在了，先删除现有的自签证书
  if (await fse.pathExists(SSL_CRT_PATH)) {
    await uninstall()
  }

  // create a certificate authority
  const ca = await mkcert.createCA({
    organization: CN,
    countryCode: 'CN',
    state: 'ZJ',
    locality: 'HZ',
    validityDays: VALIDITY_DAYS
  })
  // then create a tls certificate
  const cert = await mkcert.createCert({
    domains: domains ?? DEFAULT_DOMAINS,
    validityDays: VALIDITY_DAYS,
    caKey: ca.key,
    caCert: ca.cert
  })

  // 本地domains配置
  await fse.outputJson(SSL_CONFIG_FILE, {
    domains: domains ?? DEFAULT_DOMAINS
  })

  // ca
  await fse.outputFile(`${SSL_CERTIFICATE_DIR}/ca.key`, ca.key)
  await fse.outputFile(`${SSL_CERTIFICATE_DIR}/ca.crt`, ca.cert)
  // cert
  await fse.outputFile(SSL_KEY_PATH, cert.key)
  await fse.outputFile(SSL_CRT_PATH, cert.cert)

  console.log('成功创建证书文件，文件位于 %o 目录下', SSL_CERTIFICATE_DIR)

  switch (process.platform) {
    case 'darwin':
      await addStore(`${SSL_CERTIFICATE_DIR}/ca.crt`)
      await addStore(SSL_CRT_PATH)
      break
    case 'linux':
      await addStoreLinux(SSL_CRT_PATH)
      break
    case 'win32':
      await addStoreWin(SSL_CRT_PATH)
      break
  }

  //
  await info()
}
